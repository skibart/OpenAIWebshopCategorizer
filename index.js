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
  const completion = await queryOpenAi(productName, trimAndTokenized);
  return completion;
}

async function readIdNameCheckCategoryAndSet(path) {
  const data = await readFileAsync(path);
  const products = await createLineChunks(data);

  for (const product of products) {
    const productID = product;
    const productName = await productDbControler(product);
    const categoryProduct = await queryDbAndOpenAi(productName);
    if (/^\d{1,3}$/.test(categoryProduct)) {
      const response = await productToCategoryControler(
        productID,
        categoryProduct
      );
      console.log(response);
    } else {
      console.log("something is wrong");
    }

    console.log(productID, productName, categoryProduct);
  }
}
// readIdNameCheckCategoryAndSet("./product_list.txt");
