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
import { ApplicationCommandOptionType, type Client, type CommandInteraction } from "discord.js";
import { getUser } from "../utils/user.ts";
import type { Command } from "./types.ts";

const User: Command = {
  async run(client: Client, interaction: CommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;
    switch (interaction.options.getSubcommand()) {
      case "show": {
        const userId = interaction.options.get("user", true).value as string;
        const userInfo = await getUser(userId);
        const discordUser = await client.users.fetch(userId);
        if (userInfo) {
          await interaction.reply({
            content: `## Profile information for ${discordUser.displayName} (${discordUser.username})\ntokens: ${userInfo.tokens.toString()}`,
          });
        } else {
          await interaction.reply("sorry, fg sparky bot doesn't have data for this user");
        }
        return;
      }
      default: {
        await interaction.reply("not implemented yet sorry");
        return;
      }
    }
  },
  description: "User profile-related commands",
  name: "user",
  options: [{
    name: "show",
    description: "Show information about a user",
    type: ApplicationCommandOptionType.Subcommand,
    options: [{
      name: "user",
      description: "The user to show the profile of",
      type: ApplicationCommandOptionType.User,
      required: true,
    }],
  }],
};

export default User;
