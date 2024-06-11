import { User } from "../models/User.models.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asynHandler.js";
import jwt from "jsonwebtoken"


export const jwtVerify = asyncHandler(async (req,res,next)=>{
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!token){
        throw new ApiErrors(401,"Unauthorized Request")
    }

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    const user =  User.findById(decodedToken?._id).select("-password -refreshToken")

    if(!user){
        throw new ApiErrors(401,"Invalid Access Token")
    }

    req.user = user

    next()


    
})