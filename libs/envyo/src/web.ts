// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="../node_modules/@types/web/index.d.ts" preserve="true" />

import { RemoveNoise } from "./_types";

export const web = globalThis;

type ToRemove = Depreciated | NotFullySupported | Weird | Unsafe;

web.importScripts

export type T = RemoveNoise<typeof globalThis>;

type _OK_ = Exclude<keyof RemoveNoise<typeof globalThis>, ToRemove>;
type OK_CHECK = [Exclude<_OK_, OK>, Exclude<OK, _OK_>];

export default web as T;

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

type Unsafe =
  | "alert"
  | "confirm"
  | "prompt"
  | "print"
  | "open"
  | "close"
  | "opener"
  | "postMessage"
  | "location"
  | "history"
  | "localStorage"
  | "sessionStorage";

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
  | "performance";
