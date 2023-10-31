import { loadCatalog } from "./scripts/loadCatalog";

async function main() {
  try {
    const res = await loadCatalog();
  } catch (error) {
    console.error("Error in main function response:", error);
  }
}

main();
