const BlogServices = require("../services/blogServices")
const BlogServicesInstance = new BlogServices()

class BlogController {
    static createBlogs = async (req, res) => {
        try {
            const { id } = req.user;
            
            if (!req.user || !id) {
                return res.status(401).json({ 
                    success: false,
                    message: "Unauthorized: Invalid or missing token" 
                });
            }

            // Validate required fields
            const { title, slug, blog_id, content } = req.body;
            if (!title || !slug || !blog_id || !content) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields: title, slug, blog_id, and content are required"
                });
            }

            // Add author and set default values
            req.body.author = id;
            req.body.activity = {
                total_likes: 0,
                total_comments: 0,
                total_reads: 0,
                total_parent_comments: 0
            };

            const createBlog = await BlogServicesInstance.createBlog(req.body);
            
            res.status(201).json({
                success: true,
                data: createBlog,
                message: "Blog created successfully"
            });
        } catch (error) {
            console.error("Error creating blog:", error);
            res.status(error.message.includes("already exists") ? 409 : 500).json({
                success: false,
                message: error.message || "Something went wrong while creating the blog"
            });
        }
    }

    static getAllBlogs = async (req, res) => {
        try {
            const blogs = await BlogServicesInstance.getAllBlogs(req.query);
            
            res.status(200).json({
                success: true,
                data: blogs
            });
        } catch (error) {
            console.error("Error fetching blogs:", error);
            res.status(500).json({
                success: false,
                message: "Error fetching blogs",
                error: error.message
            });
        }
    }

    static getBlogsById = async (req, res) => {
        try {
            const blog = await BlogServicesInstance.getBlogsById(req.params.id);
            
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found with the given ID"
                });
            }

            res.status(200).json({
                success: true,
                data: blog
            });
        } catch (error) {
            console.error("Error fetching blog:", error);
            if (error.message.includes("Invalid blog ID format")) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid blog ID format"
                });
            }
            res.status(500).json({
                success: false,
                message: "Error fetching blog",
                error: error.message
            });
        }
    }

    static deleteBlogs = async (req, res) => {
        try {
            const blog = await BlogServicesInstance.getBlogsById(req.params.id);
            
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found with the given ID"
                });
            }

            // Check if user is the author
            if (blog.author.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to delete this blog"
                });
            }

            await BlogServicesInstance.deleteBlogs(req.params.id);
            
            res.status(200).json({
                success: true,
                message: "Blog deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting blog:", error);
            if (error.message.includes("Invalid blog ID format")) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid blog ID format"
                });
            }
            res.status(500).json({
                success: false,
                message: "Error deleting blog",
                error: error.message
            });
        }
    }

    static updateBlogs = async (req, res) => {
        try {
            const blog = await BlogServicesInstance.getBlogsById(req.params.id);
            
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found with the given ID"
                });
            }

            // Check if user is the author
            if (blog.author.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to update this blog"
                });
            }

            const updateBlog = await BlogServicesInstance.updateBlog(req.params.id, req.body);
            
            if (!updateBlog) {
                return res.status(404).json({
                    success: false,
                    message: "Update failed. Blog not found."
                });
            }

            res.status(200).json({
                success: true,
                data: updateBlog,
                message: "Blog updated successfully"
            });
        } catch (error) {
            console.error("Error updating blog:", error);
            if (error.message.includes("Invalid blog ID format")) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid blog ID format"
                });
            }
            if (error.message.includes("already exists")) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: "Error updating blog",
                error: error.message
            });
        }
    }
}

module.exports = BlogController;