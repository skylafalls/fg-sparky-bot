/**
 * @license
 * fg-sparky-bot - Guess the FG number based on its symbol
 * Copyright (C) 2025 Skylafalls
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { Logger } from "./logger";

export function assert(condition: unknown, message = "assertion failed"): asserts condition {
  if (!condition) {
    Logger.error(message);
    throw new Error(message);
  }
}
