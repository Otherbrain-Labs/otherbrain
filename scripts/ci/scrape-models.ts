import { load } from "../models";

async function scrapeModels() {
  try {
    await load(false, false);
  } catch (error) {
    console.error("Error in main function response:", error);
  }
}

scrapeModels();
