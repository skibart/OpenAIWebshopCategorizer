function createLineChunks(inputText) {
  const lines = inputText
    .toString()
    .split("\n")
    .filter((line) => line.trim() !== "");
  const cleanedLines = lines.map((line) => line.replace(/\r$/, ""));
  return cleanedLines;
}

export { createLineChunks };
