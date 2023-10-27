// this function takes json like this from catalog.json and loads them into the prisma schema
// {
//     "_descriptorVersion": "0.0.1",
//     "datePublished": "2023-07-27T07:00:55.000Z",
//     "name": "Stable Beluga 13B",
//     "description": "Stable Beluga 13B is a language model developed by Stability AI, derived from the Llama2 13B model and tailored for English language tasks. It has undergone fine-tuning on a proprietary Orca-style dataset. The training procedure employs a supervised learning approach, with the model trained in mixed-precision (BF16) and optimized using the AdamW optimizer. To utilize Stable Beluga 13B, a specific interaction pattern involving a system prompt (\"### System:\"), user input (\"### User:\"), and the model's response is followed (\"### Assistant\"). This language model operates under a non-commercial community license. More details about the license can be found in the Hugging Face model card.",
//     "author": {
//         "name": "StabilityAI",
//         "url": "https://stability.ai/",
//         "blurb": "Stability's goal is to maximize the accessibility of modern AI to inspire global creativity and innovation."
//     },
//     "numParameters": "13B",
//     "resources": {
//         "canonicalUrl": "https://huggingface.co/stabilityai/StableBeluga-13B",
//         "downloadUrl": "https://huggingface.co/TheBloke/StableBeluga-13B-GGML"
//     },
//     "trainedFor": "chat",
//     "arch": "llama",
//     "files": {
//         "highlighted": {
//             "economical": {
//                 "name": "stablebeluga-13b.ggmlv3.q4_K_S.bin"
//             },
//             "most_capable": {
//                 "name": "stablebeluga-13b.ggmlv3.q6_K.bin"
//             }
//         },
//         "all": [
//             {
//                 "name": "stablebeluga-13b.ggmlv3.q4_K_S.bin",
//                 "url": "https://huggingface.co/TheBloke/StableBeluga-13B-GGML/resolve/main/stablebeluga-13b.ggmlv3.q4_K_S.bin",
//                 "sizeBytes": 7365545088,
//                 "quantization": "Q4_K_S",
//                 "format": "ggml",
//                 "sha256checksum": "89262c80eb0899fbcad0538d4e10efe82a7e0d7d0371b6025d487d66a264338e",
//                 "publisher": {
//                     "name": "TheBloke",
//                     "socialUrl": "https://twitter.com/TheBlokeAI"
//                 },
//                 "respository": "TheBloke/StableBeluga-13B-GGML",
//                 "repositoryUrl": "https://huggingface.co/TheBloke/StableBeluga-13B-GGML"
//             },
//             {
//                 "name": "stablebeluga-13b.ggmlv3.q6_K.bin",
//                 "url": "https://huggingface.co/TheBloke/StableBeluga-13B-GGML/resolve/main/stablebeluga-13b.ggmlv3.q6_K.bin",
//                 "sizeBytes": 10678850688,
//                 "quantization": "Q6_K",
//                 "format": "ggml",
//                 "sha256checksum": "59e1f74d30bdce1995c9c94901e75bc32e34e31dd8e8f1ab1cda6ea0f18bb54d",
//                 "publisher": {
//                     "name": "TheBloke",
//                     "socialUrl": "https://twitter.com/TheBlokeAI"
//                 },
//                 "respository": "TheBloke/StableBeluga-13B-GGML",
//                 "repositoryUrl": "https://huggingface.co/TheBloke/StableBeluga-13B-GGML"
//             }
//         ]
//     }
// },

import prisma from "./prisma";
import catalog from "../catalog.json";

async function loadCatalog() {
  // for each model in the catalog array, create a new Model in the database and if necessary create an Author
  for (const model of catalog) {
    const slug = model.name.toLowerCase().replace(" ", "-");

    var dbModel = await prisma.Model.findUnique({ slug });

    if (dbModel) {
      console.log("skipping", model.name);
      return;
    } else {
      console.log("adding", model.name);
    }

    var author = await prisma.Author.where({
      name: model.author.name,
    });
    if (!author) {
      author = await prisma.Author.create({
        data: {
          name: model.author.name,
          url: model.author.url,
          blurb: model.author.blurb,
          slug: model.author.name.toLowerCase().replace(" ", "-"),
        },
      });
    }

    dbModel = await prisma.Model.create({
      data: {
        authorId: author.id,
        name: model.name,
        description: model.description,
        datePublished: model.datePublished,
        numParameters: model.numParameters,
        trainedFor: model.trainedFor,
        arch: model.arch,
        canonicalUrl: model.resources.canonicalUrl,
        downloadUrl: model.resources.downloadUrl,
        slug,
      },
    });

    // for each file in the model, create a new File in the database
    model.files.all.forEach((file) => {
      prisma.File.create({
        data: {
          name: file.name,
          url: file.url,
          sizeBytes: file.sizeBytes,
          quantization: file.quantization,
          format: file.format,
          sha256checksum: file.sha256checksum,
          repository: file.respository,
          repositoryUrl: file.repositoryUrl,
          modelId: dbModel.id,
          publisherName: file.publisher.name,
          publisherSocialUrl: file.publisher.socialUrl,
        },
      });
    });
  }
}

await loadCatalog();
