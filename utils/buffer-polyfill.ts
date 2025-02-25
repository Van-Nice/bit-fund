import { Buffer as BufferPolyfill } from "buffer";

if (typeof window !== "undefined") {
  if (!window.Buffer) {
    window.Buffer = BufferPolyfill;
  }
}

export const Buffer = window.Buffer || BufferPolyfill;
