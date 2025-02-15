const express = require("express")
const dotenv= require("dotenv")
dotenv.config()
require("colors")
const userRoutes=require("./routes/userRoutes")
const invoiceRoutes = require("./routes/invoiceRoutes");
const connectDB = require("./config/connectDb");
const cookieParser = require("cookie-parser");
const cors= require("cors")
const passport= require("passport")
const cloudnary =require("cloudinary")
// const setTokensCookies = require("./utils/setTokenCookies")
// const upload = require("./middleware/FileUploder")
require("./config/passport-jwt-strategy")
require("./config/google-strategy")

const app= express()
const PORT= process.env.PORT|| 8002
const DATABASE_URL = process.env.DATABASE_URL

// Solve cors policy Error
// const corsOptions={
//     // set origin to a specific origin
//     origin:process.env.FRONTEND_HOST,
//     credentials:true,
//     optionsSuccessStatus:200,
// }

const corsOptions = {
  origin: (origin, callback) => {
      const allowedOrigins = [`${process.env.FRONTEND_HOST}`, `${process.env.FRONTEND_SERVER_HOST}`];
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
          callback(new Error('Not allowed by CORS'));
      }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};
 app.use(cors(corsOptions))

// app.use(cors({
//   origin: ['http://localhost:3000'],
//   credentials:true,
// }))


// Database Connection
connectDB(DATABASE_URL)

// Middleware to parse JSON request bodies
app.use(express.json());

// Passport Middleware
app.use(passport.initialize());

// Cookie Parser
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
//cloudnary
cloudnary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
// routes
app.get('/', (req, res) => {
    res.send('products api running new deploy');
});
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/invoice", invoiceRoutes)
// Google Auth Routes
app.get('/auth/google',
    passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));

     app.get('/auth/google/callback', 
      passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_HOST}/account/login` }),
      (req, res) => {
          if (!req.user || !req.user.token) {
              return res.redirect(`${process.env.FRONTEND_HOST}/account/login?error=NoToken`);
          }
  
          const { token } = req.user;
  
          // Redirect frontend with token in query params
          res.redirect(`${process.env.FRONTEND_HOST}/google/callback?token=${token}`);
          // res.redirect(`${process.env.FRONTEND_HOST}/google/callback`);
      }
  );
  // app.get('/auth/google/callback', 
  //   passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_HOST}/account/login`}),
  //   (req, res)=> {
  //       const { user, accessToken, refreshToken, accessTokenExp, refreshTokenExp } = req.user; 
  //       console.log(accessToken)
  //       setTokensCookies(res, accessToken, refreshToken, accessTokenExp, refreshTokenExp)
  //     // Successful authentication, redirect home.
  //     res.redirect(`${process.env.FRONTEND_HOST}/user/myinvoice`);
  //   });
  

app.listen(PORT, ()=>{
    console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white)
})
