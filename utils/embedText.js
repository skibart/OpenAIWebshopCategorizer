import OpenAI from "openai";
import { config } from "dotenv";
config();

const openai = new OpenAI();

async function embedText(inputText) {
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: inputText,
  });
  const embedding = await embeddingResponse.data[0]["embedding"];
  return embedding;
}

export { embedText };
