function createChunk(inputText, chunksize) {
  const chunks = [];
  let i = 0;
  while (i < inputText.length) {
    chunks.push(inputText.slice(i, i + chunksize));
    i += chunksize;
  }
  return chunks;
}

export { createChunk };
