import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


let router = Router();

router.route("/register").post(upload.fields(
    {name:"avatar",maxCounr:1},
    {name:"coverImage",maxCount:1}
),registerUser)


export default router
