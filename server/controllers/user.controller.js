import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import User from "../models/user.models.js";
import Listing from "../models/listing.models.js";

export const test = (req, res) => {
    res.json({
        message: "api route is working fine"
    })
}

// Get current user profile
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res,next) => {
    if(req.user.id !==req.params.id) return next(errorHandler(403,"You can only update your own account!"));
    try {
        if(req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        },{new: true});

        const {password, ...rest} = updateUser._doc;

        res.json({
            success: true,
            message: "User updated successfully",   
            user:rest
        })
    } catch ( err) {
        console.log(err);
        
        return next(errorHandler(500,"Internal server error!"));
    }
}

export const deleteUser = async (req, res,next) => {
    if(req.user.id !==req.params.id) return next(errorHandler(403,"You can only delete your own account!"));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("access_token", );
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        })
    } catch ( err) {
        console.log(err);
        
        return next(errorHandler(500,"Internal server error!"));
    }
}

export const getUserListings = async (req, res,next) => {
    if(req.user.id ==req.params.id) {
        try {
            const listings = await Listing.find({owner: req.params.id});
            res.status(200).json({
                success: true,
                listings: listings,
            })
        } catch (error) {
            next(error)
        }
    }else{
        return next(errorHandler(403,"You can only get your own listings!"));
    }
}

export const getUser = async (req, res,next) => {
    try {
        const user = await User.findById(req.params.id);
    
        if(!user) return next(errorHandler(404,"User not found!"));
    
        const {password: pass, ...rest} = user._doc;
    
        res.status(200).json({
            success: true,
            user: rest,
        })
    } catch (error) {
        next(error);
    }
}
