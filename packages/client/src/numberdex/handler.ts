import { createGuessHandler, type NumberhumanStore } from "@fg-sparky/server";
import { Logger, NUMBERDEX_FLEE_DELAY, type ICron } from "@fg-sparky/utils";
import { ComponentType, TextInputStyle, type Interaction, type ModalComponentData, type SendableChannels } from "discord.js";
import { createButtonRow, spawnNumberhuman, updateUserStats } from "./utils.ts";

const guessModal: ModalComponentData = {
  title: "yeah",
  customId: `numberhuman-guess-modal`,
  components: [{
    id: 0,
    label: "what's the human's name?",
    type: ComponentType.Label,
    component: {
      customId: "numberhuman-guess-input",
      style: TextInputStyle.Short,
      type: ComponentType.TextInput,
    },
  }],
};

const handlePlayerGuess = createGuessHandler("blake2b512");

export function setupCallback(store: NumberhumanStore, job: ICron, channel: SendableChannels): ICron {
  if (/numberdex-channel-[0-9]+/.test(job.name)) {
    Logger.debug(`setting up callback for cron job ${job.name}`);
    job.callback = async () => {
      // const timeoutDuration = getRandomRange(0, 1200);
      const timeoutDuration = 0;
      Logger.info(`spawning numberhuman in channel ${channel.id} after ${timeoutDuration.toFixed(0)} seconds`);
      await Bun.sleep(timeoutDuration * 1000);
      const number = await spawnNumberhuman(store, channel);
      if (number.isOk()) {
        const [okNumber, sentMessage] = number.unwrap();
        const timeout = setTimeout(async () => {
          Logger.info("user failed to catch in time");
          client.off("interactionCreate", handler);

          const content = `the numberhuman fled.`;
          await sentMessage.reply({ content, allowedMentions: { repliedUser: false } });
        }, NUMBERDEX_FLEE_DELAY);

        const handler = async (interaction: Interaction) => {
          if (interaction.isButton()) {
            await interaction.showModal(guessModal);
          } else if (interaction.inGuild() && interaction.isModalSubmit() && interaction.isFromMessage()) {
            await interaction.update({
              components: [createButtonRow(true)],
            });
            const guess = interaction.fields.getTextInputValue("numberhuman-guess-input");
            if (handlePlayerGuess(guess, { number: okNumber.name, hashedNumber: okNumber.hashedName })) {
              client.off("interactionCreate", handler);
              clearTimeout(timeout);
              await updateUserStats(interaction, okNumber);
            }
          }
        };

        client.on("interactionCreate", handler);
      } else {
        Logger.error(`Failed to spawn numberhuman: ${number.unwrapErr()}`);
      }
    };
  }

  return job;
}
