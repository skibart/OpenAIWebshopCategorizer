import { encode } from "gpt-3-encoder";

async function countTokenAndShortByThat(rawData, tokenLimit) {
  let tokenCount = 0;
  let contextText = "";

  for (let i = 0; i < rawData.length; i++) {
    const document = rawData[i];
    const content = document.content;
    const encoded = encode(content);
    tokenCount += encoded.length;

    if (tokenCount > tokenLimit) {
      break;
    }

    contextText += `${content.trim()}\n---\n`;
  }
  return contextText;
}

export { countTokenAndShortByThat };
