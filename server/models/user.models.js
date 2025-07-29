import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique: true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true,
    },
    avatar: {
        type: String,
        default: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.1029488665.1711359014&semt=ais_hybrid"
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
    
},
{
    timestamps: true
})

const User = mongoose.model("User", userSchema)

export default User;