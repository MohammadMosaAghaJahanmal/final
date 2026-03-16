import express from "express";
import { createUser, getAllUsers } from "../../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/all", getAllUsers);
userRouter.post("/create", createUser)
export default userRouter;

