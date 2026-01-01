/**
 * @license
 * fg-sparky-bot - Guess the FG number based on its symbol
 * Copyright (C) 2025 Skylafalls
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { None, Some, type Option } from "@fg-sparky/utils";
import { randomRarity } from "../helpers.ts";
import { Numberhumans as NumbersJsonSchema, type NumberhumanInfo } from "./schema.ts";

export type Rarities = "common" | "rare" | "epic";

export class Numberhumans {
  /**
   * Constructs the {@link Numberhumans} class. Because constructors cannot be asynchronous,
   * this is private and one of the static `load*` methods is used to construct the class.
   * @param data The numbers to load.
   */
  private constructor(private readonly data: Record<Rarities, NumberhumanInfo[]>) {}

  /**
   * Reads the data from the file path specified and constructs the Numberhumans class.
   * @param filePath The path to the numbers.json data.
   * @returns An instance of the {@link Numberhumans} class.
   */
  static async loadFile(filePath: string): Promise<Numberhumans> {
    const file = Bun.file(filePath);
    const validatedData = NumbersJsonSchema.parse(await file.json());
    return new Numberhumans(validatedData);
  }

  /**
   * Validates and parses the JSON data and constructs the Numberhumans class for use.
   * @param filePath The path to the numbers.json data.
   * @returns An instance of the {@link Numberhumans} class.
   */
  static loadJSON(fileData: unknown): Numberhumans {
    const validatedData = NumbersJsonSchema.parse(fileData);
    return new Numberhumans(validatedData);
  }

  /**
   * Returns a random entry from the collection of entries.
   * @returns The entry.
   */
  getRandom(): NumberhumanInfo {
    const rarityPool = randomRarity();
    return this.getRandomByDifficulty(rarityPool);
  }

  /**
   * Returns a random entry from the specified difficulty pool.
   * @returns The entry.
   */
  getRandomByDifficulty(rarity: Rarities): NumberhumanInfo {
    const numbers = this.data[rarity];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return numbers[Math.floor(Math.random() * numbers.length)]!;
  }

  /**
   * Returns an entry based on the UUID. Returns a Rust option if it doesn't exist.
   * @returns The entry or None.
   */
  getByID(id: string): Option<NumberhumanInfo> {
    const data = [...this.data.common, ...this.data.rare, ...this.data.epic];
    const number = data.find(value => value.uuid === id);
    if (number) return Some(number);
    return None();
  }
}
