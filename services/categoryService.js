const CategoryModel = require("../models/categoryModel");
const slugify = require('slugify');

class CategoryService {
    async createCategory(categoryData) {
        try {
            // Generate slug from name if not provided
            if (!categoryData.slug) {
                categoryData.slug = slugify(categoryData.name, { lower: true, strict: true });
            }
            
            const category = new CategoryModel(categoryData);
            return await category.save();
        } catch (error) {
            throw error;
        }
    }

    async getCategoryById(id) {
        try {
            return await CategoryModel.findById(id)
                .populate('parent', 'name slug');
        } catch (error) {
            throw error;
        }
    }

    async getAllCategories() {
        try {
            return await CategoryModel.find()
                .populate('parent', 'name slug')
                .sort({ name: 1 });
        } catch (error) {
            throw error;
        }
    }

    async updateCategory(id, updateData) {
        try {
            // Generate new slug if name is being updated
            if (updateData.name && !updateData.slug) {
                updateData.slug = slugify(updateData.name, { lower: true, strict: true });
            }

            return await CategoryModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
        } catch (error) {
            throw error;
        }
    }

    async deleteCategory(id) {
        try {
            // Check if category has children
            const hasChildren = await CategoryModel.exists({ parent: id });
            if (hasChildren) {
                throw new Error('Cannot delete category with subcategories');
            }
            
            return await CategoryModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    // Get category tree structure
    async getCategoryTree() {
        try {
            const categories = await CategoryModel.find()
                .populate('parent', 'name slug')
                .sort({ name: 1 });

            return this.buildCategoryTree(categories);
        } catch (error) {
            throw error;
        }
    }

    // Get all subcategories of a category
    async getSubcategories(categoryId) {
        try {
            const subcategories = await CategoryModel.find({ parent: categoryId })
                .populate('parent', 'name slug')
                .sort({ name: 1 });

            // Recursively get nested subcategories
            const nestedSubcategories = await Promise.all(
                subcategories.map(async (subcategory) => {
                    const nested = await this.getSubcategories(subcategory._id);
                    return {
                        ...subcategory.toObject(),
                        subcategories: nested
                    };
                })
            );

            return nestedSubcategories;
        } catch (error) {
            throw error;
        }
    }

    // Helper method to build category tree
    buildCategoryTree(categories) {
        const categoryMap = new Map();
        const roots = [];

        // First pass: create a map of all categories
        categories.forEach(category => {
            categoryMap.set(category._id.toString(), {
                ...category.toObject(),
                subcategories: []
            });
        });

        // Second pass: build the tree structure
        categories.forEach(category => {
            const categoryWithSubcategories = categoryMap.get(category._id.toString());
            if (category.parent) {
                const parent = categoryMap.get(category.parent.toString());
                if (parent) {
                    parent.subcategories.push(categoryWithSubcategories);
                }
            } else {
                roots.push(categoryWithSubcategories);
            }
        });

        return roots;
    }

    // Get breadcrumb path for a category
    async getCategoryBreadcrumb(categoryId) {
        try {
            const breadcrumb = [];
            let currentCategory = await CategoryModel.findById(categoryId)
                .populate('parent', 'name slug');

            while (currentCategory) {
                breadcrumb.unshift({
                    name: currentCategory.name,
                    slug: currentCategory.slug
                });
                currentCategory = await CategoryModel.findById(currentCategory.parent)
                    .populate('parent', 'name slug');
            }

            return breadcrumb;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CategoryService(); 