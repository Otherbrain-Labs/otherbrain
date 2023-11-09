import fs from "fs";
import { exec } from "child_process";
import savedScores from "./data/llm-scores.json";
import prisma from "../lib/prisma";

const RESULTS_TMP_DIR = process.env.GITHUB_WORKSPACE
  ? `${process.env.GITHUB_WORKSPACE}/llm-leaderboard-scores`
  : `/tmp/llm-leaderboard-scores`;

const cloneResults = async () => {
  if (fs.existsSync(RESULTS_TMP_DIR)) {
    await fs.rmSync(RESULTS_TMP_DIR, { recursive: true, force: true });
  }
  await exec(
    `git clone https://huggingface.co/datasets/open-llm-leaderboard/results ${RESULTS_TMP_DIR}`
  );
};

const getDirectories = async (source: string) => {
  const directories = await fs.readdirSync(source, { withFileTypes: true });
  return directories
    .filter((dirent) => dirent.isDirectory() && dirent.name !== ".git")
    .map((dirent) => dirent.name);
};

const getFiles = async (source: string) => {
  const files = await fs.readdirSync(source, { withFileTypes: true });
  return files.filter((dirent) => dirent.isFile()).map((dirent) => dirent.name);
};

function roundFloat(number: number) {
  return Math.round(number * 100) / 100;
}
const parseResults = (data: any) => {
  if (!data.results) {
    return {};
  }
  const res: { [key: string]: any } = {};
  for (const key in data.results) {
    if (!data.results.hasOwnProperty(key)) {
      continue;
    }

    switch (key) {
      case "harness|arc:challenge|25":
        res["arc"] = roundFloat(data.results[key].acc_norm * 100);
        break;
      case "harness|hellaswag|10":
        res["hellaswag"] = roundFloat(data.results[key].acc_norm * 100);
        break;
      case "harness|truthfulqa:mc|0":
        res["truthfulqa"] = roundFloat(data.results[key].mc2 * 100);
        break;
      case "harness|drop|3":
        res["drop"] = roundFloat(data.results[key].f1 * 100);
        break;
      case "harness|gsm8k|5":
        res["gsm8k"] = roundFloat(data.results[key].acc * 100);
        break;
      case "harness|winogrande|5":
        res["winogrande"] = roundFloat(data.results[key].acc * 100);
        break;
    }
  }

  const mmluValues = Object.keys(data.results)
    .filter((key) => key.match("hendrycksTest"))
    .map((key) => data.results[key].acc_norm * 100);

  if (mmluValues.length > 0) {
    res.mmlu = roundFloat(
      mmluValues.reduce((a, b) => a + b) / mmluValues.length
    );
  }

  return res;
};

async function scrape(save: boolean = false, reclone: boolean = false) {
  if (!fs.existsSync(RESULTS_TMP_DIR) || reclone) {
    await cloneResults();
  }
  const results: { [key: string]: any } = {};
  const directories = await getDirectories(RESULTS_TMP_DIR);
  for (const directory of directories) {
    const subDirectories = await getDirectories(
      `${RESULTS_TMP_DIR}/${directory}`
    );
    for (const subDirectory of subDirectories) {
      const name = `${directory}/${subDirectory}`;
      const files = await getFiles(`${RESULTS_TMP_DIR}/${name}`);
      let scores: { [key: string]: any } = {};
      for (const file of files) {
        try {
          const data = JSON.parse(
            await fs.readFileSync(`${RESULTS_TMP_DIR}/${name}/${file}`, "utf8")
          );

          scores = { ...scores, ...parseResults(data) };
        } catch (error) {
          console.error(error);
        }
      }

      const allValues = Object.values(scores);
      if (allValues.length > 0) {
        scores.average = roundFloat(
          allValues.reduce((a, b) => a + b) / allValues.length
        );
      }

      results[name] = scores;
    }
  }

  if (save) {
    const jsonString = JSON.stringify(results, null, 2);

    fs.writeFile(`${__dirname}/./data/llm-scores.json`, jsonString, (err) => {
      if (err) {
        console.error("Error writing JSON to file:", err);
      } else {
        console.log("Saved score data to file!");
      }
    });
  }

  return results;
}

export async function load(useSaved: boolean = true, saveData: boolean = true) {
  const [originalCount, existingIds] = await prisma.$transaction([
    prisma.model.count({
      where: { average: { not: null } },
    }),
    prisma.model.findMany({
      select: { remoteId: true },
    }),
  ]);
  const existingIdsFlat = existingIds.map((model) => model.remoteId);
  const scores = useSaved ? savedScores : await scrape(saveData);

  for (const key in scores) {
    if (!scores.hasOwnProperty(key)) {
      continue;
    }

    if (!existingIdsFlat.includes(key)) {
      continue;
    }

    const score = scores[key as keyof typeof scores];
    try {
      const value = await prisma.model.updateMany({
        where: { remoteId: key },
        data: score,
      });
      if (value.count > 0) {
        console.log(`Updated scores for model ${key}`);
      }
    } catch (error) {
      console.error(error, key);
    }
  }

  const finalCount = await prisma.model.count({
    where: { average: { not: null } },
  });

  console.log(
    `Added ${finalCount - originalCount} new scores, ${finalCount} scores total`
  );
}
