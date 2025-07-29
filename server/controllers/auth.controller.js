import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const signup = async(req, res, next) => {
   const {username, email, password} = req.body;
   const hashedPassword =  bcrypt.hashSync(password, 10)
   const newUser = new User({
       username,
       email,
       password: hashedPassword,
   })
   try {
    await newUser.save()
    res.status(201).json("user created successfully")
   } catch (error) {
    next(error)

   }
}

export const signin = async(req, res, next) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email})
        if(!user) return next(errorHandler(404, "user not found"))
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) return next(errorHandler(400, "Invalid Password"))
        
            const loggedInUser = await User.findById(user.id).select("-password")
            

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        res.cookie("access_token",token,{
            httpOnly: true, 
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production'
        })
        .status(200).json({
            success: true,
            message: "Login successfully",
            loggedInUser
        })
        
    } catch (error) {
        next(error)
    }
}

export const google = async(req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email})

        if(user){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

            const loggedInUser = await User.findById(user.id).select("-password")
            res.cookie("access_token",token,{
                httpOnly: true, 
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production'
            })
            .status(200).json({
                success: true,
                message: "Login successfully",
                loggedInUser
            })
            
        }
        else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10)
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
                
            })
            await newUser.save()
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET)
            const {password:pass , ...rest } = newUser._doc
            res.cookie("access_token",token,{
                httpOnly: true, 
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production'
            })
            .status(200).json({
                success: true,
                message: "Login successfully",
                loggedInUser: rest
            })
        }
    } catch (error) {
        next(error)
        
    }
}

export const signout = async(req, res, next) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production'
        })
        res.status(200).json({
            success: true,
            message: "Logout successfully"
        })
    } catch (error) {
        next(error)

    }
}