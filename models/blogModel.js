const mongoose = require("mongoose")
const blogSchema=new mongoose.Schema({
    blog_id:{
        type:String,
        require:true,
        unique:true,
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    meta_title: {
        type: String,
        maxLength: 60,
        trim: true
    },
    meta_description: {
        type: String,
        maxLength: 160,
        trim: true
    },
    title:{
        type:String,
        require:true,
        trim: true
    },
    banner:{
        type:String,
        trim: true
    },
    description:{
        type:String,
        trim: true
    },
    content:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    tags:[{
        type: String,
        trim: true
    }],
    author:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user",
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    featured: {
        type: Boolean,
        default: false
    },
    activity:{
        total_likes:{
            type:Number,
            default:0
        },
        total_comments:{
            type:Number,
            default:0
        },
        total_reads:{
            type:Number,
            default:0  
        },
        total_parent_comments:{
            type:Number,
            default:0
        }
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "comments"   
    }],
    publishedAt: {
        type: Date
    }
},{
    timestamps: true
})

// Index for better query performance
blogSchema.index({ title: 'text', description: 'text', content: 'text' });
// blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ author: 1 });

const BlogModel = mongoose.model("Blog", blogSchema);

module.exports = BlogModel;