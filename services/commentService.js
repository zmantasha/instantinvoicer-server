const CommentModel = require("../models/commentModel");

class CommentService {
    async createComment(commentData) {
        try {
            const comment = new CommentModel(commentData);
            return await comment.save();
        } catch (error) {
            throw error;
        }
    }

    async getCommentById(id) {
        try {
            return await CommentModel.findById(id)
                .populate('user', 'name email')
                .populate('post', 'title');
        } catch (error) {
            throw error;
        }
    }

    async getCommentsByPost(postId) {
        try {
            // Get all comments for the post
            const comments = await CommentModel.find({ post: postId })
                .populate('user', 'name email')
                .populate('post', 'title')
                .sort({ createdAt: 1 });

            // Build comment tree
            return this.buildCommentTree(comments);
        } catch (error) {
            throw error;
        }
    }

    async updateComment(id, updateData) {
        try {
            return await CommentModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
        } catch (error) {
            throw error;
        }
    }

    async deleteComment(id) {
        try {
            // First, get all child comments
            const childComments = await CommentModel.find({ parent: id });
            
            // Recursively delete all child comments
            for (const child of childComments) {
                await this.deleteComment(child._id);
            }
            
            // Finally, delete the parent comment
            return await CommentModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    async getReplies(commentId) {
        try {
            const replies = await CommentModel.find({ parent: commentId })
                .populate('user', 'name email')
                .sort({ createdAt: 1 });
            
            // Recursively get nested replies
            const nestedReplies = await Promise.all(
                replies.map(async (reply) => {
                    const nested = await this.getReplies(reply._id);
                    return {
                        ...reply.toObject(),
                        replies: nested
                    };
                })
            );

            return nestedReplies;
        } catch (error) {
            throw error;
        }
    }

    // Helper method to build comment tree
    buildCommentTree(comments) {
        const commentMap = new Map();
        const roots = [];

        // First pass: create a map of all comments
        comments.forEach(comment => {
            commentMap.set(comment._id.toString(), {
                ...comment.toObject(),
                replies: []
            });
        });

        // Second pass: build the tree structure
        comments.forEach(comment => {
            const commentWithReplies = commentMap.get(comment._id.toString());
            if (comment.parent) {
                const parent = commentMap.get(comment.parent.toString());
                if (parent) {
                    parent.replies.push(commentWithReplies);
                }
            } else {
                roots.push(commentWithReplies);
            }
        });

        return roots;
    }

    // Get complete comment tree for a post
    async getCommentTree(postId) {
        try {
            const comments = await CommentModel.find({ post: postId })
                .populate('user', 'name email')
                .populate('post', 'title')
                .sort({ createdAt: 1 });

            return this.buildCommentTree(comments);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CommentService(); 