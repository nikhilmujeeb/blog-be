import Post from '../model/post.js';
import Category from '../model/category.js'; // Assuming there is a Category model

export const createPost = async (request, response) => {
    try {
        const post = new Post(request.body);
        await post.save();
        response.status(200).json('Post saved successfully');
    } catch (error) {
        response.status(500).json(error);
    }
};

export const updatePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (!post) {
            return response.status(404).json({ msg: 'Post not found' });
        }
        await Post.findByIdAndUpdate(request.params.id, { $set: request.body });
        response.status(200).json('Post updated successfully');
    } catch (error) {
        response.status(500).json(error);
    }
};

export const deletePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (post) {
            await post.delete();
            response.status(200).json('Post deleted successfully');
        } else {
            response.status(404).json({ msg: 'Post not found' });
        }
    } catch (error) {
        response.status(500).json(error);
    }
};

export const getPost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        response.status(200).json(post);
    } catch (error) {
        response.status(500).json(error);
    }
};

export const getAllPosts = async (request, response) => {
    const { username, category } = request.query;
    try {
        let posts = [];
        if (username) posts = await Post.find({ username });
        else if (category) posts = await Post.find({ categories: category });
        else posts = await Post.find({});
        response.status(200).json(posts);
    } catch (error) {
        response.status(500).json(error);
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ isSuccess: true, categories });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error fetching categories' });
    }
};

export { createPost, updatePost, deletePost, getPost, getAllPosts, getAllCategories };