import mysqlPromise from "mysql2/promise.js";

async function connectToDatabase() {
  const connection = await mysqlPromise.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DBNAME,
  });
  return connection;
}

export { connectToDatabase };
