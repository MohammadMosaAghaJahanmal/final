import express from "express";
import { creatGarson, gitAllGarsons } from "../../controllers/garson.controller.js";

const GarsonRouter = express.Router();

// git all garsons
GarsonRouter.get("/all", gitAllGarsons);

// Creat Garson
GarsonRouter.post('/creat', creatGarson)
export default GarsonRouter;