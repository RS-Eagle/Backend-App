import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectDb = async  ()=>{
    try {
    let dbConnection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    console.log("dataBase Connected")
    } catch (error) {
        console.log("Error Occured in Mongoose Connection", error)
    }    
}


export default connectDb;