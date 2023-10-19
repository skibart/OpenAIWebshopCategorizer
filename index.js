import OpenAI from "openai";
import fs from "fs";
import { config } from "dotenv";

import { embedText } from "./utils/embedText.js";
import { createChunk } from "./utils/createChunk.js";
import { createLineChunks } from "./utils/createLineChunks.js";
import { insertToSubabase } from "./utils/insertToSubabase.js";
import { readFileAsync } from "./utils/readFileAsync.js";
import { queryEmbeddingSerach } from "./utils/queryEmbeddingSerach.js";
import { countTokenAndShortByThat } from "./utils/countTokenAndShortByThat.js";
import { configData } from "./configData.js";
import {
  productDbControler,
  productToCategoryControler,
} from "./utils/dbController.js";
import { json } from "stream/consumers";

const openai = new OpenAI();

async function CreateEmbeddingAddtoDB(path) {
  const data = await readFileAsync(path);
  const chunks = await createLineChunks(data);
  for (const chunk of chunks) {
    const embedchunk = await embedText(chunk);
    insertToSubabase(chunk, embedchunk);
  }
  // try {
  //   const data = await readFileAsync(path);
  //   const lines = data.toString().split("\n");
  //   const concatedFileText = lines.join(" ").trim().replace(/\s+/g, " ");
  //   const chunks = createChunk(concatedFileText, configData.chunkSize);

  //   for (const chunk of chunks) {
  //     const embedchunk = await embedText(chunk);
  //     insertToSubabase(chunk, embedchunk);
  //   }
  // } catch (err) {
  //   console.error("Error:", err);
  // }
}

// CreateEmbeddingAddtoDB(configData.documentPath);

async function queryOpenAi(question, trimAndTokenized) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: trimAndTokenized },
        {
          role: "user",
          content: `${configData.aiInstruction} ${question}`,
        },
      ],

      model: configData.aiModel,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error querying OpenAI:", error.message);
    return { error: "An error occurred while querying OpenAI." };
  }
}

async function queryDbAndOpenAi(productName) {
  const responseData = await queryEmbeddingSerach(productName);
  const trimAndTokenized = await countTokenAndShortByThat(
    responseData,
    configData.limitTokenForContex
  );
  const rawCompletion = await queryOpenAi(productName, trimAndTokenized);
  const jsonCompletion = JSON.parse(rawCompletion);
  return jsonCompletion[0];
}

async function readIdNameCheckCategoryAndSet(path) {
  const data = await readFileAsync(path);
  const products = await createLineChunks(data);

  for (const productID of products) {
    const productName = await productDbControler(productID);
    const completionResponse = await queryDbAndOpenAi(productName);
    if (completionResponse) {
      if (completionResponse.FoundCategory) {
        for (let i = 0; i < configData.howManyCategories; i++) {
          if (/^\d{1,3}$/.test(+completionResponse.categories[i])) {
            const response = await productToCategoryControler(
              productID,
              +completionResponse.categories[i]
            );
            console.log(response);
          } else {
            console.log("Sorry, something wrong with category ID");
          }
        }
        console.log(productID, completionResponse);
      } else {
        console.log("Sorry, Ai cant find a matching category");
      }
    } else {
      console.log("Sorry, problem with response");
    }
  }
}
readIdNameCheckCategoryAndSet("./product_list.txt");
