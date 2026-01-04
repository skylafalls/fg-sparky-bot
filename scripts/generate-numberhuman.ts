import { Command } from "commander";
import { copyFile } from "node:fs/promises";

const command = new Command()
  .requiredOption("-r, --rarity <rarity>")
  .requiredOption("-h, --hp <hp>")
  .requiredOption("-a, --attack <atk>")
  .option("--ability-name <name>")
  .option("--ability-description <description>")
  .argument("<file>");

command.parse(process.argv);

const args = command.opts<{
  rarity: string;
  artist: string;
  hp: string;
  attack: string;
  abilityName?: string;
  abilityDescription?: string;
}>();

interface NumberhumanData {
  uuid: string;
  name: string;
  rarity: "common" | "rare" | "epic";
  hashedName: string;
  image: string;
  baseHP: number;
  baseATK: number;
  ability: {
    id: string;
    name: string;
    description: string;
  } | null;
}

const file = command.processedArgs[0] as string;

const fileExtension = file.slice(file.lastIndexOf("."));
const directoryPath = file.slice(0, file.lastIndexOf("/"));
const numberUUID = crypto.randomUUID();
const newFilePath = `${directoryPath}/${args.rarity}/${numberUUID}${fileExtension}`;
await copyFile(file, newFilePath);
await Bun.file(file).delete();

const numberhumanName = file.slice(file.lastIndexOf("/") + 1).slice(0, -5);

const hasher = new Bun.CryptoHasher("blake2b512");
hasher.update(numberhumanName.toLowerCase());

const ability = (args.abilityName && args.abilityDescription
  ? {
      id: crypto.randomUUID(),
      name: args.abilityName,
      description: args.abilityDescription,
    }
  : null);

const numberhumanData: NumberhumanData = {
  uuid: numberUUID,
  name: numberhumanName,
  rarity: args.rarity,
  hashedName: hasher.digest("hex"),
  image: newFilePath,
  baseHP: Number.parseInt(args.hp, 10),
  baseATK: Number.parseInt(args.attack, 10),
  ability,
};

const json = await Bun.file("numbers/numberdex-data.json").json() as {
  numberhumans: NumberhumanData[];
  responses: string[];
};
json.numberhumans.push(numberhumanData);

await Bun.write("numbers/numberdex-data.json", JSON.stringify(json, null, 2));

console.log(`Added numberhuman ${numberhumanData.name} into numberdex-data.json`);
