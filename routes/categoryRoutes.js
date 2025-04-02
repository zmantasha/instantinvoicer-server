const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const verifyauthJwttoken = require("../middleware/authMiddleware")

// Create a new category
router.post('/', verifyauthJwttoken, categoryController.createCategory);

// Get all categories (flat structure)
router.get('/', categoryController.getAllCategories);

// Get category tree structure
router.get('/tree', categoryController.getCategoryTree);

// Get a specific category by ID
router.get('/:id', categoryController.getCategoryById);

// Get breadcrumb path for a category
router.get('/:categoryId/breadcrumb', categoryController.getCategoryBreadcrumb);

// Get all subcategories of a category
router.get('/:categoryId/subcategories', categoryController.getSubcategories);

// Update a category
router.put('/:id', verifyauthJwttoken, categoryController.updateCategory);

// Delete a category
router.delete('/:id', verifyauthJwttoken, categoryController.deleteCategory);

module.exports = router; 