#!/usr/bin/env node
// oxlint-disable no-undef

import "~nodejs";
import * as ts from "typescript";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

type Category = "methods" | "callbacks" | "data_writable" | "data_readonly";

type GroupedMembers = Record<Category, string[]>;

type MemberMap = Map<string, Category>;

type ElementOutput = {
  interface: string;
} & GroupedMembers;

type NullableElementOutput = ElementOutput | null;

interface CliArgs {
  inputPath: string;
  outPath?: string;
}

interface Output {
  source?: string;
  HTMLElement: GroupedMembers;
  elements: Record<string, NullableElementOutput>;
  warnings: string[];
}

const args = parseArgs(process.argv.slice(2));
const warnings: string[] = [];

const sourceText = await readFile(args.inputPath, "utf8");

const sourceFile = ts.createSourceFile(args.inputPath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

const interfaces = collectInterfaces(sourceFile);
const typeAliases = collectTypeAliases(sourceFile);

const HTMLElement = groupInterfaceMembers("HTMLElement", {
  stopBefore: new Set(),
});

const tagNameMap = readHTMLElementTagNameMap();

const elements: Record<string, NullableElementOutput> = Object.fromEntries(
  [...tagNameMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([tagName, interfaceName]) => {
      if (interfaceName === "HTMLElement") {
        return [tagName, null];
      }

      const grouped = groupInterfaceMembers(interfaceName, {
        stopBefore: new Set(["HTMLElement"]),
      });

      if (isEmptyGroupedMembers(grouped)) {
        return [tagName, null];
      }

      return [
        tagName,
        {
          interface: interfaceName,
          ...grouped,
        },
      ];
    }),
);

const output: Output = {
  source: args.inputPath,
  HTMLElement,
  elements,
  warnings,
};

const multiTags = {
  HTMLTableColElement: 'COL" | "COLGROUP',
  HTMLQuoteElement: 'Q" | "BLOCKQUOTE',
  HTMLTableSectionElement: 'TBODY" | "TFOOT" | "THEAD',
  HTMLTableCellElement: 'TD" | "TH',
  HTMLModElement: 'DEL" | "INS',
} as Record<string, string>;

const inter = Object.entries(output.elements).flatMap(([k, el]) => {
  if (!el) return [];
  if (!(el.data_writable.length || el.data_readonly.length || el.callbacks.length)) {
    if (el.methods[0] !== "addEventListener" && el.methods[1] !== "removeEventListener") console.log(el);
    return [];
  } else {
    return `interface ${el.interface} {
      tagName: "${multiTags[el.interface] || k.toUpperCase()}"
}`;
  }
});

delete output.source;
const tsContnet = `export default ${JSON.stringify(output, null, 2)} as const\n /*\n${inter.join("\n")}\n*/\n`;

if (args.outPath) {
  await writeFile(args.outPath, tsContnet, "utf8");
} else {
  process.stdout.write(tsContnet);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv: string[]): CliArgs {
  let inputPath: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--input") {
      inputPath = resolveRequiredArg(argv[++i], "--input");
      continue;
    }

    if (!arg.startsWith("--") && !inputPath) {
      inputPath = resolve(arg);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  const fromRoot = (...s: string[]) => resolve(import.meta.dirname, "..", ...s);

  return {
    inputPath: inputPath ?? fromRoot("node_modules", "@types", "web", "index.d.ts"),
    outPath: fromRoot("src/html/__members__.gen.ts"),
  };
}

function resolveRequiredArg(value: string | undefined, flag: string): string {
  if (!value) {
    throw new Error(`Missing value after ${flag}`);
  }

  return resolve(value);
}

// ---------------------------------------------------------------------------
// Collection
// ---------------------------------------------------------------------------

function collectInterfaces(sf: ts.SourceFile): Map<string, ts.InterfaceDeclaration[]> {
  const result = new Map<string, ts.InterfaceDeclaration[]>();

  function visit(node: ts.Node): void {
    if (ts.isInterfaceDeclaration(node)) {
      const name = node.name.text;
      const declarations = result.get(name) ?? [];

      declarations.push(node);
      result.set(name, declarations);
    }

    ts.forEachChild(node, visit);
  }

  visit(sf);

  return result;
}

function collectTypeAliases(sf: ts.SourceFile): Map<string, ts.TypeAliasDeclaration> {
  const result = new Map<string, ts.TypeAliasDeclaration>();

  function visit(node: ts.Node): void {
    if (ts.isTypeAliasDeclaration(node)) {
      result.set(node.name.text, node);
    }

    ts.forEachChild(node, visit);
  }

  visit(sf);

  return result;
}

// ---------------------------------------------------------------------------
// HTMLElementTagNameMap
// ---------------------------------------------------------------------------

function readHTMLElementTagNameMap(): Map<string, string> {
  const result = new Map<string, string>();
  const declarations = interfaces.get("HTMLElementTagNameMap") ?? [];

  if (declarations.length === 0) {
    warnings.push("Interface HTMLElementTagNameMap was not found.");
    return result;
  }

  for (const declaration of declarations) {
    for (const member of declaration.members) {
      if (!ts.isPropertySignature(member)) continue;

      if (hasDeprecatedJSDoc(member)) {
        continue;
      }

      const tagName = readPropertyName(member.name);
      if (!tagName) continue;

      const interfaceName = member.type ? readTypeReferenceName(member.type) : undefined;

      if (!interfaceName) {
        warnings.push(`Could not read element interface for tag "${tagName}".`);
        continue;
      }

      result.set(tagName, interfaceName);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Interface traversal
// ---------------------------------------------------------------------------

function groupInterfaceMembers(
  interfaceName: string,
  options: {
    stopBefore: Set<string>;
  },
): GroupedMembers {
  const memberMap = collectResolvedMembers(interfaceName, {
    seenInterfaces: new Set(),
    stopBefore: options.stopBefore,
  });

  const grouped: GroupedMembers = {
    methods: [],
    callbacks: [],
    data_writable: [],
    data_readonly: [],
  };

  for (const [name, category] of memberMap) {
    grouped[category].push(name);
  }

  grouped.methods.sort(compare);
  grouped.callbacks.sort(compare);
  grouped.data_writable.sort(compare);
  grouped.data_readonly.sort(compare);

  return grouped;
}

function collectResolvedMembers(
  interfaceName: string,
  state: {
    seenInterfaces: Set<string>;
    stopBefore: Set<string>;
  },
): MemberMap {
  const result: MemberMap = new Map();

  if (state.stopBefore.has(interfaceName)) {
    return result;
  }

  if (state.seenInterfaces.has(interfaceName)) {
    return result;
  }

  state.seenInterfaces.add(interfaceName);

  const declarations = interfaces.get(interfaceName);

  if (!declarations) {
    warnings.push(`Interface ${interfaceName} was not found.`);
    state.seenInterfaces.delete(interfaceName);
    return result;
  }

  for (const declaration of declarations) {
    if (hasDeprecatedJSDoc(declaration)) {
      continue;
    }

    for (const baseName of readBaseInterfaceNames(declaration)) {
      const baseMembers = collectResolvedMembers(baseName, state);

      for (const [name, category] of baseMembers) {
        setMergedMember(result, name, category);
      }
    }

    for (const [name, category] of collectOwnMembers(declaration)) {
      setMergedMember(result, name, category);
    }
  }

  state.seenInterfaces.delete(interfaceName);

  return result;
}

function collectOwnMembers(declaration: ts.InterfaceDeclaration): MemberMap {
  const result: MemberMap = new Map();

  for (const member of declaration.members) {
    if (hasDeprecatedJSDoc(member)) {
      continue;
    }

    const classified = classifyMember(member);

    if (!classified) {
      continue;
    }

    const [name, category] = classified;
    setMergedMember(result, name, category);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------

function classifyMember(member: ts.TypeElement): readonly [string, Category] | null {
  if (ts.isMethodSignature(member)) {
    const name = readPropertyName(member.name);
    if (!name) return null;

    return [name, "methods"];
  }

  if (ts.isPropertySignature(member)) {
    const name = readPropertyName(member.name);
    if (!name) return null;

    if (member.type && typeIsCallbackLike(member.type)) {
      return [name, "callbacks"];
    }

    return [name, hasReadonlyModifier(member) ? "data_readonly" : "data_writable"];
  }

  if (ts.isGetAccessorDeclaration(member)) {
    const name = readPropertyName(member.name);
    if (!name) return null;

    if (member.type && typeIsCallbackLike(member.type)) {
      return [name, "callbacks"];
    }

    return [name, "data_readonly"];
  }

  if (ts.isSetAccessorDeclaration(member)) {
    const name = readPropertyName(member.name);
    if (!name) return null;

    const valueParameter = member.parameters[0];

    if (valueParameter?.type && typeIsCallbackLike(valueParameter.type)) {
      return [name, "callbacks"];
    }

    return [name, "data_writable"];
  }

  return null;
}

function setMergedMember(memberMap: MemberMap, name: string, category: Category): void {
  memberMap.set(name, mergeCategory(memberMap.get(name), category));
}

function mergeCategory(previous: Category | undefined, next: Category): Category {
  if (!previous) return next;

  if (previous === next) {
    return previous;
  }

  if (previous === "methods" || next === "methods") {
    return "methods";
  }

  if (previous === "callbacks" || next === "callbacks") {
    return "callbacks";
  }

  if (previous === "data_writable" || next === "data_writable") {
    return "data_writable";
  }

  return "data_readonly";
}

// ---------------------------------------------------------------------------
// Deprecated filtering
// ---------------------------------------------------------------------------

function hasDeprecatedJSDoc(node: ts.Node): boolean {
  return ts.getJSDocTags(node).some((tag) => tag.tagName.getText(sourceFile) === "deprecated");
}

// ---------------------------------------------------------------------------
// Callback detection
//
// Do not classify by /^on/i.
// Example: `onLine` is data, not a callback.
//
// Callback-like means:
// - function type
// - union/intersection containing a function type
// - type literal with call signature
// - alias resolving to a function-like type
// - known DOM callback/listener alias names
// ---------------------------------------------------------------------------

function typeIsCallbackLike(node: ts.TypeNode, seenAliases: Set<string> = new Set()): boolean {
  if (ts.isFunctionTypeNode(node)) {
    return true;
  }

  if (ts.isUnionTypeNode(node)) {
    return node.types.some((type) => typeIsCallbackLike(type, seenAliases));
  }

  if (ts.isIntersectionTypeNode(node)) {
    return node.types.some((type) => typeIsCallbackLike(type, seenAliases));
  }

  if (ts.isParenthesizedTypeNode(node)) {
    return typeIsCallbackLike(node.type, seenAliases);
  }

  if (ts.isTypeLiteralNode(node)) {
    return node.members.some((member) => ts.isCallSignatureDeclaration(member));
  }

  if (ts.isTypeReferenceNode(node)) {
    const typeName = node.typeName.getText(sourceFile);

    if (isKnownCallbackTypeName(typeName)) {
      return true;
    }

    if (seenAliases.has(typeName)) {
      return false;
    }

    const alias = typeAliases.get(typeName);
    if (!alias) {
      return false;
    }

    seenAliases.add(typeName);
    const result = typeIsCallbackLike(alias.type, seenAliases);
    seenAliases.delete(typeName);

    return result;
  }

  return false;
}

function isKnownCallbackTypeName(typeName: string): boolean {
  return (
    typeName === "EventListenerObject" ||
    typeName === "EventListenerOrEventListenerObject" ||
    /(?:EventHandler|EventHandlerNonNull|EventListener|EventListenerObject|Callback)$/.test(typeName)
  );
}

// ---------------------------------------------------------------------------
// AST helpers
// ---------------------------------------------------------------------------

function hasReadonlyModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }

  return Boolean(ts.getModifiers(node)?.some((modifier) => modifier.kind === ts.SyntaxKind.ReadonlyKeyword));
}

function readBaseInterfaceNames(declaration: ts.InterfaceDeclaration): string[] {
  const names: string[] = [];

  for (const clause of declaration.heritageClauses ?? []) {
    if (clause.token !== ts.SyntaxKind.ExtendsKeyword) continue;

    for (const type of clause.types) {
      names.push(type.expression.getText(sourceFile));
    }
  }

  return names;
}

function readPropertyName(nameNode: ts.PropertyName): string | undefined {
  if (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode) || ts.isNumericLiteral(nameNode)) {
    return nameNode.text;
  }

  if (ts.isComputedPropertyName(nameNode)) {
    return nameNode.getText(sourceFile);
  }

  return undefined;
}

function readTypeReferenceName(typeNode: ts.TypeNode): string | undefined {
  if (!ts.isTypeReferenceNode(typeNode)) {
    return undefined;
  }

  return typeNode.typeName.getText(sourceFile);
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

function isEmptyGroupedMembers(grouped: GroupedMembers): boolean {
  return (
    grouped.methods.length === 0 &&
    grouped.callbacks.length === 0 &&
    grouped.data_writable.length === 0 &&
    grouped.data_readonly.length === 0
  );
}

function compare(a: string, b: string): number {
  return a.localeCompare(b);
}
