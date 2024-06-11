
import dotenv from 'dotenv'
import express from 'express'
import connectDb from './db/db.js';
import { app } from './app.js';

dotenv.config({
    path: "./.env"
})


connectDb().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server Listening On Port ",process.env.PORT)
    })
}).catch((err)=>{
    console.log("Error While Listening Port",err)
})




