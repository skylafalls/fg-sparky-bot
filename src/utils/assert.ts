import { Logger } from "./logger";

export function assert(condition: unknown, message = "assertion failed"): asserts condition {
  if (!condition) {
    Logger.error(message);
    throw new Error(message);
  }
}
