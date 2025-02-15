const UserRefreshTokenModel = require("../models/UserRefreshTokenModel");

class UserRefreshTokenServices{
     
    createRefreshToken=async(id,token)=>{
       try {
      const createRefreshToken = new UserRefreshTokenModel({userId: id, token:token});
      await createRefreshToken.save();
      return createRefreshToken
       } catch (error) {
         throw error
       }
    }
   
    getbyToken=async(token)=>{
      try {
        
        const getToken= await UserRefreshTokenModel.findOne({token:token})
        return getToken
      } catch (error) {
        throw error
      }
    }

    getByid=async(token)=>{
      console.log(token)
      try {
        const getbyid=await UserRefreshTokenModel.findOne({userId:token})
        console.log(getbyid)
        return getbyid
      } catch (error) {
        throw error
      }
    }


    findOneAndUpdate=async(token)=>{
      try {
        console.log("token: ", token)
        const findOneandUpdate = await UserRefreshTokenModel.findOneAndUpdate(
          { token:token }, // Ensure token is wrapped in an object to match schema
          { $set: { blacklisted: true } },
          { new: true } // Return the updated document
      );
        console.log("find one:",  findOneandUpdate )
        return findOneandUpdate
      } catch (error) {
        throw error
      }
    }
    

    findOneandDelete=async(id)=>{
        try {
            // console.log(query)
            const deleteRefreshToken = await UserRefreshTokenModel.findOneAndDelete({userId:id});
            return deleteRefreshToken;  
        } catch (error) {
          throw error  
        }
    }

}


module.exports= UserRefreshTokenServices