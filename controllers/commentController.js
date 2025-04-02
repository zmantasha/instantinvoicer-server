const commentService = require("../services/commentService");

class CommentController {
    async createComment(req, res) {
        try {
            const comment = await commentService.createComment(req.body);
            res.status(201).json({
                success: true,
                data: comment
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async getCommentById(req, res) {
        try {
            const comment = await commentService.getCommentById(req.params.id);
            if (!comment) {
                return res.status(404).json({
                    success: false,
                    error: "Comment not found"
                });
            }
            res.status(200).json({
                success: true,
                data: comment
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async getCommentsByPost(req, res) {
        try {
            const comments = await commentService.getCommentsByPost(req.params.postId);
            res.status(200).json({
                success: true,
                data: comments
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async getCommentTree(req, res) {
        try {
            const commentTree = await commentService.getCommentTree(req.params.postId);
            res.status(200).json({
                success: true,
                data: commentTree
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async updateComment(req, res) {
        try {
            const comment = await commentService.updateComment(req.params.id, req.body);
            if (!comment) {
                return res.status(404).json({
                    success: false,
                    error: "Comment not found"
                });
            }
            res.status(200).json({
                success: true,
                data: comment
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async deleteComment(req, res) {
        try {
            const comment = await commentService.deleteComment(req.params.id);
            if (!comment) {
                return res.status(404).json({
                    success: false,
                    error: "Comment not found"
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

    async getReplies(req, res) {
        try {
            const replies = await commentService.getReplies(req.params.commentId);
            res.status(200).json({
                success: true,
                data: replies
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new CommentController(); 