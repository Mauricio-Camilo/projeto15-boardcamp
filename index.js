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
    if (name === "") return res.sendStatus(400);
    try {
        const category = await connection.query(
            `SELECT * FROM categories WHERE name=$1`,[name]);
        if (category.rows.length !== 0) return res.sendStatus(409);
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

app.post("/games", async (req,res) => {
    const {name, image, stockTotal, categoryId, pricePerDay} = req.body;
    if (name === "") return res.sendStatus(400);
    if (stockTotal < 0) return res.sendStatus(400);
    if (pricePerDay < 0) return res.sendStatus(400);
    
    /* README: FAZER UMA BUSCA NO BANCO DE DADOS E INVALIDAR A OPERAÇÃO CASO
    SEJA INSERIDA UM ID NÃO EXISTENTE NO BANCO DE CATEGORIAS E TAMBÉM UM JOGO
    JÁ EXISTENTE*/
    try {
        const query = await connection.query(
            `INSERT INTO games ("name", "image", "stockTotal", "categoryId", "pricePerDay") 
            VALUES ($1,$2,$3,$4,$5)`,
            [name,image,stockTotal,categoryId,pricePerDay]);
        res.send(query).status(200);
    }
    catch (e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao inserir um jogo");
    }
})

app.get("/games", async (req,res) => {
    const nome = req.query.name;
    try {
        if (nome !== undefined) {
            const query = await connection.query(`SELECT * FROM games WHERE name LIKE '${nome}%'`);
            res.send(query.rows);
        }
        else {
            const query = await connection.query(`SELECT * FROM games`);
            res.send(query.rows);
        }
    }
    catch (e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao exibir as categorias");
    }
})


app.listen(PORT, 
    () => {console.log(chalk.bold.blue(`Servidor conectado na porta ${PORT}`))});