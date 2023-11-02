import { load } from "../scores";

async function scrapeScores() {
  try {
    await load(false, false);
  } catch (error) {
    console.error("Error in main function response:", error);
  }
}

scrapeScores();
