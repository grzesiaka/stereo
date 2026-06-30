// From: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#input_types
// by `[...$0.querySelectorAll('tr')].map(x => x.querySelector('td')?.innerText).filter(x => !!x).map(x => `"${x}"`).join(' | ')`
type HTMLInputType =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  // | "datetime" // obsolete
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

/**
 * Exists on HTMLInputElement generally.
 * Not every property is semantically useful for every type,
 * but these are safe common DOM-level props.
 */
interface InputCommonProps extends Pick<
  HTMLInputElement,
  | "name"
  | "disabled"
  | "form"
  | "defaultValue"
  | "value"
  | "labels"
  | "willValidate"
  | "validity"
  | "validationMessage"
  | "checkValidity"
  | "reportValidity"
  | "setCustomValidity"
> {
  type: HTMLInputType;
}

type AutocompleteProps = Pick<HTMLInputElement, "autocomplete">;
type DirNameProps = Pick<HTMLInputElement, "dirName">;
type ListProps = Pick<HTMLInputElement, "list">;

type TextValueProps = Pick<
  HTMLInputElement,
  "maxLength" | "minLength" | "pattern" | "placeholder" | "readOnly" | "required" | "size"
>;

type TextSelectionProps = Pick<
  HTMLInputElement,
  "selectionStart" | "selectionEnd" | "selectionDirection" | "select" | "setRangeText" | "setSelectionRange"
>;

type SelectOnlyProps = Pick<HTMLInputElement, "select">;

type DateTimeValueProps = Pick<
  HTMLInputElement,
  "min" | "max" | "step" | "readOnly" | "required" | "valueAsNumber" | "stepUp" | "stepDown"
>;

type DateLikeValueProps = DateTimeValueProps & Pick<HTMLInputElement, "valueAsDate">;

type NumericValueProps = Pick<
  HTMLInputElement,
  "min" | "max" | "step" | "readOnly" | "required" | "placeholder" | "valueAsNumber" | "stepUp" | "stepDown"
>;

type RangeValueProps = Pick<HTMLInputElement, "min" | "max" | "step" | "valueAsNumber" | "stepUp" | "stepDown">;

type CheckedValueProps = Pick<HTMLInputElement, "checked" | "defaultChecked" | "required">;

type SubmitterProps = Pick<
  HTMLInputElement,
  "formAction" | "formEnctype" | "formMethod" | "formNoValidate" | "formTarget"
>;

type ImageButtonProps = Pick<HTMLInputElement, "alt" | "src" | "width" | "height">;

type FileValueProps = Pick<HTMLInputElement, "accept" | "files" | "multiple" | "required">;

/**
 * Newer color-input props from the HTML spec.
 * Some TypeScript lib.dom versions may not yet expose these.
 */
interface ColorExtraProps {
  alpha?: boolean;
  colorSpace?: "limited-srgb" | "display-p3" | (string & {});
}

/**
 * Popover target properties are applicable to button-like inputs
 * in the HTML spec. Some TS versions may not yet expose them directly
 * on HTMLInputElement.
 */
interface PopoverTargetProps {
  popoverTargetElement?: Element | null;
  popoverTargetAction?: "toggle" | "show" | "hide" | (string & {});
}

/* ------------------------------------------------------------------ */
/* Per-type interfaces                                                 */
/* ------------------------------------------------------------------ */

export interface HiddenInputProps extends InputCommonProps, AutocompleteProps, DirNameProps {
  type: "hidden";
}

export interface TextInputProps
  extends InputCommonProps, AutocompleteProps, DirNameProps, ListProps, TextValueProps, TextSelectionProps {
  type: "text";
}

export interface SearchInputProps
  extends InputCommonProps, AutocompleteProps, DirNameProps, ListProps, TextValueProps, TextSelectionProps {
  type: "search";
}

export interface TelInputProps
  extends InputCommonProps, AutocompleteProps, DirNameProps, ListProps, TextValueProps, TextSelectionProps {
  type: "tel";
}

export interface UrlInputProps
  extends InputCommonProps, AutocompleteProps, DirNameProps, ListProps, TextValueProps, TextSelectionProps {
  type: "url";
}

export interface EmailInputProps
  extends
    InputCommonProps,
    AutocompleteProps,
    DirNameProps,
    ListProps,
    TextValueProps,
    SelectOnlyProps,
    Pick<HTMLInputElement, "multiple"> {
  type: "email";
}

export interface PasswordInputProps
  extends InputCommonProps, AutocompleteProps, DirNameProps, TextValueProps, TextSelectionProps {
  type: "password";
}

export interface DateInputProps
  extends InputCommonProps, AutocompleteProps, ListProps, DateLikeValueProps, SelectOnlyProps {
  type: "date";
}

export interface MonthInputProps
  extends InputCommonProps, AutocompleteProps, ListProps, DateLikeValueProps, SelectOnlyProps {
  type: "month";
}

export interface WeekInputProps
  extends InputCommonProps, AutocompleteProps, ListProps, DateLikeValueProps, SelectOnlyProps {
  type: "week";
}

export interface TimeInputProps
  extends InputCommonProps, AutocompleteProps, ListProps, DateLikeValueProps, SelectOnlyProps {
  type: "time";
}

export interface DateTimeLocalInputProps
  extends InputCommonProps, AutocompleteProps, ListProps, DateTimeValueProps, SelectOnlyProps {
  type: "datetime-local";
}

export interface NumberInputProps
  extends InputCommonProps, AutocompleteProps, ListProps, NumericValueProps, SelectOnlyProps {
  type: "number";
}

export interface RangeInputProps extends InputCommonProps, AutocompleteProps, ListProps, RangeValueProps {
  type: "range";
}

export interface ColorInputProps
  extends InputCommonProps, AutocompleteProps, ListProps, ColorExtraProps, SelectOnlyProps {
  type: "color";
}

export interface CheckboxInputProps
  extends InputCommonProps, CheckedValueProps, Pick<HTMLInputElement, "indeterminate"> {
  type: "checkbox";
}

export interface RadioInputProps extends InputCommonProps, CheckedValueProps {
  type: "radio";
}

export interface FileInputProps extends InputCommonProps, FileValueProps, SelectOnlyProps {
  type: "file";
}

export interface SubmitInputProps extends InputCommonProps, DirNameProps, SubmitterProps, PopoverTargetProps {
  type: "submit";
}

export interface ImageInputProps extends InputCommonProps, SubmitterProps, ImageButtonProps, PopoverTargetProps {
  type: "image";
}

export interface ResetInputProps extends InputCommonProps, PopoverTargetProps {
  type: "reset";
}

export interface ButtonInputProps extends InputCommonProps, PopoverTargetProps {
  type: "button";
}

export type InputPropsByType = {
  hidden: HiddenInputProps;
  text: TextInputProps;
  search: SearchInputProps;
  tel: TelInputProps;
  url: UrlInputProps;
  email: EmailInputProps;
  password: PasswordInputProps;
  date: DateInputProps;
  month: MonthInputProps;
  week: WeekInputProps;
  time: TimeInputProps;
  "datetime-local": DateTimeLocalInputProps;
  number: NumberInputProps;
  range: RangeInputProps;
  color: ColorInputProps;
  checkbox: CheckboxInputProps;
  radio: RadioInputProps;
  file: FileInputProps;
  submit: SubmitInputProps;
  image: ImageInputProps;
  reset: ResetInputProps;
  button: ButtonInputProps;
};

export type AnyInputProps = InputPropsByType[keyof InputPropsByType];

export type PropsForInputType<T extends HTMLInputType> = InputPropsByType[T];

// const e = 1 as any as HTMLInputElement;
