const postService = require('../services/postService');

class PostController {
    async createPost(req, res) {
        try {
            const post = await postService.createPost(req.body);
            res.status(201).json({
                success: true,
                data: post
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async getAllPosts(req, res) {
        try {
            const posts = await postService.getAllPosts();
            res.status(200).json({
                success: true,
                data: posts
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async getPostById(req, res) {
        try {
            const post = await postService.getPostById(req.params.id);
            if (!post) {
                return res.status(404).json({
                    success: false,
                    error: 'Post not found'
                });
            }
            res.status(200).json({
                success: true,
                data: post
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async updatePost(req, res) {
        try {
            const post = await postService.updatePost(req.params.id, req.body);
            if (!post) {
                return res.status(404).json({
                    success: false,
                    error: 'Post not found'
                });
            }
            res.status(200).json({
                success: true,
                data: post
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async deletePost(req, res) {
        try {
            const post = await postService.deletePost(req.params.id);
            if (!post) {
                return res.status(404).json({
                    success: false,
                    error: 'Post not found'
                });
            }
            res.status(200).json({
                success: true,
                data: {}
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new PostController(); 