import { asyncHandler } from "../utils/asynHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/User.models.js";
import { uploadFileCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


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

   if([fullName,email,username,password].some((field)=>field?.trim()==="")){
    throw new ApiErrors(400,"All Field Are Rquired")
   }

   const existedUser = User.findOne({
    $or:[{username},{email}]
   })

   if(existedUser){
    throw new ApiErrors(409,"Username Or Email Already Existed")
   }

   const avatarLocalPath = req.files?.avatar[0]?.path
   const coverImageLocalPath = req.files?.coverImage[0]?.path

   if(!avatarLocalPath){
    throw new ApiErrors(400,"Avatar Is Required")
   }

  const avatar =  await uploadFileCloudinary(avatarLocalPath)
  const cover = await uploadFileCloudinary(coverImageLocalPath)

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
  if(createdUser){
    throw new ApiErrors("500","Something Went Wrong While Registering User")
  }

  return res.status(201).json(new ApiResponse("User Registered Successfully",createdUser,200))

})

export {registerUser}