import dotenv from 'dotenv'
import ConnectDB from './db.js';
import express from "express"
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import listingRouter from "./routes/listing.route.js"
import rentalRouter from "./routes/rental.route.js"
import adminRouter from "./routes/admin.route.js"
import cors from 'cors';
import uploadRouter from "./routes/upload.route.js"
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config({
    path: './.env'
});

app.use(cookieParser());

// Simple and reliable CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174', 
            'http://localhost:5175', // Admin panel
            'http://localhost:5176', // Admin panel alternate port
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174',
            'http://127.0.0.1:5175', // Admin panel
            'http://127.0.0.1:5176', // Admin panel alternate port
            'https://cloth-renting-frontend.onrender.com',
            'https://cloth-renting-admin.vercel.app', // Vercel admin panel
            'https://cloth-renting.vercel.app' // Alternative Vercel URL
        ];
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(null, true); // Allow all origins for now to debug
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());

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
app.use("/server/rental", rentalRouter);

// Add API routes for admin panel
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/listing", listingRouter);
app.use("/api/rental", rentalRouter);

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
