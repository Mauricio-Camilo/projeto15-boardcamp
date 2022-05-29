import express from "express";
import {getGames, postGames} from "./../controllers/gamesController.js";
// import {gamesValidation} from "./../middlewares/validationMiddlewares.js";

const gamesRouter = express.Router();

gamesRouter.get("/games", getGames);

// README: INSERIR AQUI O MIDDLEWARE PREPARADO
gamesRouter.post("/games", postGames);

export default gamesRouter;