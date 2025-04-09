const PostModel = require('../models/postModel');

class PostService {
    async createPost(postData) {
        try {
            const post = new PostModel(postData);
            return await post.save();
        } catch (error) {
            throw error;
        }
    }

    async getAllPosts() {
        try {
            return await PostModel.find({ is_active: true })
                .populate('user', 'name email')
                .sort({ createdAt: -1 });
        } catch (error) {
            throw error;
        }
    }

    async getPostById(postId) {
        try {
            return await PostModel.findOne({ _id: postId, is_active: true })
                .populate('user', 'name email');
        } catch (error) {
            throw error;
        }
    }

    async updatePost(postId, updateData) {
        try {
            return await PostModel.findByIdAndUpdate(
                postId,
                { $set: updateData },
                { new: true, runValidators: true }
            );
        } catch (error) {
            throw error;
        }
    }

    async deletePost(postId) {
        try {
            return await PostModel.findByIdAndUpdate(
                postId,
                { is_active: false },
                { new: true }
            );
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new PostService(); 