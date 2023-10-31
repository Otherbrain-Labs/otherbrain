// https://huggingface.co/api/models?author=TheBloke&search=gguf
import fs from "fs";

/* write a function that takes a json object and writes it to a file in javascript */
function writeJSONToFile(json: any) {
  const jsonString = JSON.stringify(json, null, 2);

  fs.writeFile(`${__dirname}/../data/catalog.json`, jsonString, (err) => {
    if (err) {
      console.error("Error writing JSON to file:", err);
    } else {
      console.log("JSON written to file successfully!");
    }
  });
}

async function scrape() {
  const res = await fetch(
    "https://huggingface.co/api/models?author=TheBloke&search=gguf"
  );
  const data = await res.json();

  await Promise.all(
    data.map(async (model: any) => {
      const modelRes = await fetch(
        `https://huggingface.co/api/models/${model.modelId}`
      );
      if (!modelRes.ok) {
        console.error(
          `Error fetching model ${model.modelId}: ${modelRes.statusText}`
        );
        return;
      }
      const modelData = await modelRes.json();
      model.model = modelData;

      const baseModel = modelData?.cardData?.base_model;
      if (baseModel) {
        const baseModelRes = await fetch(
          `https://huggingface.co/api/models/${baseModel}`
        );
        if (!baseModelRes.ok) {
          console.error(
            `Error fetching model ${model.modelId}: ${modelRes.statusText}`
          );
          return;
        }
        const baseModelData = await baseModelRes.json();
        model.baseModel = baseModelData;
      }
    })
  );

  writeJSONToFile(data);
}

async function main() {
  try {
    const res = await scrape();
  } catch (error) {
    console.error("Error in main function response:", error);
  }
}

main();
