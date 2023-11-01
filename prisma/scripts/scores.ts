import fs from "fs";
import prisma from "../../lib/prisma";
import savedScores from "./data/scores.json";

const ROOT_URL =
  "https://github.com/dsdanielpark/open-llm-leaderboard-report/tree/main/assets";
const RAW_URL =
  "https://raw.githubusercontent.com/dsdanielpark/open-llm-leaderboard-report/main/assets";

type Score = {
  date: string;
  model: string;
  average: string;
  arc: string;
  hellaswag: string;
  mmlu: string;
  truthfulqa: string;
  parameters: string;
  url: string;
};

function csvToJson(csv: any, date: string) {
  const lines = csv.split("\n");
  const result = [];

  const headers = lines[0].split(",").map((header: string) => {
    return header.split("(")[0].toLowerCase();
  });

  for (var i = 1; i < lines.length; i++) {
    var obj: { [key: string]: any } = {
      date: date,
    };
    var currentline = lines[i].split(",");
    if (currentline.length !== headers.length) {
      continue;
    }

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  return result;
}

export async function scrape(saveData: boolean = false) {
  console.log("Fetching latest scores from dsdanielpark...");

  const res = await fetch(ROOT_URL);
  const resJson = await res.json();
  const items = resJson.payload.tree.items;

  const scoreMap: { [key: string]: Score[] } = {};
  await Promise.all(
    items.map(async (item: any) => {
      const res = await fetch(RAW_URL + `/${item.name}/${item.name}.csv`);
      const resJson = csvToJson(await res.text(), item.name) as Score[];
      resJson.forEach((score) => {
        if (!scoreMap[score.model]) {
          scoreMap[score.model] = [];
        }
        scoreMap[score.model].push(score);
      });
    })
  );

  const data = Object.values(scoreMap).map((scores) => {
    return scores.sort((a, b) => {
      return parseInt(b.date, 10) - parseInt(a.date, 10);
    })[0];
  });

  if (saveData) {
    const jsonString = JSON.stringify(data, null, 2);

    fs.writeFile(`${__dirname}/./data/scores.json`, jsonString, (err) => {
      if (err) {
        console.error("Error writing JSON to file:", err);
      } else {
        console.log("Saved score data to file!");
      }
    });
  }

  return data;
}

export async function load(useSaved: boolean = true, saveData: boolean = true) {
  const [originalCount, existingIds] = await prisma.$transaction([
    prisma.model.count({
      where: { average: { not: null } },
    }),
    prisma.model.findMany({
      where: { average: null },
      select: { remoteId: true },
    }),
  ]);
  const existingIdsFlat = existingIds.map((model) => model.remoteId);
  const scores = useSaved ? savedScores : await scrape(saveData);

  let count = 0;
  for (const score of scores) {
    if (!existingIdsFlat.includes(score.model)) {
      continue;
    }
    try {
      await prisma.model.updateMany({
        where: { remoteId: score.model },
        data: {
          average: parseFloat(score.average),
          arc: parseFloat(score.arc!),
          hellaswag: parseFloat(score.hellaswag!),
          mmlu: parseFloat(score.mmlu!),
          truthfulqa: parseFloat(score.truthfulqa!),
        },
      });
      count++;
    } catch (error) {
      console.error(error, score.model);
    }
  }
  console.log(
    `Added ${count} new scores, ${count + originalCount} scores total`
  );
}
