// require('dotenv').config()
import dotenv from 'dotenv'
import ConnectDB from './db.js';
import express from "express"

const app = express();

dotenv.config({
    path:'./.env'
})
ConnectDB( )
.then(()=>{
    app.on("error",(err) => {
        console.log("Error: ",err)
        throw err;        
    })
    
    app.listen(process.env.PORT|| 3000,() => {
        console.log(`Server is running at ${process.env.PORT}`);
        
    })
})
.catch((err) => {
    console.log('MONGO db connection failed !!.');
})





