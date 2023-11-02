import { load as loadCatalog } from "../scripts/models";
import { load as loadScores } from "../scripts/scores";

async function main() {
  try {
    await loadCatalog();
    await loadScores();
  } catch (error) {
    console.error("Error in main function response:", error);
  }
}

main();
