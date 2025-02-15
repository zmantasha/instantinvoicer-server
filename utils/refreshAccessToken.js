const verifyRefreshToken = require("./verifyRefreshToken");
const UserServices=require("../services/userServices")
const UserServicesInstance= new UserServices()
const UserRefreshTokenServices = require("../services/userRefreshTokenServices");
const generateToken = require("./generateTokens");
const UserRefreshTokenServicesInstance= new UserRefreshTokenServices()

const refreshAccessToken=async(req,res)=>{
 try {
   const oldRefreshToken = req.cookies.refreshToken;
   console.log("old",oldRefreshToken)
  //verify Refesh Token is valid or not
  const {tokenDetails,error}=await verifyRefreshToken(oldRefreshToken) 
  if(error){
    return res.status(401).send({status:"faild",message:"Invalid refresh token"});
  }  

//   find user based on refresh token details id
const user = await  UserServicesInstance.findUserbyId(tokenDetails._id)
console.log(user)
if(!user){
  return res.status(404).json({status:"failed", message:"User not found"});
}

console.log(tokenDetails._id)
const userRefreshToken= await UserRefreshTokenServicesInstance.getByid( tokenDetails._id  )
// console.log(userRefreshToken)
// console.log(userRefreshToken.token)
// console.log(oldRefreshToken)
if(oldRefreshToken !== userRefreshToken.token){
  return res.status(401).json({message:"Unauthorized access"})
}
console.log(oldRefreshToken)
console.log("hello:",user)
// Generate new access and refresh token
const {accessToken,refreshToken,accessTokenExp,refreshTokenExp} = await generateToken(user)

// console.log("access:",refreshToken)
return {
  newAccessToken:accessToken,
  newRefreshToken:refreshToken,
  newAccessTokenExp:accessTokenExp,
  newRefreshTokenExp:refreshTokenExp
};

 } catch (error) {
  res.status(500).json({status:"failed",message:"Internal server error"})
 }   
}
module.exports=refreshAccessToken