// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="../node_modules/@types/web/index.d.ts" preserve="true" />

import { RemoveNoise } from "./_types";

export const web = globalThis as WebEssence;

export default web;

export type WebEssence = RemoveNoise<typeof globalThis, UpperCaseInclude, ToRemove>;

type ToRemove = Depreciated | NotFullySupported | Weird | Unsafe;

type _OK_ = Exclude<keyof RemoveNoise<typeof globalThis>, ToRemove>;
type _OK_CHECK = [Exclude<_OK_, OK>, Exclude<OK, _OK_>];

type UpperCaseInclude =
  // JS built-ins
  // | "Object"
  // | "Function"
  | "Array"
  | "Promise"
  | "Map"
  | "Set"
  | "WeakMap"
  | "WeakSet"
  | "Date"
  | "RegExp"
  | "Error"
  // | "TypeError"
  // | "SyntaxError"
  | "JSON"
  | "Math"
  | "Reflect"
  | "Proxy"
  | "Symbol"
  | "BigInt"

  // DOM core
  // | "Window"
  // | "Document"
  // | "Node"
  // | "Element"
  // | "HTMLElement"
  // | "Text"
  // | "Comment"
  // | "DocumentFragment"
  // | "ShadowRoot"

  // Events
  // | "Event"
  // | "CustomEvent"
  // | "MouseEvent"
  // | "KeyboardEvent"
  // | "PointerEvent"
  // | "InputEvent"
  // | "FocusEvent"
  // | "SubmitEvent"
  // | "DragEvent"

  // Networking / URLs / data
  | "URL"
  // | "URLSearchParams"
  // | "Request"
  // | "Response"
  // | "Headers"
  | "AbortController"
  | "AbortSignal"
  | "FormData"
  | "Blob"
  | "File"
  | "FileReader"

  // Storage / offline / DB
  // | "Storage"
  // | "Cache"
  // | "CacheStorage"
  // | "IDBDatabase"
  // | "IDBTransaction"
  // | "IDBObjectStore"
  // | "IDBRequest"
  // | "IDBKeyRange"

  // Workers / communication
  | "Worker"
  | "SharedWorker"
  | "MessageChannel"
  // | "MessagePort"
  | "BroadcastChannel"
  | "WebSocket"
  | "EventSource"

  // Observers
  | "MutationObserver"
  | "ResizeObserver"
  | "IntersectionObserver"
  | "PerformanceObserver"

  // Performance
  // | "Performance"
  // | "PerformanceEntry"
  // | "PerformanceMark"
  // | "PerformanceMeasure"
  // | "PerformanceNavigationTiming"
  // | "PerformanceResourceTiming"

  // Web components / DOM parsing
  | "CustomElementRegistry"
  | "DOMParser"
  | "XMLSerializer"

  // Canvas / media
  // | "CanvasRenderingContext2D"
  | "OffscreenCanvas"
  // | "Image"
  // | "ImageData"
  // | "Audio"
  // | "MediaStream"
  | "MediaRecorder"

  // Crypto / binary
  // | "Crypto"
  // | "CryptoKey"
  // | "SubtleCrypto"
  | "ArrayBuffer"
  | "DataView"
  | "Uint8Array"
  | "Uint16Array"
  | "Uint32Array"
  | "Int8Array"
  | "Int16Array"
  | "Int32Array"
  | "Float32Array"
  | "Float64Array";

type Depreciated =
  | "blur"
  | "captureEvents"
  | "clientInformation"
  | "escape"
  | "event"
  | "external"
  | "orientation"
  | "status"
  | "releaseEvents"
  | "unescape"
  | "webkitURL";

type NotFullySupported =
  | "cancelIdleCallback"
  | "requestIdleCallback"
  | "cookieStore"
  | "documentPictureInPicture"
  | "navigation"
  | "originAgentCluster"
  | "scheduler";

type Weird =
  | "undefined"
  | "globalThis"
  | "eval"
  | "isNaN"
  | "isFinite"
  | "blur"
  | "focus"
  | "moveBy"
  | "moveTo"
  | "resizeBy"
  | "resizeTo"
  | "stop"
  | "toString"
  | "atob"
  | "btoa"
  | "closed"
  | "frameElement"
  | "frames"
  | "length"
  | "locationbar"
  | "menubar"
  | "outerHeight"
  | "outerWidth"
  | "pageXOffset"
  | "pageYOffset"
  | "parent"
  | "personalbar"
  | "screenLeft"
  | "screenTop"
  | "screenX"
  | "screenY"
  | "scrollbars"
  | "self"
  | "statusbar"
  | "toolbar"
  | "top"
  | "window";

type Unsafe = "alert" | "confirm" | "prompt" | "open" | "close" | "opener" | "postMessage";

type OK =
  | "parseInt"
  | "parseFloat"
  | "decodeURI"
  | "decodeURIComponent"
  | "encodeURI"
  | "encodeURIComponent"
  | "getComputedStyle"
  | "getSelection"
  | "matchMedia"
  | "scroll"
  | "scrollBy"
  | "scrollTo"
  | "dispatchEvent"
  | "location"
  | "history"
  | "cancelAnimationFrame"
  | "requestAnimationFrame"
  | "clearInterval"
  | "clearTimeout"
  | "createImageBitmap"
  | "fetch"
  | "queueMicrotask"
  | "reportError"
  | "setInterval"
  | "setTimeout"
  | "structuredClone"
  | "addEventListener"
  | "removeEventListener"
  | "console"
  | "customElements"
  | "devicePixelRatio"
  | "document"
  | "innerHeight"
  | "innerWidth"
  | "navigator"
  | "screen"
  | "scrollX"
  | "scrollY"
  | "visualViewport"
  | "caches"
  | "crossOriginIsolated"
  | "crypto"
  | "indexedDB"
  | "isSecureContext"
  | "origin"
  | "speechSynthesis"
  | "print"
  | "performance"
  | "localStorage"
  | "sessionStorage";
