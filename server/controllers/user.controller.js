import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import User from "../models/user.models.js";

export const test = (req, res) => {
    res.json({
        message: "api route is working fine"
    })
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
            data:rest
        })
    } catch ( err) {
        console.log(err);
        
        return next(errorHandler(500,"Internal server error!"));
    }
}