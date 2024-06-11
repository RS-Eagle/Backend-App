import express from 'express'
import cookie_parser from 'cookie-parser'
import cors from 'cors'
let app = express();


app.use(cors({
    origin:process.env.ORIGIN_URI,
    credentials:true
}))



app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended: true,limit:"16kb"}));
app.use(express.static("public"))
app.use(cookie_parser())

// Router Import 

import router from './routes/user.routes.js';


// Router Declaration
app.use("/api/v1/user",router)


export {app}