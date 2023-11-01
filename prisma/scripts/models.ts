import fs from "fs";
import prisma from "../../lib/prisma";
import savedModels from "./data/models.json";

const IGNORED_MODELS = [
  "TheBloke/Mistral-7B-Phibrarian-32K-GGUF", // duplicate
  "TheBloke/Mistral-7B-SciPhi-32k-GGUF", // duplicate
  "TheBloke/minotaur-13B-GGUF", // no real data
  "TheBloke/tinyllama-1.1b-chat-v0.3_platypus-GGUF", // no real data
  "TheBloke/LLaMA-13b-GGUF", // no base model
  "TheBloke/LLaMA-30b-GGUF", // no base model
  "TheBloke/LLaMA-7b-GGUF", // no base model
  "TheBloke/LLaMA-65B-GGUF", // no base model
];

function parse(modelInfo: any) {
  if (IGNORED_MODELS.includes(modelInfo.id)) {
    return;
  }

  try {
    const { model, baseModel } = modelInfo;

    const authorRemoteId =
      model.cardData?.base_model.split("/")[0] ||
      baseModel?.modelId.split("/")[0];

    if (!authorRemoteId) {
      console.error(
        `Error parsing model info: ${modelInfo.id}.`,
        "Missing author.remoteId:",
        {
          cardData: model.cardData,
          baseModel: baseModel?.modelId,
        }
      );
      return;
    }

    const remoteId = baseModel?.modelId || model.cardData?.base_model;
    const ggufId = model.id;
    const slug = remoteId.split("/")[1].toLowerCase();
    const name =
      model.cardData?.model_name || remoteId.split("/")[1].replaceAll("_", " ");
    const arch = model.cardData?.model_type || "other";
    const lastModifiedDate = baseModel?.lastModified || model?.lastModified;

    // License
    const maybeLicense =
      baseModel?.cardData?.license || model?.cardData?.license || [];
    const license = Array.isArray(maybeLicense)
      ? maybeLicense[0]
      : maybeLicense;

    // Parse Parameters
    const safetensors =
      model.safetensors?.total || baseModel?.safetensors?.total;
    let numParameters;
    if (safetensors) {
      numParameters = Math.round(safetensors / 1000000000);
    } else {
      const numParametersStr =
        slug.match(/\d+[Bb]/)?.[0].toUpperCase() ||
        name.match(/\d+[Bb]/)?.[0].toUpperCase();
      if (numParametersStr) {
        numParameters = parseInt(numParametersStr, 10);
      }
    }

    const files: { name: string; format: string; quantization: string }[] =
      model.siblings
        .filter((file: any) => {
          return file.rfilename.endsWith(".gguf");
        })
        .map((file: any) => {
          const split = file.rfilename.split(".");
          return {
            name: file.rfilename,
            format: "gguf",
            quantization: split[split.length - 2],
          };
        });

    const author = {
      name: model.cardData?.model_creator,
      remoteId: authorRemoteId,
      slug: authorRemoteId.toLowerCase().replaceAll(" ", "-"),
    };

    const result = {
      remoteId,
      ggufId,
      name,
      slug,
      lastModifiedDate,
      license,
      numParameters,
      arch,
      author,
      files,
    };

    if (!result.slug) {
      console.error(
        `Error parsing model info: ${modelInfo.id}.`,
        "Missing slug:",
        {
          remoteId,
        }
      );
      return;
    }

    return result;
  } catch (error) {
    console.error(`Error parsing model info: ${modelInfo.id}.`);
    console.error(error);
  }
}

export async function scrape(save: boolean = false) {
  console.log("Fetching latest models from HuggingFace...");

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

  if (save) {
    const jsonString = JSON.stringify(data, null, 2);

    fs.writeFile(`${__dirname}/./data/models.json`, jsonString, (err) => {
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
    prisma.model.count(),
    prisma.model.findMany({
      select: { remoteId: true },
    }),
  ]);
  const existingIdsFlat = existingIds.map((model) => model.remoteId);
  const models = useSaved ? savedModels : await scrape(saveData);

  let count = 0;
  for (const model of models) {
    const parsedModel = parse(model);
    if (!parsedModel || existingIdsFlat.includes(parsedModel.remoteId)) {
      continue;
    }

    try {
      await prisma.model.upsert({
        where: {
          remoteId: parsedModel.remoteId,
        },
        update: {},
        create: {
          ...parsedModel,
          lastModifiedDate: new Date(parsedModel.lastModifiedDate),
          files: {
            createMany: {
              data: parsedModel.files,
            },
          },
          author: {
            connectOrCreate: {
              where: {
                slug: parsedModel.author.slug,
              },
              create: parsedModel.author,
            },
          },
        },
      });
      count++;
    } catch (error) {
      console.error(`Error adding model ${parsedModel.remoteId}`, error);
    }
  }
  console.log(
    `Added ${count} new models, ${count + originalCount} models total`
  );
}
