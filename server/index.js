// require('dotenv').config()
import dotenv from 'dotenv'
import ConnectDB from './db.js';
import express from "express"
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import listingRouter from "./routes/listing.route.js"
import cors from 'cors';
import uploadRouter from "./routes/upload.route.js"
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();
const __dirname = path.resolve();
<<<<<<< HEAD
=======

>>>>>>> 50ed28d178dce3aeffe818d1e1e32b359ae8e72b

dotenv.config({
    path:'./.env'
})

app.use(cookieParser())
app.use(cors())
app.use(express.json())
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


app.use("/server/user", userRouter)
app.use("/server/auth", authRouter)
app.use("/server/upload", uploadRouter)
app.use("/server/listing",listingRouter)

app.use(express.static(path.join(__dirname, '/client/dist')));

<<<<<<< HEAD
// app.use(express.static(path.join(__dirname, '/client/dist')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });


=======
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
>>>>>>> 50ed28d178dce3aeffe818d1e1e32b359ae8e72b

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({ 
        success: false,
        statusCode,
        message 
    });
})

