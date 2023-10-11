import { supabase } from "./subabaseClient.js";

async function insertToSubabase(contentData, embeddingData) {
  try {
    const { error } = await supabase
      .from("documents")
      .insert({ content: contentData, embedding: embeddingData });

    if (error) {
      throw new Error(`Error inserting data: ${error.message}`);
    }

    console.log("Data inserted successfully.");
  } catch (error) {
    console.error("Error inserting data:", error.message);
  }
}

export { insertToSubabase };
