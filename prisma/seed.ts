import { loadCatalog } from "./scripts/loadCatalog";
import { loadScores } from "./scripts/loadScores";

async function main() {
  try {
    await loadCatalog();
    await loadScores();
  } catch (error) {
    console.error("Error in main function response:", error);
  }
}

main();
