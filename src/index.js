import dotenv from 'dotenv'
import express from 'express'
import connectDb from './db/db.js';
let app = express()

dotenv.config()


connectDb().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server Listening On Port ",process.env.PORT)
    })
}).catch((err)=>{
    console.log("Error While Listening Port",err)
})



