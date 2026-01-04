/**
 * @license
 * fg-sparky-bot - Guess the FG number based on its symbol
 * Copyright (C) 2025 Skylafalls
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { z, type Difficulties, type ZodType } from "@fg-sparky/utils";

export interface NumberInfo {
  uuid: string;
  image: string;
  hashedName: string;
  /**
   * possibly null because of legendaries
   */
  name: string | null;
}

export interface StoredNumberInfo {
  uuid: string;
  image: string;
  hashedNumber: string;
  /**
   * possibly null because of legendaries
   */
  number: string | null;
  difficulty: Difficulties;
}

export interface Numbers {
  easy: NumberInfo[];
  medium: NumberInfo[];
  hard: NumberInfo[];
  legendary: NumberInfo[];
}

export const NumberInfo: ZodType<NumberInfo> = z.strictObject({
  uuid: z.uuid(),
  image: z.string(),
  hashedName: z.hash("sha512"),
  name: z.string().nullable(),
});

export const Numbers: ZodType<Numbers> = z.object({
  easy: NumberInfo.array(),
  medium: NumberInfo.array(),
  hard: NumberInfo.array(),
  legendary: NumberInfo.array(),
});
