// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const passport = require("passport")
// const bcrypt = require('bcrypt')
// const UserServices= require("../services/userServices");
// // const generateToken = require('../utils/generateTokens');
// const userModel = require('../models/userModel');
// const UserServicesInstance= new UserServices()
// const jwt= require("jsonwebtoken")

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/auth/google/callback"
//   },
//   async(accessToken, refreshToken, profile, done) =>{
//     try {
//         let user = await UserServicesInstance.findByEmail(profile._json.email)
//         if(!user){
//             const lastSixDigitsID = profile.id.substring(profile.id.length - 6);
//             const lastTwoDigitsName = profile._json.name.substring(profile._json.name.length - 2);
//             const newPass = lastTwoDigitsName + lastSixDigitsID
//             const salt = await bcrypt.genSalt(Number(process.env.SALT));
//             const hashedPassword = await bcrypt.hash(newPass, salt);
//             console.log(profile)
//             user = await userModel.create({
//                 firstName: profile._json.name,
//                 lastName:'',
//                 email: profile._json.email,
//                 is_verified: true,
//                 password: hashedPassword,
//               })
//         }

//          // Generate JWT tokens
//           generateToken=async(payload)=>{
//                const token= await jwt.sign(payload,process.env.JWT_ACCESS_TOKEN_SECRET_KEY,{expiresIn:"1hr"});
//                return token;
//             }
//             console.log("user",user._id)
//       // const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } = await generateToken(user);
//       const { accessToken } = await generateToken({userId:user._id});
//       console.log("access",accessToken)
//       return done(null, { user, accessToken });

//     } catch (error) {
//       return done(error)  
//     }

   
//   }
// ));



const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const UserServices = require("../services/userServices");
const userModel = require('../models/userModel');

const UserServicesInstance = new UserServices();

// Generate JWT token function
const generateToken = async (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET_KEY, { expiresIn: "1hr" });
};

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `https://instantinvoicer-server.vercel.app/auth/google/callback` // Make sure this matches your Google Console setting
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if the user exists
      let user = await UserServicesInstance.findByEmail(profile._json.email);
      if (!user) {
        const lastSixDigitsID = profile.id.substring(profile.id.length - 6);
        const lastTwoDigitsName = profile._json.name.substring(profile._json.name.length - 2);
        const newPass = lastTwoDigitsName + lastSixDigitsID;
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(newPass, salt);
        
        // Create new user if not found
        user = await userModel.create({
          firstName: profile._json.name,
          lastName: '',
          email: profile._json.email,
          is_verified: true,
          password: hashedPassword,
        });
      }

      // Generate JWT token for the user
      const token = await generateToken({ userId: user._id });
      console.log("user", user._id);
      console.log("access token", token);

      // Return user info and the generated token
      return done(null, { user, token });

    } catch (error) {
      console.error("Error in Google Strategy:", error); // Log the error for debugging
      return done(error);
    }
  }
));
