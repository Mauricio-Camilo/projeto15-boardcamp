import express, {json} from "express";
import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";

const app = express();
app.use(json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 4000

app.listen(PORT, 
    () => {console.log(chalk.bold.blue(`Servidor conectado na porta ${PORT}`))});