const jwt = require("jsonwebtoken");
const UserRefreshTokenServices = require("../services/userRefreshTokenServices")
const UserRefreshTokenServicesInstance= new UserRefreshTokenServices()
const generateToken=async(user)=>{
  try {
    const payload={_id:user._id}
    // console.log(payload)
    //  Generate acccess token with expiration time
    const accessTokenExp = Math.floor(Date.now()/1000)+100 // Set expiration to 100 secs from now
    const accessToken = jwt.sign(
        {...payload, exp:accessTokenExp},
        process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
        // {expiresIn:'10s'}
    )

    //  Generate refresh token with expiration time
    const refreshTokenExp=Math.floor(Date.now()/1000) + 60 * 60 * 24 * 5;  // Set expiration to 5 days from now
    const refreshToken=jwt.sign(
        {...payload,exp:refreshTokenExp},
        process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
        // {expiresIn:'5d}
    ) 
    
    // delete Refreshtoken if exist
    await UserRefreshTokenServicesInstance.findOneandDelete(user._id);
     
    //  save new Refresh Token
    await UserRefreshTokenServicesInstance.createRefreshToken(user._id,refreshToken)

    return Promise.resolve({accessToken,refreshToken,accessTokenExp,refreshTokenExp})  
  } catch (error) {
   return Promise.reject(error); 
  }
}

module.exports= generateToken;