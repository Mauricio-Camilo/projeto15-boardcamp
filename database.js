import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

let objectConfig = {connectionString: process.env.DATABASE_URL};

if(process.env.MODE === "PROD") {
    objectConfig.ssl = {
      rejectUnauthorized: false
    }
  }

const connection = new Pool(objectConfig);

export default connection;



