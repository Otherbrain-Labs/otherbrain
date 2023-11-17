import { load as loadModels } from "./models";
import { load as loadScores } from "./scores";

async function updateData() {
  try {
    await loadModels(false, true);
    await loadScores(false, true);
  } catch (error) {
    console.error("Error in main function response:", error);
    throw error;
  }
}

updateData();
