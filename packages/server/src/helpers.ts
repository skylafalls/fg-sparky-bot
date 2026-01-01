/**
 * @license
 * fg-sparky-bot - Guess the FG number based on its symbol
 * Copyright (C) 2025 Skylafalls
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import type { Difficulties } from "./fg-sparky/numbers";
import type { Rarities } from "./numberdex/class";

export function randomDifficulty(): Difficulties {
  if (Math.random() * 60 < 1) return "legendary";
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (["easy", "medium", "hard"] as const)[Math.floor(Math.random() * 3)]!;
}

export function randomRarity(): Rarities {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (["common", "rare", "epic"] as const)[Math.floor(Math.random() * 3)]!;
}
