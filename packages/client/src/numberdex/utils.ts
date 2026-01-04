/**
 * @license
 * fg-sparky-bot - Guess the FG number based on its symbol
 * Copyright (C) 2025 Skylafalls
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import type { NumberhumanInfo, NumberhumanStore } from "@fg-sparky/server";
import { NUMBERDEX_SPAWN_MESSAGES, Result } from "@fg-sparky/utils";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, type Message, type SendableChannels } from "discord.js";

export function createButtonRow(disabled?: boolean): ActionRowBuilder<ButtonBuilder> {
  const button = ButtonBuilder.from({
  // @ts-expect-error THERE SHALL BE NO URL
    customId: "numberhuman-catch-button",
    label: "Catch",
    style: ButtonStyle.Primary,
    type: ComponentType.Button,
    disabled,
  });

  return new ActionRowBuilder().addComponents(button);
}

export async function spawnNumberhuman(store: NumberhumanStore, channel: SendableChannels): Promise<Result<[NumberhumanInfo, Message], unknown>> {
  const numberhuman = store.getRandom();
  const randomSpawnMessage = NUMBERDEX_SPAWN_MESSAGES[Math.floor(Math.random() * NUMBERDEX_SPAWN_MESSAGES.length)];
  try {
    for (const okHuman of numberhuman) {
      return Result.ok([
        okHuman,
        // oxlint-disable-next-line no-await-in-loop: still not a loop
        await channel.send({
          content: randomSpawnMessage ?? "hello",
          files: [okHuman.image],
          components: [createButtonRow()],
        }),
      ]);
    }
    return Result.err(new ReferenceError("no numberhuman was found"));
  } catch (err) {
    return Result.err(err);
  }
}
