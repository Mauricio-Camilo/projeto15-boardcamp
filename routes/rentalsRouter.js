import express from "express";
import {getRentals, postRentals, updateRentals, deleteRentals} from "../controllers/rentalsController.js";

const rentalsRouter = express.Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", postRentals);
rentalsRouter.post("/rentals/:id/return", updateRentals);
rentalsRouter.delete("/rentals/:id", deleteRentals);

export default rentalsRouter;