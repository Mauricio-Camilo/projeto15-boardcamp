import express from "express";
import {getRents, postRents, updateRents, deleteRents} from "../controllers/rentsController.js";

const rentsRouter = express.Router();

rentsRouter.get("/rents", getRents);
rentsRouter.post("/rents", postRents);
rentsRouter.update("/rents", updateRents);
rentsRouter.delete("/rents", deleteRents);
