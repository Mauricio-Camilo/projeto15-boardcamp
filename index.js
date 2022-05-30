import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import connection from "./database.js";
import categoriesRouter from "./routes/categoriesRouter.js";
import gamesRouter from "./routes/gamesRouter.js";
import customersRouter from "./routes/customersRouter.js";
// import rentalsRouter from "./routes/rentsRouter.js";

import dayjs from "dayjs";

dotenv.config();

// README: TESTAR OS MIDDLEWARES COM O THUNDER CLIENT;

const app = express();
app.use(json());
app.use(cors());
app.use(categoriesRouter);
app.use(gamesRouter);
app.use(customersRouter);
// app.use(rentsRouter);



app.post("/rentals", async (req, res) => {

    const { customerId, gameId, daysRented } = req.body;
    const rentDate = dayjs().format('YYYY-MM-DD');
    const returnDate = null;
    const delayFee = null;

    try {
        // VALIDAÇÃO DE DE DIAS
        if (daysRented < 0) return res.send("Número inválido").status(400);

        // VALIDAÇÃO DE ID DO GAME, COLOCAR DEPOIS EM UM MIDDLEWARE
        const idgame = await connection.query(
            `SELECT * FROM games WHERE id=$1`, [gameId]);
        if (idgame.rows.length === 0) return res.send("Id do game inexistente").status(400);

        const originalPrice = idgame.rows[0].pricePerDay * daysRented;
        const game = idgame.rows[0];


        // VALIDAÇÃO DE ID DO CLIENTE, COLOCAR DEPOIS EM UM MIDDLEWARE
        const iduser = await connection.query(
            `SELECT * FROM customers WHERE id=$1`, [customerId]);
        if (iduser.rows.length === 0) return res.send("Id do usuario inexistente").status(400);

        const customer = iduser.rows[0];
        // console.log(customer);

        const query = await connection.query(
            `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented",
             "returnDate","originalPrice","delayFee") 
            VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [customerId, gameId, rentDate, daysRented, returnDate,
                originalPrice, delayFee]);
        res.sendStatus(201);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao inserir um aluguel");
    }
})




const PORT = process.env.PORT || 4000

app.listen(PORT,
    () => { console.log(chalk.bold.blue(`Servidor conectado na porta ${PORT}`)) });

