import express from "express";
import {getCustomers, getIdCustomers, postCustomers, updateCustomers} from "../controllers/customersController.js";
import {customersValidation, cpfValidation} from "./../middlewares/validationMiddlewares.js"

const customersRouter = express.Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getIdCustomers);
customersRouter.post("/customers", cpfValidation, customersValidation, postCustomers); 
customersRouter.put("/customers/:id", customersValidation, updateCustomers); 

export default customersRouter;