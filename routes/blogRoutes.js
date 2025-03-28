const express= require("express")
const BlogController = require("../controllers/blogsController")
const verifyauthJwttoken = require("../middleware/authMiddleware")
const verifyAdmin = require("../middleware/adminMiddleware")
const router= express.Router()

router.get("/",verifyauthJwttoken,verifyAdmin,BlogController.getAllBlogs)

module.exports=router