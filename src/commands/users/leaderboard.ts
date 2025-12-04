import type { ChatInputCommandInteraction, Client, User as DiscordUser } from "discord.js";
import { UserProfile } from "../../entities/user-profile";
import { ordinalOf } from "../../utils/numbers";

export default async function userLeaderboardDisplay(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
  const users = await UserProfile.find({ order: { tokens: "DESC" }, select: ["id", "tokens"] });
  const discordUsers: DiscordUser[] = await Promise.all(
    users.map(profile => client.users.fetch(profile.id)),
  );
  const content = `\
    # User leaderboard: \n \
    ${users.map((user, index) => {
      if (index > (interaction.options.getNumber("amount", false) ?? 10) - 1) return "no";
      const position = ordinalOf(index + 1);
      // Sometimes an IIFE looks better then chaining ternaries
      const header = ((index) => {
        if (index === 0) return "##";
        if (index === 1) return "###";
        return "";
      })(index);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return `${header} ${position}: ${discordUsers[index]!.displayName} (${user.tokens.toString()} <:terminusfinity:1444859277515690075>)`;
    }).filter(value => value !== "no").join("\n")}
    `;
  await interaction.reply({ content });
}
