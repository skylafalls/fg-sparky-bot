import { defineConfig, type UserConfig } from "tsdown";

const config: UserConfig = defineConfig({
  minify: true,
  sourcemap: true,
  tsconfig: true,
  entry: "src/main.ts",
  outDir: "dist",
  banner: `/**
 * @license
 * fg-sparky-bot - Guess the FG number based on its symbol
 * Copyright (C) 2025 Skylafalls
 * SPDX-License-Identifier: GPL-3.0-or-later
 */`.trim(),
});

export default config;
