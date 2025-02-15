const UserServices= require("../services/userServices")
const UserServicesInstance= new UserServices()

const verifyauthJwttoken=async(req,res,next)=>{
    console.log("headers",req.headers)
const token=req.headers.authorization.split(" ")[1]
console.log(token)
if(!token)
    return res.status(401).json("token is not access")
try {
    const decode= await UserServicesInstance.verifyauthJwttoken(token) 
    console.log(decode)
    req.user=decode
    console.log(req.user)
    next()   
} catch (error) {
    if (error.message === "jwt expired") return res.sendStatus(401);
    return res.sendStatus(500); 
}
  
}
module.exports=verifyauthJwttoken