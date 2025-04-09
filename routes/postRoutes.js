const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Create a new post
router.post('/', postController.createPost);

// Get all posts
router.get('/', postController.getAllPosts);

// Get a single post by ID
router.get('/:id', postController.getPostById);

// Update a post
router.put('/:id', postController.updatePost);

// Delete a post (soft delete)
router.delete('/:id', postController.deletePost);

module.exports = router; 