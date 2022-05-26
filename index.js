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

app.post("/categories", async (req,res) => {
    const {name} = req.body;
    console.log(name);
    if (name === "") return res.sendStatus(400);
    /* README: FAZER UMA BUSCA NO BANCO DE DADOS E INVALIDAR A OPERAÇÃO CASO
    SEJA INSERIDA UMA CATEGORIA JÁ EXISTENTE */
    try {
        const query = await connection.query(
            `INSERT INTO categories (name) 
            VALUES ($1)`,
            [name]);
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