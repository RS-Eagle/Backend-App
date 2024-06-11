import { Router } from "express";
import { changeCurrentPassword, loginUser, logout, refreshTokenAcces, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";


let router = Router();

router.route("/register").post(upload.fields(
    [
    {name:"avatar",maxCounr:1},
    {name:"coverImage",maxCount:1}]
),registerUser)


router.route("/login").post(loginUser)
 
router.route("/logout").post(jwtVerify,logout)

router.route("/refresh-token").post(refreshTokenAcces)
router.route("/changePassword").post(jwtVerify,changeCurrentPassword)

export default router
