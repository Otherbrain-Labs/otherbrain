import prisma from "../../lib/prisma";
import catalog from "../data/catalog.json";

const IGNORED_MODELS = [
  "TheBloke/minotaur-13B-GGUF",
  "TheBloke/tinyllama-1.1b-chat-v0.3_platypus-GGUF",
];

function parseModelInfo(modelInfo: any) {
  try {
    const { model, baseModel } = modelInfo;

    const authorName = model.cardData?.model_creator;
    const authorParam =
      model.cardData?.base_model.split("/")[0] ||
      baseModel?.modelId.split("/")[0];
    const authorSlug = authorParam.toLowerCase().replaceAll(" ", "-");

    const ggufId = model.id;
    const remoteId = baseModel?.modelId || model.cardData?.base_model;

    const modelSlug = remoteId.split("/")[1].toLowerCase();
    const modelName =
      model.cardData?.model_name || remoteId.split("/")[1].replaceAll("_", " ");

    const license =
      baseModel?.cardData?.license?.[0] || model?.cardData?.license?.[0];
    const arch = model.cardData?.model_type || "other";
    const lastModified = baseModel?.lastModified || model?.lastModified;

    // Parse Parameters
    const safetensors =
      model.safetensors?.total || baseModel?.safetensors?.total;
    let numParameters;
    if (safetensors) {
      numParameters = Math.round(safetensors / 1000000000) + "B";
    } else {
      numParameters =
        modelSlug.match(/\d+[Bb]/)?.[0].toUpperCase() ||
        modelName.match(/\d+[Bb]/)?.[0].toUpperCase();
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

    return {
      name: modelName,
      slug: modelSlug,
      remoteId,
      ggufId,
      lastModified,
      license,
      numParameters,
      arch,
      author: {
        name: authorName,
        remoteId: authorParam,
        slug: authorSlug,
      },
      files,
    };
  } catch (error) {
    console.error("Error parsing model info:", modelInfo.id);
    console.error(error);
  }
}

export async function loadCatalog() {
  // for each model in the catalog array, create a new Model in the database and if necessary create an Author
  for (const modelInfo of catalog) {
    if (IGNORED_MODELS.includes(modelInfo.model.id)) {
      console.info("Skipping ignored model", modelInfo.model.id);
      continue;
    }
    const parsedInfo = parseModelInfo(modelInfo);
    if (!parsedInfo) {
      console.info("Skipping unparsed model", modelInfo.model.id);
      continue;
    }
    try {
      var author = await prisma.author.findFirst({
        where: {
          slug: parsedInfo.author.slug,
        },
      });

      if (!author) {
        author = await prisma.author.create({
          data: {
            name: parsedInfo.author.name,
            slug: parsedInfo.author.slug,
            remoteId: parsedInfo.author.remoteId,
          },
        });
      }

      var dbModel = await prisma.model.findFirst({
        where: { authorId: author.id, slug: parsedInfo.slug },
      });

      if (dbModel) {
        console.log("skipping", parsedInfo.name);
        continue;
      } else {
        console.log("adding", parsedInfo.name);
      }

      if (
        ![
          "llama",
          "starcoder",
          "mistral",
          "falcon",
          "tinyllama",
          "aquila",
        ].includes(parsedInfo.arch)
      ) {
        throw new Error(
          "trainedFor must be one of 'llama', 'starcoder', or 'mpt'"
        );
      }

      dbModel = await prisma.model.create({
        data: {
          authorId: author.id,
          name: parsedInfo.name,
          slug: parsedInfo.slug,
          numParameters: parsedInfo.numParameters,
          arch: parsedInfo.arch,
          license: parsedInfo.license,
          remoteId: parsedInfo.remoteId,
          ggufId: parsedInfo.ggufId,
          lastModifiedDate: new Date(parsedInfo.lastModified),
        },
      });

      // for each file in the model, create a new File in the database
      parsedInfo.files.forEach(async (file) => {
        try {
          await prisma.file.create({
            data: {
              name: file.name,
              quantization: file.quantization,
              format: file.format,
              modelId: dbModel!.id,
            },
          });
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(parsedInfo);
      throw error;
    }
  }
}
