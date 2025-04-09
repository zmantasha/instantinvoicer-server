const categoryService = require("../services/categoryService");

class CategoryController {
    async createCategory(req, res) {
        try {
            const category = await categoryService.createCategory(req.body);
            res.status(201).json({
                success: true,
                data: category
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async getCategoryById(req, res) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    error: "Category not found"
                });
            }
            res.status(200).json({
                success: true,
                data: category
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async getAllCategories(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            res.status(200).json({
                success: true,
                data: categories
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async getCategoryTree(req, res) {
        try {
            const categoryTree = await categoryService.getCategoryTree();
            res.status(200).json({
                success: true,
                data: categoryTree
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async updateCategory(req, res) {
        try {
            const category = await categoryService.updateCategory(req.params.id, req.body);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    error: "Category not found"
                });
            }
            res.status(200).json({
                success: true,
                data: category
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async deleteCategory(req, res) {
        try {
            const category = await categoryService.deleteCategory(req.params.id);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    error: "Category not found"
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

    async getSubcategories(req, res) {
        try {
            const subcategories = await categoryService.getSubcategories(req.params.categoryId);
            res.status(200).json({
                success: true,
                data: subcategories
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async getCategoryBreadcrumb(req, res) {
        try {
            const breadcrumb = await categoryService.getCategoryBreadcrumb(req.params.categoryId);
            res.status(200).json({
                success: true,
                data: breadcrumb
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new CategoryController(); 