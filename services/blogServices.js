const BlogModel = require("../models/blogModel")
const mongoose = require("mongoose")

class BlogServices {
    createBlog = async(blogData) => {
        try {
            // Validate required fields
            if (!blogData.title || !blogData.slug || !blogData.blog_id) {
                throw new Error("Missing required fields: title, slug, and blog_id are required");
            }

            // Check if blog_id or slug already exists
            const existingBlog = await BlogModel.findOne({
                $or: [{ blog_id: blogData.blog_id }, { slug: blogData.slug }]
            });
            if (existingBlog) {
                throw new Error("Blog with this ID or slug already exists");
            }

            const createdBlog = new BlogModel(blogData);
            await createdBlog.save();
            return createdBlog;
        } catch (error) {
            throw error;
        }
    }

    getAllBlogs = async(query = {}) => {
        try {
            const {
                page = 1,
                limit = 10,
                category,
                author,
                draft,
                sort = "-createdAt"
            } = query;

            const filter = {};
            if (category) filter.category = category;
            if (author) filter.author = author;
            if (draft !== undefined) filter.draft = draft;

            const blogs = await BlogModel.find(filter)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("author", "_id firstName lastName email")
                .populate("category", "name");

            const total = await BlogModel.countDocuments(filter);

            return {
                blogs,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw error;
        }
    }

    getBlogsById = async(id) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid blog ID format");
            }

            const blog = await BlogModel.findById(id)
                .populate("author", "_id firstName lastName email")
                .populate("category", "name")
                // .populate("comments");

            if (!blog) {
                throw new Error("Blog not found");
            }

            // Increment total reads
            blog.activity.total_reads += 1;
            await blog.save();

            return blog;
        } catch (error) {
            throw error;
        }
    }
    getBlogsBySlug = async(id) => {
        try {
           

            const blog = await BlogModel.findOne({slug:id})
                .populate("author", "_id firstName lastName email")
                .populate("category", "name")
                // .populate("comments");

            if (!blog) {
                throw new Error("Blog not found");
            }

            // Increment total reads
            blog.activity.total_reads += 1;
            await blog.save();

            return blog;
        } catch (error) {
            throw error;
        }
    }

    deleteBlogs = async(id) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid blog ID format");
            }
            console.log(id)

            const deletedBlog = await BlogModel.findByIdAndDelete(id);
            if (!deletedBlog) {
                throw new Error("Blog not found");
            }
            return deletedBlog;
        } catch (error) {
            throw error;
        }
    }
    
    updateBlog = async(id, body) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid blog ID format");
            }

            // Prepare update data
            const updateData = {};
            
            // Add all fields that are present in the body
            Object.keys(body).forEach(key => {
                if (body[key] !== undefined && body[key] !== null) {
                    if (key === 'tags' || key === 'schema') {
                        try {
                            // Check if the value is already an object
                            if (typeof body[key] === 'object') {
                                updateData[key] = body[key];
                            } else {
                                // Try to parse if it's a string
                                updateData[key] = JSON.parse(body[key]);
                            }
                        } catch (e) {
                            console.error(`Error parsing ${key}:`, e);
                            // If parsing fails, use the original value
                            updateData[key] = body[key];
                        }
                    } else {
                        updateData[key] = body[key];
                    }
                }
            });

            // Update the blog with all fields
            const updatedBlog = await BlogModel.findByIdAndUpdate(
                id,
                { $set: updateData },
                { 
                    new: true,
                    runValidators: true,
                    context: 'query'
                }
            )
            .populate("author", "_id firstName lastName email")
            .populate("category", "name");

            if (!updatedBlog) {
                throw new Error("Blog not found");
            }

            return updatedBlog;
        } catch (error) {
            console.error("Error in updateBlog service:", error);
            throw error;
        }
    }

    // Additional helper methods
    updateBlogActivity = async(id, activityType) => {
        try {
            const updateField = `activity.total_${activityType}`;
            const blog = await BlogModel.findByIdAndUpdate(
                id,
                { $inc: { [updateField]: 1 } },
                { new: true }
            );
            return blog;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BlogServices;