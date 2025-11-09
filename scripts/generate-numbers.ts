import { Command } from "commander";
import { copyFile, readdir } from "node:fs/promises";

const program = new Command("generate-number");
const sha512 = new Bun.CryptoHasher("sha512");

program
  .version("0.1.0")
  .description("Enumerate all files in a directory to generate a bunch of numbers for FG sparky");

program
  .requiredOption("-d, --directory <directory>", "Directory containing the number images")
  .requiredOption("-D, --difficulty <difficulty>", "The difficulty level for these numbers");

program.parse(process.argv);

const options = program.opts();
const directoryPath: string = options.directory as string;
const difficulty: string = options.difficulty as string;

const files = await readdir(directoryPath);

interface NumberInfo {
  name: string;
  hashedName: string;
  image: string;
}

const numbers: NumberInfo[] = [];

for (const fileName of files) {
  // replacing _ with . is close enough, the only special case i can think of
  // is Positive_Negative Point which the _ should be replaced with /
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let number = fileName.split(".")[0]!.replaceAll("_", ".");
  if (number.toLowerCase() === "positive.negative point") {
    number = "Positive/Negative Point";
  }
  const filePath = `${directoryPath}/${fileName}`;
  console.log(`\nFound file: ${filePath} (number: ${number})`);
  sha512.update(number.toLowerCase());
  const hash = sha512.digest("hex");
  const fileExtension = fileName.split(".")[1]!;
  const newFilePath = `${directoryPath}/${hash}.${fileExtension}`;
  await copyFile(filePath, newFilePath);
  numbers.push({
    name: number,
    hashedName: hash,
    image: newFilePath,
  });
}

const originalJson = await Bun.file(`src/numbers/numbers.json`).json();
originalJson[difficulty] = numbers;

await Bun.write(
  `src/numbers/numbers.json`,
  JSON.stringify(originalJson, null, 2),
);

console.log(`\nUpdated numbers.json with ${numbers.length.toString()} numbers for difficulty "${difficulty}".`);
