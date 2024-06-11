import { asyncHandler } from "../utils/asynHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/User.models.js";
import { uploadFileCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"




const accessAndRefreshTokenGenerator = async (user)=>{
  try {
    const accessTokengenerated =  user.generateAccessToken()
    const refreshTokenGenerated = user.generateRefreshToken()
  
    user.refreshToken = refreshTokenGenerated;
    await user.save({validateBeforeSave: false})
    return {accessTokengenerated,refreshTokenGenerated}
  } catch (error) {
    throw new ApiErrors(500,"Something Went Wrong While Generating Acces And Refresh Token")
  }

 


}

const refreshTokenAcces = asyncHandler(async (req,res)=>{
try {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken

  
    if(!incomingToken){
      throw new ApiErrors(501,"Inavild Access")
    }
  
    const decodedDataFromToken = jwt.verify(incomingToken,process.env.REFRESH_TOKEN_SECRET)

  
   const user = await User.findById(decodedDataFromToken._id)

  
   if(!user){
    throw new ApiErrors(501,"Inavild Access")
   }
   if(incomingToken !== user?.refreshToken){
    throw new ApiErrors(501,"Inavild Access")
   }
  
   const {accessTokengenerated,refreshTokenGenerated}= await accessAndRefreshTokenGenerator(user)
   
 const option = {
  httpOnly:true,
  secure:true
 }

  
   res
   .status(200)
   .cookie("accessToken",accessTokengenerated,option)
   .cookie("refreshToken",refreshTokenGenerated,option)
   .json(
    new ApiResponse("Token Refresh",{accessTokengenerated,refreshTokenGenerated},200)
   )
} catch (error) {
  throw new ApiErrors(401,error?.message ||"Invalid Refresh Token")
}
 
})


const registerUser = asyncHandler(async (req,res)=>{
    // Get User Detail From Frontend
    //Validation
    //Suer Alerdy exixt using username email
    //Chexk For Avatar
    // Upload Them To Cloudniary, avatar
    // Create User Object - create entry in db
    // remove password And Referesh Token Field from response
    //Check For For USer Creation
    // return res

   const {fullName, email, username ,password} =  req.body

   const avatarLocalPath = req.files?.avatar[0]?.path
   let coverImageLocalPath 
   if(Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath =req.files?.coverImage[0]?.path
   }
   const avatar =  await uploadFileCloudinary(avatarLocalPath)
   const cover = await uploadFileCloudinary(coverImageLocalPath)

   if([fullName,email,username,password].some((field)=>field?.trim()==="")){


    throw new ApiErrors(400,"All Field Are Rquired")
   }
   

   const existedUser = await User.findOne({
    $or:[{username},{email}]
   })

   if(existedUser){
 
    throw new ApiErrors(409,"Username Or Email Already Existed")
   }



   if(!avatarLocalPath){
    throw new ApiErrors(400,"Avatar Is Required")
   }



  if(!avatar){
    throw new ApiErrors(400,"Avatar Is Required")
  }
  
  const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:cover?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if(!createdUser){
    throw new ApiErrors("500","Something Went Wrong While Registering User")
  }

  return res.status(201).json(new ApiResponse("User Registered Successfully",createdUser,200))

})

const loginUser = asyncHandler(async(req,res)=>{
  const {username,email,password} = req.body;

  if(!(username || email)){
    throw new ApiErrors(500, "email or username required")
  }

 const user = await User.findOne({
    $or: [{username},{email}] 
  })

  if(!(await user.isPasswordCorrect(password))){
    throw new ApiErrors(401,"Wrong Credentials")
  }

 const {accessTokengenerated,refreshTokenGenerated} =  await accessAndRefreshTokenGenerator(user)

 const loggedInUser = await User.findOne(user._id).select("-password -refreshToken")

 const option = {
  httpOnly:true,
  secure:true
 }

 res
 .status(200)
 .cookie("accessToken",accessTokengenerated,option)
 .cookie("refreshToken",refreshTokenGenerated,option)
 .json(
  new ApiResponse("User LoggedIn SuccessFully",{user:loggedInUser,accessTokengenerated,refreshTokenGenerated},200)
 )

})

const logout = asyncHandler(async (req,res)=>
  {
   await User.findByIdAndUpdate(
      req.user._id,{
        $set:{
          refreshToken: undefined
        }
      },{
        new: true
      }
    )

    const option = {
      httpOnly:true,
      secure:true
     }
    
     res
     .status(200)
     .clearCookie("accessToken",option)
     .clearCookie("refreshToken",option)
     .json(new ApiResponse("User LogOut",{},200))

  }
)

export {registerUser,loginUser,logout,refreshTokenAcces}