import { load as loadCatalog } from "../scripts/models";
import { load as loadScores } from "../scripts/scores";
import { load as loadReviews } from "../scripts/reviews";

async function main() {
  try {
    await loadCatalog();
    await loadScores();
    await loadReviews();
  } catch (error) {
    console.error("Error in main function response:", error);
  }
}

main();
