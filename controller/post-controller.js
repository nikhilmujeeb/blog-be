import mongoose from 'mongoose';
import Post from '../model/post.js';

// Create a new post
export const createPost = async (req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.status(201).json({ isSuccess: true, message: 'Post saved successfully', post });
    } catch (error) {
        console.error("Error saving post:", error);
        res.status(500).json({ isSuccess: false, message: 'Error saving post' });
    }
}

// Update an existing post
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params; // Use 'id' from the route parameters
        if (!mongoose.isValidObjectId(id)) {
            console.error("Invalid ObjectId:", id);
            return res.status(400).json({ isSuccess: false, message: 'Invalid post ID' });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ isSuccess: false, message: 'Post not found' });
        }

        // Update the post and return the updated post
        const updatedPost = await Post.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        res.status(200).json({ isSuccess: true, message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ isSuccess: false, message: 'Error updating post' });
    }
}

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params; // Use 'id' from the route parameters
        if (!mongoose.isValidObjectId(id)) {
            console.error("Invalid ObjectId:", id);
            return res.status(400).json({ isSuccess: false, message: 'Invalid post ID' });
        }

        const result = await Post.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ isSuccess: false, message: "Post not found" });
        }
        res.status(200).json({ isSuccess: true, message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ isSuccess: false, message: "Failed to delete post" });
    }
};

// Get a single post by ID
export const getPost = async (req, res) => {
    try {
        const { id } = req.params; // Use 'id' from the route parameters
        console.log('Received ID:', id); // Log the ID for debugging

        // Check if the received ID is a valid ObjectId
        if (!mongoose.isValidObjectId(id)) {
            console.error("Invalid ObjectId:", id);
            return res.status(400).json({ isSuccess: false, message: 'Invalid post ID' });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ isSuccess: false, message: 'Post not found' });
        }
        res.status(200).json({ isSuccess: true, post });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ isSuccess: false, message: 'Error fetching post' });
    }
}

// Get all posts with optional filtering
export const getAllPosts = async (req, res) => {
    const { username, category } = req.query; 
    try {
        const query = {};
        if (username) query.username = username;
        if (category) {
            query.categories = { $in: [category] };
        }

        const posts = await Post.find(query);
        res.status(200).json({ isSuccess: true, posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ isSuccess: false, message: 'Error fetching posts' });
    }
};
