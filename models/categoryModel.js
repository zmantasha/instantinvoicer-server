const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    meta_title: {
        type: String,
        maxLength: 60
    },
    meta_description: {
        type: String,
        maxLength: 160
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel; 