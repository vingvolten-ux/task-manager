import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log("Connected to PostgreSQL database");



export default pool;