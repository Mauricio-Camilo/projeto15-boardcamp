import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import connection from "./database.js";
import categoriesRouter from "./routes/categoriesRouter.js";
import gamesRouter from "./routes/gamesRouter.js";
import customersRouter from "./routes/customersRouter.js";
// import rentsRouter from "./routes/rentsRouter.js";

dotenv.config();

const app = express();
app.use(json());
app.use(cors());
app.use(categoriesRouter);
app.use(gamesRouter);
app.use(customersRouter);
// app.use(rentsRouter);

const PORT = process.env.PORT || 4000

app.listen(PORT,
    () => { console.log(chalk.bold.blue(`Servidor conectado na porta ${PORT}`)) });