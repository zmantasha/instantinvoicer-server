const BlogServices = require("../services/blogServices")
const BlogServicesInstance= new BlogServices()

class BlogController{
    static createBlogs=async (req,res)=>{
        try {

            const {id}=req.user
            console.log(id)
            // console.log(req.body)
            if (!req.user || !id) {
                return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
            }
              req.body.author = id;
            const createBlog= await BlogServicesInstance.createBlog(req.body)
            res.status(201).json({ createBlog, message: "Save blog Successfull" });
        } catch (error) {
        res.status(500).json({message:"something went wrong"}) 
        }
    }


    static getAllBlogs=async(req,res)=>{
        try {
            
          const blogs=await BlogServicesInstance.getAllBlogs()  
          console.log("hello") 
          res.status(200).json(blogs)
        } catch (error) {
            res.status(500).json({ error: error.message });
          }
    }


    static getBlogsById= async(req,res)=>{
        try {
            
           const blogs= await BlogServicesInstance.getBlogsById(req.params.id) 
           if (!blogs)
            return res
              .status(404)
              .json({ message: "blogs not found with this given Id" });
           res.status(200).json(blogs);
        } catch (error) {
            res.status(500).json({ error: error.message });   
        }
    }


    static deleteBlogs=async(req,res)=>{
        console.log(req.params.id)
        try{
        const blogs= await BlogServicesInstance.getBlogsById(req.params.id)  
        if (!blogs) return res.status(404).json({ message: "blogs not found with this given Id" });
        await BlogServicesInstance.deleteBlogs(req.params.id)
        res.status(200).json({status:"success", message:"delete user successful"})
        } catch (error) {
        if(error.message.includes("Cast to ObjectId failed"))
          return res.status(404).send("invalid id")
          res.status(500).send("oops something went wrong")   
        }

    }


    static updateBlogs=async(req,res)=>{
        try {
            const blogs= await BlogServicesInstance.getBlogsById(req.params.id)  
            if (!blogs) return res.status(404).json({ message: "blogs not found with this given Id" });
            const {id}=req.user
            console.log(id)
            // console.log(req.body)
            if (!req.user || !id) {
                return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
            }
              req.body.author = id;
            //   req.body.author = req.user;
              const updateBlog = await BlogServicesInstance.updateBlog(req.params.id,req.body);
              if(!updateBlog){
                  return res.status(404).json({message:"Update failed. No change made."});
              } 
              res.status(200).json({updateBlog,  message:"update customer successfull"});
              
        } catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).json({ message: "Internal server error." });
          }
    }


}
module.exports=BlogController