const express= require("express")
const BlogController = require("../controllers/blogsController")
const verifyauthJwttoken = require("../middleware/authMiddleware")
const verifyAdmin = require("../middleware/adminMiddleware")
const UserMiddleware = require("../middleware/userMiddleware")
const router= express.Router()

router.post("/create",verifyauthJwttoken, UserMiddleware.fetchUserIdInCollection,verifyAdmin,BlogController.createBlogs)
router.get("/", BlogController.getAllBlogs)
router.get("/:id", BlogController.getBlogsById)
router.get("/slug/:id", BlogController.getBlogsBySlug)
router.delete("/:id",verifyauthJwttoken, UserMiddleware.fetchUserIdInCollection,verifyAdmin,BlogController.deleteBlogs)
router.put("/:id",verifyauthJwttoken, UserMiddleware.fetchUserIdInCollection,verifyAdmin,BlogController.updateBlogs)
module.exports=router