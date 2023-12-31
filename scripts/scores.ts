import fs from "fs";
import { execSync } from "child_process";
import savedScores from "./data/scores.json";
import prisma from "../lib/prisma";

const REQUIRED_SCORES = [
  "arc",
  "hellaswag",
  "truthfulqa",
  "gsm8k",
  "winogrande",
  "mmlu",
];

const RESULTS_TMP_DIR = process.env.GITHUB_WORKSPACE
  ? `${process.env.GITHUB_WORKSPACE}/llm-leaderboard-scores`
  : `/tmp/llm-leaderboard-scores`;

const cloneResults = () => {
  if (fs.existsSync(RESULTS_TMP_DIR)) {
    fs.rmSync(RESULTS_TMP_DIR, { recursive: true, force: true });
  }
  execSync(
    `git clone https://huggingface.co/datasets/open-llm-leaderboard/results ${RESULTS_TMP_DIR} && echo "cloned"`
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
    console.log("Cloning results...");
    cloneResults();
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
            fs.readFileSync(`${RESULTS_TMP_DIR}/${name}/${file}`, "utf8")
          );

          scores = { ...scores, ...parseResults(data) };
        } catch (error) {
          console.error(error);
        }
      }

      const hasRequiredScores = REQUIRED_SCORES.every(
        (score) => score in scores
      );
      if (hasRequiredScores) {
        const allValues = Object.values(scores);
        scores.average = roundFloat(
          allValues.reduce((a, b) => a + b) / allValues.length
        );
      }

      results[name] = scores;
    }
  }

  if (save) {
    const jsonString = JSON.stringify(results, null, 2);

    fs.writeFile(`${__dirname}/data/scores.json`, jsonString, (err) => {
      if (err) {
        console.error("Error writing JSON to file:", err);
      } else {
        console.log("Saved score data to file!");
      }
    });
  }

  return results;
}

async function updateScore(
  key: string,
  score: Awaited<ReturnType<typeof scrape>>["number"]
) {
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

export async function load(useSaved: boolean = true, saveData: boolean = true) {
  const originalCount = await prisma.model.count({
    where: { average: { not: null } },
  });

  const scores = useSaved ? savedScores : await scrape(saveData);

  for (let key in scores) {
    if (!scores.hasOwnProperty(key)) {
      continue;
    }

    const score = scores[key as keyof typeof scores];
    await updateScore(key, score);
  }

  const finalCount = await prisma.model.count({
    where: { average: { not: null } },
  });

  console.log(
    `Added ${finalCount - originalCount} new scores, ${finalCount} scores total`
  );
}
