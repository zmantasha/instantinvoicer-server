const UserServices= require("../services/userServices")
const UserServicesInstance= new UserServices()

class UserMiddleware{
    static fetchEmailIncollection=async(req,res,next)=>{
    try {
      const {email}= req.body
      const user= await UserServicesInstance.findByEmail(email)
      if(!user) return res.status(404).json({ message: "User not found!", email });  
      req.user=user
      next();
    } catch (error) {
     res.status(500).json({message:"could not find user"})   
    }  
    }
}

module.exports= UserMiddleware