import express from "express";
import {getRentals, postRentals, updateRentals, deleteRentals} from "../controllers/rentalsController.js";

const rentalsRouter = express.Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", postRentals);
rentalsRouter.update("/rentals", updateRentals);
rentalsRouter.delete("/rentals", deleteRentals);
