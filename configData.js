const configData = {
  chunkSize: 500,
  question: "",
  limitTokenForContex: 1500,
  documentPath: "base.txt",
  aiModel: "gpt-3.5-turbo",
  aiInstruction: `wiedząc że pierwsza wartość to ID po średniku nazwa kategorii po następnym średniku to nazwa produktu, podaj wyłącznie samo ID kategorii dla: `,
};

export { configData };
