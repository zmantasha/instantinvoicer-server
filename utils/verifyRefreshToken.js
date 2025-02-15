const jwt = require("jsonwebtoken")
const UserRefreshTokenServices = require("../services/userRefreshTokenServices")
const UserRefreshTokenServicesInstance= new UserRefreshTokenServices()
const verifyRefreshToken=async(refreshToken)=>{
  try {
    const privateKey= process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
    // Find the refresh token deocument
    const userRefreshToken= await  UserRefreshTokenServicesInstance.getbyToken(refreshToken)

    // if refresh token not found , reject with an error
    if(!userRefreshToken){
      throw {error:true, message:"Invalid refresh token"}
    }
    // verify the refresh token
    const tokenDetails= jwt.verify(refreshToken,privateKey)
   
    // if verification successful , reslove with token details
    return{
      tokenDetails,
      error:false,
      message:"valid refresh token"
    }
    
  } catch (error) {
    // If any error occurs during verification or token not found, reject with an error
    throw { error: true, message: "Invalid refresh token" }; 
  }
}

module.exports= verifyRefreshToken