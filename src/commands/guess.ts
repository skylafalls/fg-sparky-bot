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
import { ApplicationCommandOptionType, type Client, type CommandInteraction, type Message, type OmitPartialGroupDMChannel } from "discord.js";
import { Logger } from "../utils/logger.ts";
import { guessCooldowns } from "./cooldowns.ts";
import { findRandomNumber, handlePlayerGuess, type Difficulties } from "./generate-number.ts";
import type { Command } from "./types.ts";

const Guess: Command = {
  async run(client: Client, interaction: CommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) {
      Logger.error(`Tried invoking command ${this.name} as something other then a slash command`);
      await interaction.reply("This command must be run as a slash command (eg. as /guess)!");
      return;
    }

    const difficulty = interaction.options.get("difficulty", true).value as Difficulties;
    const number = findRandomNumber(difficulty);
    Logger.info(`Player requested for number of difficulty ${difficulty}`);
    // The message that will be sent to the player, specifiying the difficulty,
    // and the amount of time they get to guess it.
    // THere's some special flair for legendary difficulties.
    const content = number.difficulty === "legendary"
      ? `**DIFFICULTY: LEGENDARY**\nGuess the number, you have **60** seconds.`
      : `Difficulty: ${number.difficulty}\nGuess the number, you have **40** seconds.`;
    await interaction.reply({ content, files: [number.symbol] });

    Logger.debug("setting up timeout");
    const handler = async (message: OmitPartialGroupDMChannel<Message>) => {
      if (message.channelId !== interaction.channelId) return;
      if (handlePlayerGuess(message, number)) {
        Logger.debug("user guessed correctly, replying and clearing timeout");
        clearTimeout(timeout);
        client.off("messageCreate", handler);
        await message.reply({ content: "hey you guessed correctly, nice job!" });
        guessCooldowns.set(interaction.channelId, false);
      }
    };

    const timeout = setTimeout(async () => {
      const content = `no one guessed in time${number.number ? `, the correct answer was ${number.number}.` : "."}`;
      Logger.info("user failed to guess in time");
      await interaction.followUp({ content, allowedMentions: { repliedUser: false } });
      client.off("messageCreate", handler);
      guessCooldowns.set(interaction.channelId, false);
    }, number.difficulty === "legendary" ? 60000 : 40000);

    client.on("messageCreate", handler);
  },
  description: "Generates a number that you have to guess.",
  name: "guess",
  options: [{
    name: "difficulty",
    description: "Select how difficult the guess will be",
    type: ApplicationCommandOptionType.String,
    required: true,
    choices: [
      { name: "Easy", value: "easy" },
      { name: "Medium", value: "medium" },
      { name: "Hard", value: "hard" },
      { name: "Random", value: "random" },
    ],
  }],
  cooldown: 10,
};

export default Guess;
