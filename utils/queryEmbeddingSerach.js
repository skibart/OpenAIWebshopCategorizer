import { supabase } from "./subabaseClient.js";
import { embedText } from "./embedText.js";

async function queryEmbeddingSerach(question) {
  const { data: documents } = await supabase.rpc("match_documents", {
    query_embedding: await embedText(question),
    match_threshold: 0.78,
    match_count: 10,
  });
  return documents;
}

export { queryEmbeddingSerach };
