import express from "express";
import {getGames, postGames} from "./../controllers/gamesController.js";
import { gamesValidation } from "./../middlewares/validationMiddlewares.js";

const gamesRouter = express.Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", gamesValidation, postGames);

export default gamesRouter;