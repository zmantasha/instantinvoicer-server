const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const verifyauthJwttoken = require("../middleware/authMiddleware")

// Create a new comment
router.post('/', verifyauthJwttoken , commentController.createComment);

// Get a specific comment by ID
router.get('/:id', commentController.getCommentById);

// Get all comments for a specific post (flat structure)
router.get('/post/:postId', commentController.getCommentsByPost);

// Get complete comment tree for a post (nested structure)
router.get('/post/:postId/tree', commentController.getCommentTree);

// Update a comment
router.put('/:id', verifyauthJwttoken , commentController.updateComment);

// Delete a comment
router.delete('/:id', verifyauthJwttoken , commentController.deleteComment);

// Get replies for a specific comment (nested)
router.get('/:commentId/replies', commentController.getReplies);

module.exports = router; 