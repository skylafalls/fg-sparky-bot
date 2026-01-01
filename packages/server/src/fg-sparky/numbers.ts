/**
 * @license
 * fg-sparky-bot - Guess the FG number based on its symbol
 * Copyright (C) 2025 Skylafalls
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { None, Some, type Option } from "@fg-sparky/utils";
import { randomDifficulty } from "../helpers.ts";
import { Numbers as NumbersJsonSchema, type NumberInfo } from "./schema.ts";

export type Difficulties = "easy" | "medium" | "hard" | "legendary";

export class Numbers {
  /**
   * Constructs the {@link Numbers} class. Because constructors cannot be asynchronous,
   * this is private and one of the static `load*` methods is used to construct the class.
   * @param data The numbers to load.
   */
  private constructor(private readonly data: Record<Difficulties, NumberInfo[]>) {}

  /**
   * Reads the data from the file path specified and constructs the Numbers class.
   * @param filePath The path to the numbers.json data.
   * @returns An instance of the {@link Numbers} class.
   */
  static async loadFile(filePath: string): Promise<Numbers> {
    const file = Bun.file(filePath);
    const validatedData = NumbersJsonSchema.parse(await file.json());
    return new Numbers(validatedData);
  }

  /**
   * Validates and parses the JSON data and constructs the Numbers class for use.
   * @param filePath The path to the numbers.json data.
   * @returns An instance of the {@link Numbers} class.
   */
  static loadJSON(fileData: unknown): Numbers {
    const validatedData = NumbersJsonSchema.parse(fileData);
    return new Numbers(validatedData);
  }

  /**
   * Returns a random entry from the collection of entries.
   * @returns The entry.
   */
  getRandom(): NumberInfo {
    const difficultyPool = randomDifficulty();
    return this.getRandomByDifficulty(difficultyPool);
  }

  /**
   * Returns a random entry from the specified difficulty pool.
   * @returns The entry.
   */
  getRandomByDifficulty(difficulty: Difficulties): NumberInfo {
    const numbers = this.data[difficulty];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return numbers[Math.floor(Math.random() * numbers.length)]!;
  }

  /**
   * Returns an entry based on the UUID. Returns a Rust option if it doesn't exist.
   * @returns The entry or None.
   */
  getByID(id: string): Option<NumberInfo> {
    const data = [...this.data.easy, ...this.data.medium, ...this.data.hard, ...this.data.legendary];
    const number = data.find(value => value.uuid === id);
    if (number) return Some(number);
    return None();
  }
}
