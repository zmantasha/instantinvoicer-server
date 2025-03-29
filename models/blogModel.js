
const mongoose = require("mongoose")
const blogSchema=new mongoose.Schema({
    blog_id:{
        type:String,
        require:true,
        unique:true,

    },
    title:{
        type:String,
        require:true
    },
    banner:{
        type:String
    },
    description:{
        type:String
    },
    content:{
        type:[]
    },
    tags:{
        type:[String]
    },
    author:{
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user" 
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
    comments:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "comments"   
    },
    draft:{
        type:Boolean, 
         default:false 
    }
},{timestamps:true})
const BlogModel = mongoose.model("Blog", blogSchema);

module.exports = BlogModel;