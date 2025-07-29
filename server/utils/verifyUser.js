import { errorHandler } from "./errorHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        console.log('❌ No token found in cookies');
        return next(errorHandler(401, "You are not authenticated!"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            console.log('❌ User not found for token:', decoded.id);
            return next(errorHandler(404, "User not found!"));
        }
        
        console.log('✅ Token verified for user:', user.username);
        req.user = user;
        next();
    } catch (err) {
        console.log('❌ Token verification failed:', err.message);
        return next(errorHandler(403, "Token is not valid!"));
    }
}