import prisma from "../lib/prisma";
import catalog from "./data/catalog.json";

async function loadCatalog() {
  // for each model in the catalog array, create a new Model in the database and if necessary create an Author
  for (const model of catalog) {
    const slug = model.name.toLowerCase().replaceAll(" ", "-");

    var author = await prisma.author.findFirst({
      where: {
        name: model.author.name,
      },
    });
    if (!author) {
      author = await prisma.author.create({
        data: {
          name: model.author.name,
          url: model.author.url,
          blurb: model.author.blurb,
          slug: model.author.name.toLowerCase().replaceAll(" ", "-"),
        },
      });
    }

    var dbModel = await prisma.model.findFirst({
      where: { authorId: author.id, slug },
    });

    if (dbModel) {
      console.log("skipping", model.name);
      continue;
    } else {
      console.log("adding", model.name);
    }

    if (
      !(
        model.trainedFor === "chat" ||
        model.trainedFor === "instruct" ||
        model.trainedFor === "other"
      )
    ) {
      throw new Error(
        "trainedFor must be one of 'chat', 'instruct', or 'other'"
      );
    }

    if (
      !(
        model.arch === "llama" ||
        model.arch === "starcoder" ||
        model.arch === "mpt"
      )
    ) {
      throw new Error(
        "trainedFor must be one of 'llama', 'starcoder', or 'mpt'"
      );
    }

    dbModel = await prisma.model.create({
      data: {
        authorId: author.id,
        name: model.name,
        description: model.description,
        datePublished: new Date(model.datePublished),
        numParameters: model.numParameters,
        trainedFor: model.trainedFor,
        arch: model.arch,
        canonicalUrl: model.resources.canonicalUrl,
        downloadUrl: model.resources.downloadUrl,
        slug,
      },
    });

    // for each file in the model, create a new File in the database
    model.files.all.forEach(async (file) => {
      await prisma.file.create({
        data: {
          name: file.name,
          url: file.url,
          sizeBytes: file.sizeBytes,
          quantization: file.quantization,
          format: file.format,
          sha256checksum: file.sha256checksum,
          repository: file.respository,
          repositoryUrl: file.repositoryUrl,
          modelId: dbModel!.id,
          publisherName: file.publisher.name,
          publisherSocialUrl: file.publisher.socialUrl,
        },
      });
    });
  }
}

async function main() {
  try {
    const res = await loadCatalog();
  } catch (error) {
    console.error("Error in main function response:", error);
  }
}

main();
