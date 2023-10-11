import { connectToDatabase } from "./connectToDatabase.js";
import { getProductName } from "../models/getProductName.js";
import { setProductCategory } from "../models/setProductCategory.js";

async function productDbControler(productID) {
  try {
    const connection = await connectToDatabase();
    const result = await getProductName(connection, productID);
    connection.end();
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}
async function productToCategoryControler(productID, categoryID) {
  try {
    const connection = await connectToDatabase();
    const result = await setProductCategory(connection, productID, categoryID);
    connection.end();
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

export { productDbControler, productToCategoryControler };
