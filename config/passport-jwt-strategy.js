const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


const UserServices=require("../services/userServices")
const UserServicesInstance= new UserServices()
const passport = require("passport")
var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:process.env.JWT_ACCESS_TOKEN_SECRET_KEY
}


passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    // console.log("jwt_payload" , jwt_payload)
    try {
      const user= await UserServicesInstance.findUserbyId(jwt_payload.userId)
    //   console.log(user)
      if (user) {
        return done(null, user);
    } else {
        return done(null, false);
        // or you could create a new account
    }  
    } catch (error) {
        return done(error, false);  
    }

}));