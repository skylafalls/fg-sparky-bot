/**
 * @license
 * fg-sparky-bot - Guess the FG number based on its symbol
 * Copyright (C) 2025 Skylafalls
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import type { Client, CommandInteraction } from "discord.js";
import type { Command } from "./types.ts";

export const Poweroff: Command = {
  async run(client: Client, interaction: CommandInteraction): Promise<void> {
    if (interaction.user.id !== "1051147056481308744") {
      await interaction.reply("hey don't shut off the bot you're not <@1051147056481308744>");
      return;
    }
    await interaction.reply("Sorry I gotta sleep, see ya later!");
    await Bun.$`/bin/systemctl poweroff`;
    // Should never return
    await Bun.sleep(Number.MAX_SAFE_INTEGER);
  },
  description: "Turn the bot off",
  name: "poweroff",
};

export const Restart: Command = {
  async run(client: Client, interaction: CommandInteraction): Promise<void> {
    if (interaction.user.id !== "1051147056481308744") {
      await interaction.reply("hey don't restart the bot you're not <@1051147056481308744>");
      return;
    }
    await interaction.reply("Restarting...");
    process.exit(3);
  },
  description: "Restarts the bot",
  name: "restart",
};
