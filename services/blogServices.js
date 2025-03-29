const BlogModel = require("../models/blogModel")

class BlogServices{
     createBlog=async(blogData)=>{
      console.log(blogData)
      try {
      const createdBlog = new BlogModel(blogData)
      // console.log(createdBlog)
      await createdBlog.save()
      } catch (error) {
        throw error
      }
    }

     getAllBlogs=async()=>{
      try {
        console.log("hello")
        const getAllBlog = await BlogModel.find({}) 
        return getAllBlog
      } catch (error) {
        throw error
      }
    }

     getBlogsById=async(id)=>{
      try {
        const getBlogsById = await BlogModel.findById(id)
        return getBlogsById
      } catch (error) {
       throw error 
      }
    }

    deleteBlogs = async(id)=>{
      try {
        const deleteBlogs = await BlogModel.findByIdAndDelete(id)
        return deleteBlogs
      } catch (error) {
       throw error 
      }
    }
    
    updateBlog =async(id,body)=>{
      try {
        const updateBlog= await BlogModel.findByIdAndUpdate({_id:id},body,{new:true})  
        return updateBlog; 
      } catch (error) {
        throw error;  
      }
    }
}

module.exports=BlogServices