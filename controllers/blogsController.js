class BlogController{
    static getAllBlogs=(req,res)=>{
        try {
            res.send("blogs")
        } catch (error) {
        res.status(500).json({mesaage:"something went wrong"}) 
        }
    }
}
module.exports=BlogController