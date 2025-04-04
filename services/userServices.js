const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
// const generateToken = require("../utils/generateTokens");
const jwt= require("jsonwebtoken")
class UserServices{
// Registration Service
   userRegister =async(body)=>{
    try {
        // Hash the Password
        const hashedPassword = await this.hashPassword(body.password);

        // Save New User
        const newUser = new userModel({ ...body, password: hashedPassword });
        await newUser.save();

        // Return Newly Created User (Avoid returning sensitive info)
        const { password, ...userWithoutPassword } = newUser._doc;
        return userWithoutPassword;
    } catch (error) {
        throw error;
    }
};

// Password Hashing Function
hashPassword = async (password) => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}; 
   
// Verify Password
verifyPassword=async(password,hashedPassword)=>{
    return await bcrypt.compare(password,hashedPassword)
}

// Login Services
   userLogin =async(password,reqUser)=>{
    try {
      if(await this.verifyPassword(password,reqUser.password)){
      //   const {accessToken,refreshToken,accessTokenExp,refreshTokenExp} = await generateToken(reqUser)
        return {
          user:{reqUser},
          isLoggedin:true,
          token: await this.generateToken({userId: reqUser._id})
         //  accessToken:accessToken,
         //  refreshToken:refreshToken,
         //  accessTokenExp:accessTokenExp,
         //  refreshTokenExp:refreshTokenExp
        }
       }
       return {
       isLoggedin: false,
       }
    } catch (error) {
        throw error; 
    }
   }
   generateToken=async(payload)=>{
      const token= await jwt.sign(payload,process.env.JWT_ACCESS_TOKEN_SECRET_KEY,{expiresIn:"5hr"});
      return token;
   }

   verifyauthJwttoken=async(token)=>await jwt.verify(token,process.env.JWT_ACCESS_TOKEN_SECRET_KEY) 

//    generateToken=async(payload)=>{
//     const token= await jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1hr"});
//     return token;
//  }


// find user by email
   findByEmail=async(email)=>{
       try {
        const existingEmail= await userModel.findOne({email});
        return existingEmail
       } catch (error) {
        throw error
       }
   } 

// find user by id
   findUserbyId=async(id)=>{
      try {  
         // console.log("id",id)
        const userid= await userModel.findOne({_id:id}).select('-password') 
        return userid
      } catch (error) {
        throw error
      }
   }


  //  update user by id
  updateUser=async(id,body)=>{
    try {
       const updateUser= await userModel.findByIdAndUpdate({_id:id},body,{new:true})
       return updateUser
    } catch (error) {
      throw error
    }
  }

//   get All Users
getAllUsers =async(req,res)=>{
try {
  const getAllUsers = await userModel.find({})  
  return getAllUsers
} catch (error) {
  throw error 
}
}

//   update Avatar
updateAvatar=async(id,mycloud)=>{
try {
   const updateUser= await userModel.findByIdAndUpdate({_id:id},{avatar:mycloud.secure_url},{new:true})
       return updateUser 
} catch (error) {
   throw error
}
}
updateLogo=async(id,mycloud)=>{
   try{
   const updateUser= await userModel.findByIdAndUpdate({_id:id},{logo:mycloud.secure_url},{new:true})
   return updateUser 
} catch (error) {
throw error
}
}

  // delete user by id
  deleteUser=async(id)=>{
     try{
        const deleteUser=await userModel.findByIdAndDelete(id)
        return deleteUser
     }catch(error){
      throw error
     }
  }
}
module.exports= UserServices
