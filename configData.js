const categoriesToMatch = 3;

const configData = {
  chunkSize: 500,
  question: "",
  limitTokenForContex: 1500,
  vector_match_count: 20,
  howManyCategories: categoriesToMatch,
  documentPath: "base.txt",
  aiModel: "gpt-3.5-turbo",
  aiInstruction: `
  Provide your response as a JSON object with the following schema.
  if you find matching category set FoundCategory true else false
[{
"categories" : [here array with categories split by coma, only ID],
"FoundCategory" : true of false
}]
Knowing that:
The first value is 'category ID,' after the semicolon is 'category name,' after the next semicolon is 'product name.' Please provide ${categoriesToMatch} matching Category IDs for: };
  
  `,
};

export { configData };
