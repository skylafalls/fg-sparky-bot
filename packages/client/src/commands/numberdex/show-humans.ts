import { getUser, type NumberhumanData } from "@fg-sparky/server";
import {
  formatPercent,
  getEvolutionBuff,
  LazyPaginatedMessage,
  type ServerSlashCommandInteraction,
} from "@fg-sparky/utils";
import type { Client, User } from "discord.js";
import { Numberhumans } from "../../stores.ts";

function createCollectionMessage(user: User, page: number, numberhumans: NumberhumanData[]): string {
  const header = [
    `# Numberhuman collection for ${user.displayName} (${user.username})`,
    `Please select a numberhuman to view by clicking the below buttons.`,
  ];

  const body = numberhumans.map(value => {
    const humanInStore = Numberhumans.get(value.id).expect("should not be undefined");
    const evolutionHPBonus = getEvolutionBuff(value.evolution, "hp");
    const evolutionATKBonus = getEvolutionBuff(value.evolution, "atk");
    const HPString = `${humanInStore.baseHP}, ${formatPercent(value.bonusHP)}, ×${evolutionHPBonus} = ${
      value.totalHP(Numberhumans)
    }`;
    const ATKString = `${humanInStore.baseATK}, ${formatPercent(value.bonusAtk)}, ×${evolutionATKBonus} = ${
      value.totalHP(Numberhumans)
    }`;
    return [
      `#${value.catchId} Lv. ${value.level}, "${humanInStore.name}"`,
      `-# HP: ${HPString}, ATK: ${ATKString}`,
    ] as const;
  });

  if (page * 10 > body.length) return "";
  return `${header.join("\n")}\n\n${body.slice((page - 1) * 10, page * 10).join("\n")}`;
}

export default async function numberdexShowHumans(
  client: Client,
  interaction: ServerSlashCommandInteraction,
  user: User,
): Promise<void> {
  const dbUser = await getUser(user.id, interaction.guildId);
  if (dbUser === null) return;
  const paginatedMessage = new LazyPaginatedMessage();

  let index = 1;
  do {
    paginatedMessage.addPageContent(createCollectionMessage(user, index, dbUser.numberhumans));
  } while (index++ && createCollectionMessage(user, index, dbUser.numberhumans) !== "");

  await paginatedMessage.run(interaction);
}
