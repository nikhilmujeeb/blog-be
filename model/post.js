import mongoose from 'mongoose';

// Define the Post Schema
const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    categories: {
        type: [String], 
        required: false,
        default: [] 
    },
    createdDate: {
        type: Date,
        default: Date.now 
    }
}, { timestamps: true }); 

const Post = mongoose.model('Post', PostSchema);

export default Post;
