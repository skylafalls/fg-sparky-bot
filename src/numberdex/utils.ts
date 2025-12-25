/**
 * @license
 * fg-sparky-bot - Guess the FG number based on its symbol
 * Copyright (C) 2025 Skylafalls
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import type { ICron } from "cronbake";
import { DiscordjsError, type Message, type OmitPartialGroupDMChannel, type SendableChannels } from "discord.js";
import { Err, Ok, type Result } from "rust-optionals";
import numberhumans from "../../numbers/numberhumans.json" with { type: "json" };
import { Logger } from "../utils/logger";
import { getRandomRange } from "../utils/numbers";
import { joinStringArray } from "../utils/string";
import { createUser, getUser } from "../utils/user";
import { handlePlayerGuess } from "./handler";

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythical";

export interface NumberhumanInfo {
  number: string;
  hashedNumber: string;
  image: string;
  uuid: string;
  rarity: Rarity;
}

function getRandomRarity(): Rarity {
  return "common";
}

export function findRandomNumber(): NumberhumanInfo {
  const rarity = getRandomRarity();
  const humanPool = numberhumans[rarity];
  const randomIndex = Math.floor(Math.random() * humanPool.length);
  const number = humanPool[randomIndex];
  // Uh yeah same here
  return {
    number: number!.name,
    hashedNumber: number!.hashedName,
    image: number!.image,
    rarity,
    uuid: number!.uuid,
  };
}

export async function spawnNumberhuman(channel: SendableChannels): Promise<Result<[NumberhumanInfo, Message], Error>> {
  const numberhuman = findRandomNumber();
  try {
    return Ok([
      numberhuman,
      await channel.send({ content: "hello", files: [numberhuman.image] },
      )]);
  } catch (err) {
    if (err instanceof DiscordjsError) return Err(err);
    return Err("unknown error");
  }
}

export function setupCallback(job: ICron, channel: SendableChannels): ICron {
  if (/numberdex-channel-[0-9]+/.test(job.name)) {
    Logger.debug(`setting up callback for cron job ${job.name}`);
    job.callback = async () => {
      const timeoutDuration = getRandomRange(0, 1200);
      Logger.info(`spawning numberhuman in channel ${channel.id} after ${timeoutDuration.toFixed(0)} seconds`);
      await Bun.sleep(timeoutDuration * 1000);
      const number = await spawnNumberhuman(channel);
      if (number.isOk()) {
        const [okNumber, sentMessage] = number.unwrap();
        const timeout = setTimeout(async () => {
          Logger.info("user failed to catch in time");
          client.off("messageCreate", handler);

          const content = `the numberhuman fled.`;
          await sentMessage.reply({ content, allowedMentions: { repliedUser: false } });
        }, getRandomRange(30000, 60000));

        const handler = async (message: OmitPartialGroupDMChannel<Message>) => {
          if (message.channelId !== channel.id || message.author.bot) return;
          if (handlePlayerGuess(message, okNumber)) {
            client.off("messageCreate", handler);
            clearTimeout(timeout);

            // @ts-expect-error: assertion fails for some reason even though the bot can only
            // be installed in a guild
            const user = await getUser(message.author.id, message.guildId);
            Logger.debug(`tried looking up user ${message.author.id} (found: ${user ? "true" : "false"})`);

            if (user) {
              Logger.info(`user already exists, adding the numberhuman to their collection`);
              // update the player stats first...
              user.numberhumansGuessed.push(okNumber.uuid);
              if (user.numberhumansGuessedUnique.includes(okNumber.uuid)) {
                await message.reply(joinStringArray([
                  `hey, you managed to ~~kidnap~~ catch **${okNumber.number}**!`,
                ]));
              } else {
                user.numberhumansGuessedUnique.push(okNumber.uuid);
                await message.reply(joinStringArray([
                  `hey, you managed to ~~kidnap~~ catch **${okNumber.number}**!`,
                  "woah is that a new numberhuman you caught??",
                ]));
              }
              // and saves.
              await user.save();
            } else {
              Logger.info(`user not found, creating user and adding the numberhuman`);
              // @ts-expect-error: assertion fails for some reason even though the bot can only
              // be installed in a guild
              const newUser = await createUser(message.author.id, message.guildId);
              newUser.numberhumansGuessed.push(okNumber.uuid);
              // this is a fresh new profile which means it is guaranteed to have zero unique guesses.
              // so we can add it without checking.
              newUser.numberhumansGuessedUnique.push(okNumber.uuid);
              await message.reply(joinStringArray([
                `hey, you managed to ~~kidnap~~ catch **${okNumber.number}**!`,
                `i've also created a profile for you with that numberhuman.`,
              ]));
              await newUser.save();
            }
          }
        };
        client.on("messageCreate", handler);
      }
    };
  }

  return job;
}
