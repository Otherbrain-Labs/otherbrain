import prisma from "../../lib/prisma";
import catalog from "../data/catalog.json";

// These are duplicates of other models, so we ignore them
const IGNORED_MODELS = [
  "TheBloke/Mistral-7B-Phibrarian-32K-GGUF",
  "TheBloke/Mistral-7B-SciPhi-32k-GGUF",
];
export function parseModelInfo(modelInfo: any) {
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

export async function loadCatalog() {
  const originalCount = await prisma.model.count();
  let count = 0;
  for (const modelInfo of catalog) {
    const parsedInfo = parseModelInfo(modelInfo);
    if (!parsedInfo) {
      continue;
    }

    try {
      await prisma.model.upsert({
        where: {
          remoteId: parsedInfo.remoteId,
        },
        update: {},
        create: {
          ...parsedInfo,
          lastModifiedDate: new Date(parsedInfo.lastModifiedDate),
          files: {
            createMany: {
              data: parsedInfo.files,
            },
          },
          author: {
            connectOrCreate: {
              where: {
                slug: parsedInfo.author.slug,
              },
              create: parsedInfo.author,
            },
          },
        },
      });
      count++;
    } catch (error) {
      console.error(`Error adding model ${parsedInfo.remoteId}`, error);
    }
  }
  console.log(
    `Added ${count - originalCount} new models, updated ${count} total`
  );
}
