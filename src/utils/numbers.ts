/**
 * @license
 * fg-sparky-bot - Guess the FG number based on its symbol
 * Copyright (C) 2025 Skylafalls
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import numbers from "../../numbers/numbers.json" with { type: "json" };

export function getGainFromDifficulty(difficulty: "easy" | "medium" | "hard" | "legendary"): 10 | 25 | 50 | 500 {
  switch (difficulty) {
    case "easy": {
      return 10;
    }
    case "medium": {
      return 25;
    }
    case "hard": {
      return 50;
    }
    case "legendary": {
      return 500;
    }
  }
}

export function ordinalOf(number: number): `${number}${"st" | "nd" | "rd" | "th"}` {
  const j = number % 10,
    k = number % 100;
  if (j === 1 && k !== 11) {
    return `${number}st`;
  }
  if (j === 2 && k !== 12) {
    return `${number}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${number}rd`;
  }
  return `${number}th`;
}

export function countEntriesUnique(difficulty: "easy" | "medium" | "hard" | "legendary", entries: string[]): number {
  const filtered = numbers[difficulty].filter((entry) => {
    for (const uuid of entries) {
      if (entry.uuid === uuid) return true;
    }
    return false;
  });
  return filtered.length;
}

export function countEntriesTotal(difficulty: "easy" | "medium" | "hard" | "legendary", entries: string[]): number {
  const filtered = entries.filter((uuid) => {
    for (const entry of numbers[difficulty]) {
      if (uuid === entry.uuid) return true;
    }
    return false;
  });
  return filtered.length;
}
