import dotenv from 'dotenv'
import express from 'express'
import connectDb from './db/db.js';
let app = express();

dotenv.config()

connectDb();


app.listen(process.env.PORT,()=>{
    console.log("Server Working Properly ")
})

