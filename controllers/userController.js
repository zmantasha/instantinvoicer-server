const UserServices= require("../services/userServices")
const refreshAccessToken = require("../utils/refreshAccessToken")
// const UserRefreshTokenServices = require("../services/userRefreshTokenServices");
// const UserRefreshTokenServicesInstance= new UserRefreshTokenServices()
const UserServicesInstance= new UserServices()
const setTokensCookies = require("../utils/setTokenCookies");
// const uploadOnCloudinary = require("../utils/cloudinary");
const getDataUri = require("../utils/dataUri");
const cloudnary =require("cloudinary")
class UserController{
  // Registration controller
    static userRegistration=async(req,res)=>{
       try {
        // console.log(req.body)
         const user=await UserServicesInstance.userRegister(req.body)
         res.status(201).json({
            success: true,
            user,
          });
        } catch (error) {
        // Handle specific error (e.g., duplicate email)
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: `${Object.keys(error.keyPattern)[0]} already exists. Please login!`,
        });
       }
    }
}



//   Login controller
     static userLogin=async(req,res)=>{
      try {
        const {user}= req
        const {password}= req.body
        // console.log(user,password)
        const response= await  UserServicesInstance.userLogin(password,user) 
        // console.log(response)
        // console.log(response)
        if(response.isLoggedin){
        //  setTokensCookies(res,response.accessToken,response.refreshToken,response.accessTokenExp,response.refreshTokenExp)
          return (
            res.status(200).json({
             message:"loginSuccessfull",
             token:response.token,
            //  refreshToken:response.refreshToken,
            //  access_token_exp:response.accessTokenExp,
             user:response.user,
             response,
             isLoggedin:response.isLoggedin
             })
         )}
        res.status(404).send({message:"password is incorrect"}) 
      } catch (error) {
        if (error.message.includes("not found"))
          return res.status(404).send({ message: "Username could not be found" });
        res
          .status(500)
          .send({ message: "Oops! Something went wrong. Please try again!" }); 
      }
     }

   

     static getAllUsers = async (req, res) => {
      try {
          const blogs = await UserServicesInstance.getAllUsers();
          
          res.status(200).json({
              success: true,
              data: blogs
          });
      } catch (error) {
          console.error("Error fetching blogs:", error);
          res.status(500).json({
              success: false,
              message: "Error fetching blogs",
              error: error.message
          });
      }
  }

    //  Get New Access Token Or Refresh Token
    static getNewAccessToken= async(req,res)=>{
      try {
        const {newAccessToken,newRefreshToken,newAccessTokenExp,newRefreshTokenExp}= await refreshAccessToken(req,res)
       
        setTokensCookies(res,newAccessToken,newRefreshToken,newAccessTokenExp,newRefreshTokenExp)
       return  res.status(200).json({
          status:"success",
          message:"New Generate Token",
          access_token:newAccessToken,
          refresh_token:newRefreshToken,
          access_token_exp:newAccessTokenExp
        })
      } catch (error) {
        res.status(500).json({message:"unable togenerate new token please try again latter"})
      }
    }

// Profile OR Logged in User
    static userProfile=async(req,res)=>{
       res.send({"user":req.user})
    }
   

// update Profile
// static updateProfile=async(req,res)=>{
//   try {
//     const user= await UserServicesInstance.findUserbyId(req.params.id)
//     if (!user) return res.status(404).json({ message: "user not found with this given Id" });
//     const updatedUser= await UserServicesInstance.updateUser(req.params.id,req.body)
//     if (!updatedUser) return res.status(404).json({ message: "Invoice not found" });
//     res.status(200).json({updatedUser, message:"Profile updated successfully!"});
//   } catch (error) {
//    console.log(error)
//   }   
//   }
// Update Profile
static updateProfile = async (req, res) => {
  try {
    const user = await UserServicesInstance.findUserbyId(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found with the given ID." });
    }

    const { firstName, lastName,address} = req.body;
    let message = "Profile updated successfully!";
    let updatedFields = [];

    if (firstName && firstName !== user.firstName) {
      updatedFields.push(`First Name to ${firstName}`);
    }
    if (lastName && lastName !== user.lastName) {
      updatedFields.push(`Last Name to ${lastName}`);
    }
    if (address && address !== user.address) {
      updatedFields.push(`Address to ${address}`);
    }

    const updatedUser = await UserServicesInstance.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "Update failed. No changes made." });
    }

    // Custom message based on updated fields
    if (updatedFields.length > 0) {
      message = `Profile updated successfully! Updated: ${updatedFields.join(" and ")}.`;
    } else {
      message = "No changes were made to your profile.";
    }

    res.status(200).json({ updatedUser, message });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// update Profile 

static updateAvatarImage =async(req,res)=>{
  try {
    const avatarLocalPath =req.file
    if(!avatarLocalPath){
     return res.status(400).json({ message: "Avatar File is missing." });
    }
    const fileUri=getDataUri(avatarLocalPath)
    const mycloud=await cloudnary.v2.uploader.upload(fileUri.content)
    const user= await UserServicesInstance.updateAvatar(req.params.id,mycloud)
    res.status(200).json({ user }); 
  } catch (error) {
    console.log(error)
  }
   
}


// upload logo


static updateLogoImage= async(req,res)=>{
try {
  const logoLocalPath =req.file
  // console.log("logoLocalPath",logoLocalPath)
  if(!logoLocalPath){
   return res.status(400).json({ message: "logo File is missing." });
  }
  const fileUri=getDataUri(logoLocalPath)
  const mycloud=await cloudnary.v2.uploader.upload(fileUri.content)
  const user= await UserServicesInstance.updateLogo(req.params.id,mycloud)
  res.status(200).json({ user }); 
} catch (error) {
  console.log(error)
}
}
  // delete Profile

  static deleteProfile=async(req,res)=>{
    try {
    // const refreshToken=req.cookies.refreshToken;
    console.log(req.params.id)
    const user= await UserServicesInstance.findUserbyId(req.params.id)  
    if (!user) return res.status(404).json({ message: "user not found with this given Id" });
    await UserServicesInstance.deleteUser(req.params.id)
    res.status(200).json({status:"success", message:"delete user successful"})
    } catch (error) {
    if(error.message.includes("Cast to ObjectId failed"))
      return res.status(404).send("invalid id")
      res.status(500).send("oops something went wrong")   
    }
  }


// Logout
    static userlogout= async(req,res)=>{
  try {
    // const refreshToken=req.cookies.refreshToken;
    // console.log(refreshToken)
    // await UserRefreshTokenServicesInstance.findOneAndUpdate(refreshToken)
    
    // res.clearCookie('accessToken');
    // res.clearCookie('refreshToken');
    // res.clearCookie('is_auth')
    res.status(200).json({status:"success", message:"logout successful"})
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: "failed", message: "Unable to logout, please try again later" }); 
  }
}




}

module.exports = UserController;
