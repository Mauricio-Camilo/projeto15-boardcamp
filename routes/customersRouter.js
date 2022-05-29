import express from "express";
import {getCustomers, getIdCustomers, postCustomers, updateCustomers} from "../controllers/customersController.js";
import customersValidation from "./../middlewares/validationMiddlewares.js"

const customersRouter = express.Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getIdCustomers);
customersRouter.post("/customers", postCustomers); // colocar o middleware aqui
customersRouter.put("/customers/:id", updateCustomers); // colocar o middleware aqui

export default customersRouter;