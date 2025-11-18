/**
 * @license
 * fg-sparky-bot - Guess the FG number based on its symbol
 * Copyright (C) 2025 Skylafalls
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
import { CryptoHasher } from "bun";
import type { Message, OmitPartialGroupDMChannel } from "discord.js";
import numbers from "../numbers/numbers.json" with { type: "json" };
import { Logger } from "../utils/logger";

export type Difficulties = "easy" | "medium" | "hard" | "random";

export interface NumberInfo {
  number: string | null;
  hashedNumber: string;
  symbol: string;
  difficulty: "easy" | "medium" | "hard" | "legendary";
}

function getRandomDifficulty(): "easy" | "medium" | "hard" | "legendary" {
  if (Math.random() * 60 < 1) return "legendary";
  // uhh i kinda need the non-null assertion here cause it's not gonna be undefined
  const number = Math.floor(Math.random() * 3);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  Logger.debug(`Random number generated: ${number.toString()} (corresponds to ${(["easy", "medium", "hard"] as const)[number]!})`);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (["easy", "medium", "hard"] as const)[number]!;
}

export function findRandomNumber(difficulty: Difficulties): NumberInfo {
  const actualDifficulty = difficulty === "random" ? getRandomDifficulty() : difficulty;
  const numberPool = numbers[actualDifficulty];
  const randomIndex = Math.floor(Math.random() * numberPool.length);
  const number = numberPool[randomIndex];
  // Uh yeah same here
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { number: number?.name ?? null, hashedNumber: number!.hashedName, symbol: number!.image, difficulty: actualDifficulty };
}

const hasher = new CryptoHasher("sha512");

export function handlePlayerGuess(message: OmitPartialGroupDMChannel<Message>, number: NumberInfo): boolean | undefined {
  if (message.author.bot) return;
  // Normalize the player's guess to a standard form to avoid weird os issues
  // like macos replacing "..." with "…" (elipis) or replacing ' with ’
  const guess = message.content.toLowerCase()
    .replaceAll(/’|‘/gu, "'") // Variants of single quotation marks
    .replaceAll(/“|”/gu, "'") // Variants of double quotation marks
    .replaceAll("…", "..."); // Ellipsis
  const hashedGuess = hasher.update(guess, "utf-8").digest("hex");
  Logger.debug(`User guessed: ${guess} (hashed: ${hashedGuess})`);
  Logger.debug(`Number: ${number.number ?? "<hidden>"} (hashed: ${number.hashedNumber})`);
  if (hashedGuess === number.hashedNumber) {
    Logger.info("user guessed correctly");
    return true;
  }
  Logger.info("user guessed incorrectly");
  return false;
}
