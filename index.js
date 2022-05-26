import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import connection from "./database.js";

const app = express();
app.use(json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 4000

/* README: CRIAR OS ROUTERS, CONTROLLERS E ALGUNS MIDDLEWARES EM LINS */

app.post("/categories", async (req, res) => {
    const { name } = req.body;
    if (name === "") return res.sendStatus(400);
    try {
        const category = await connection.query(
            `SELECT * FROM categories WHERE name=$1`, [name]);
        if (category.rows.length !== 0) return res.sendStatus(409);
        const query = await connection.query(
            `INSERT INTO categories (name) 
            VALUES ($1)`,
            [name]);
        res.sendStatus(201);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao inserir uma categoria");
    }
})

app.get("/categories", async (req, res) => {
    try {
        const query = await connection.query(`SELECT * FROM categories`);
        res.send(query.rows);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao exibir as categorias");
    }
})

app.post("/games", async (req, res) => {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    if (name === "" || stockTotal < 0 || pricePerDay < 0) return res.sendStatus(400);

    try {
        // VALIDAÇÃO DE GAME EXISTENTE, COLOCAR DEPOIS EM UM MIDDLEWARE
        const game = await connection.query(
            `SELECT * FROM games WHERE name=$1`, [name]);
        if (game.rows.length !== 0) return res.sendStatus(409);
        // VALIDAÇÃO DE ID INEXISTENTE, COLOCAR DEPOIS EM UM MIDDLEWARE
        const id = await connection.query(
            `SELECT * FROM categories WHERE id=$1`, [categoryId]);
        if (id.rows.length === 0) return res.send("Id inexistente").status(409);

        const query = await connection.query(
            `INSERT INTO games ("name", "image", "stockTotal", "categoryId", "pricePerDay") 
            VALUES ($1,$2,$3,$4,$5)`,
            [name, image, stockTotal, categoryId, pricePerDay]);
        res.sendStatus(201);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao inserir um jogo");
    }
})

app.get("/games", async (req, res) => {
    const nome = req.query.name;
    try {
        if (nome !== undefined) {
            // README: DEPOIS APLICAR SQL INJECTION NO LIKE
            const query = await connection.query(`SELECT * FROM games WHERE name LIKE '${nome}%'`);

            res.send(query.rows);
        }
        else {
            const query = await connection.query(`SELECT * FROM games`);
            res.send(query.rows);
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao exibir as categorias");
    }
})

// app.post("/customers", async (req, res) => {
//     const { name, phone, cpf, birthday} = req.body;

//     // const birthdayRegex = alguma coisa
//     // birthdayRegex.test(birthday) RETORNA TRUE OU FALSE;

//     if (name === "" || cpf.length !== 11 
//     || phone.length !== 10) return res.sendStatus(400);

//      // README: FAZER A VALIDAÇÃO DO BIRTHDAY E DO PHONE

//     try {
//         // VALIDAÇÃO DE CPF EXISTENTE, COLOCAR DEPOIS EM UM MIDDLEWARE
//         const cpfclient = await connection.query(
//             `SELECT * FROM customers WHERE cpf=$1`, [cpf]);
//         if (cpfclient.rows.length !== 0) return res.sendStatus(409);

//         const query = await connection.query(
//             `INSERT INTO customers ("name", "phone", "cpf", "birthday") 
//             VALUES ($1,$2,$3,$4)`,
//             [name, phone, cpf, birthday]);
//         res.sendStatus(201);
//     }
//     catch (e) {
//         console.log(e);
//         res.status(500).send("Ocorreu um erro ao inserir um cliente");
//     }
// })

app.get("/customers", async (req, res) => {
    const cpf = req.query.cpf;
    try {
        if (cpf !== undefined) {
            const query = await connection.query(`SELECT * FROM customers WHERE cpf=$1', ${cpf}%'`);
            res.send(query.rows);
        }
        else {
            const query = await connection.query(`SELECT * FROM customers`);
            res.send(query.rows);
            console.log(query.rows);
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao exibir os clientes");
    }
})

app.get("/customers/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const clienteId = await connection.query(`SELECT * FROM customers WHERE id=$1`, [id]);
        if (clienteId.rows.length === 0) return res.send("Id inexistente").status(404);
        else return res.send(clienteId.rows);

    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao exibir os clientes");
    }
})

// FAZER UMA ROTA GET QUE BUSCA POR ID

// FAZER UMA ROTA PUT DOS CLIENTES ID, USAR AS MESMAS VALIDAÇÕES DO POST



app.listen(PORT,
    () => { console.log(chalk.bold.blue(`Servidor conectado na porta ${PORT}`)) });