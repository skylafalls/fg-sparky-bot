/**
 * @license
 * fg-sparky-bot - Guess the FG number based on its symbol
 * Copyright (C) 2025 Skylafalls
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { z, type ZodType } from "@fg-sparky/utils";

export interface NumberhumanInfo {
  number: string;
  hashedNumber: string;
  image: string;
  uuid: string;
}

export interface Numberhumans {
  common: NumberhumanInfo[];
  rare: NumberhumanInfo[];
  epic: NumberhumanInfo[];
}

export const NumberhumanInfo: ZodType<NumberhumanInfo> = z.strictObject({
  uuid: z.uuid(),
  image: z.string(),
  hashedNumber: z.hash("sha512"),
  number: z.string(),
});

export const Numberhumans: ZodType<Numberhumans> = z.object({
  common: NumberhumanInfo.array(),
  rare: NumberhumanInfo.array(),
  epic: NumberhumanInfo.array(),
});
