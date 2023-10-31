import fs from "fs";

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

/* write a function that takes a json object and writes it to a file in javascript */
function writeJSONToFile(json: any) {
  const jsonString = JSON.stringify(json, null, 2);

  fs.writeFile(`${__dirname}/../data/scores.json`, jsonString, (err) => {
    if (err) {
      console.error("Error writing JSON to file:", err);
    } else {
      console.log("JSON written to file successfully!");
    }
  });
}

async function scrape() {
  const res = await fetch(ROOT_URL);
  const data = await res.json();
  const items = data.payload.tree.items;

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

  const filteredScoreMap = Object.values(scoreMap).map((scores) => {
    return scores.sort((a, b) => {
      return parseInt(b.date, 10) - parseInt(a.date, 10);
    })[0];
  });
  writeJSONToFile(filteredScoreMap);
}

async function main() {
  try {
    const res = await scrape();
  } catch (error) {
    console.error("Error in main function response:", error);
  }
}

main();
