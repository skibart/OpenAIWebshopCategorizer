async function setProductCategory(connection, productID, categoryID) {
  const sql = `
  INSERT INTO lem_product_to_category (product_id, category_id) VALUES (?, ?); 
  `;

  try {
    const [queryResult] = await connection.query(sql, [productID, categoryID]);
    return queryResult;
  } catch (error) {
    console.error("Error occurred while retrieving rainfall data:", error);
    throw error;
  }
}

export { setProductCategory };
