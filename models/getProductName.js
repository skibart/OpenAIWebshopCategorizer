async function getProductName(connection, productID) {
  const sql = `
  SELECT name FROM lem_product_description WHERE product_id = ?
  `;

  try {
    const [[queryResult]] = await connection.query(sql, [productID]);
    return queryResult.name;
  } catch (error) {
    console.error("Error occurred while retrieving rainfall data:", error);
    throw error;
  }
}

export { getProductName };
