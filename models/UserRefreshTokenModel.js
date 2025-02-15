const mongoose= require("mongoose")

const UserRefreshTokenSchema= new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
    token:{type:String, require:true},
    blacklisted: { type: Boolean, default: false },
    createdAt:{type:Date,default:Date.now, expires:'5d'}
})

// Model
const UserRefreshTokenModel= mongoose.model("UserRefreshToken", UserRefreshTokenSchema);

module.exports= UserRefreshTokenModel