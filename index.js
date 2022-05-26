import express, {json} from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import pg from "pg";
import connection from "./database.js";


const app = express();
app.use(json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 4000

/* TESTE DA AULA */

// const {Pool} = pg;

// const db = new Pool ({
//     host:"localhost",
//     port: 5432,
//     user: "postgres",
//     password: "Mau8126705",
//     database: "desafio_sql_b672418d"
// })

// const query = db.query('SELECT * FROM produtos');

// query.then(result => {
//     console.log(result.rows);
// })

app.post("/categories", async (req,res) => {
    const {name} = req.body;
    try {
        const query = await connection.query(`INSERT INTO categories (name) VALUES ('${name}')`);
        res.sendStatus(201);
    }
    catch (e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao inserir uma categoria");
    }
})

app.get("/categories", async (req,res) => {
    try {
        const query = await connection.query(`SELECT * FROM categories`);
        res.send(query.rows);
    }
    catch (e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao exibir as categorias");
    }
})



app.listen(PORT, 
    () => {console.log(chalk.bold.blue(`Servidor conectado na porta ${PORT}`))});