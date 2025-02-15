const mongoose = require("mongoose")
require("colors")
const connectDB=async (DATABASE_URL)=>{
    try {
        const DB_OPTIONS = {
          dbName: "passportjsauth"
        }
        const conn = await mongoose.connect(DATABASE_URL, DB_OPTIONS)
        console.log(`connected to mongodb  Database ${conn.connection.host}`.bgWhite.white)
      } catch (error) {
        console.log(`Error in Mongodb ${error}`.bgRed.white) 
      } 
}
module.exports= connectDB
