import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";


let router = Router();

router.route("/register").post(registerUser)


export default router
