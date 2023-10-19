import mysqlPromise from "mysql2/promise";

async function connectToDatabase() {
  try {
    const connection = await mysqlPromise.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DBNAME,
    });
    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

export { connectToDatabase };
