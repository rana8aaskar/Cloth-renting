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
        res.cookie("access_token",token,{httpOnly: true, expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)})
        .status(200).json({
            success: true,
            message: "Login successfully",
            loggedInUser
        })
        
    } catch (error) {
        next(error)
    }
}