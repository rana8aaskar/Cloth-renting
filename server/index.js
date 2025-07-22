import dotenv from 'dotenv'
import ConnectDB from './db.js';
import express from "express"
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import listingRouter from "./routes/listing.route.js"
import cors from 'cors';
import uploadRouter from "./routes/upload.route.js"
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config({
    path: './.env'
});

app.use(cookieParser());
app.use(cors());
app.use(express.json());

ConnectDB()
.then(() => {
    app.on("error", (err) => {
        console.log("Error: ", err);
        throw err;
    });

    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running at ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log('MONGO db connection failed !!.');
});

app.use("/server/user", userRouter);
app.use("/server/auth", authRouter);
app.use("/server/upload", uploadRouter);
app.use("/server/listing", listingRouter);

// ✅ Add health check route here
app.get('/', (req, res) => {
    res.send('Backend is up and running 🚀');
});

// Error-handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
