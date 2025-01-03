import Post from '../model/post.js';
import mongoose from 'mongoose';

export const createPost = async (request, response) => {
    try {
        const post = new Post(request.body);
        await post.save();
        response.status(200).json('Post saved successfully');
    } catch (error) {
        console.error('Error creating post:', error.message);
        response.status(500).json({ msg: 'Internal Server Error', error });
    }
};

export const updatePost = async (request, response) => {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).json({ msg: 'Invalid ObjectId' });
    }

    try {
        const post = await Post.findById(id);
        if (!post) return response.status(404).json({ msg: 'Post not found' });

        const updatedPost = {
            ...post.toObject(),
            ...request.body,
        };

        await Post.findByIdAndUpdate(id, { $set: updatedPost }, { new: true });
        response.status(200).json('Post updated successfully');
    } catch (error) {
        console.error('Error updating post:', error.message);
        response.status(500).json({ msg: 'Internal Server Error', error });
    }
};

export const deletePost = async (request, response) => {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).json({ msg: 'Invalid ObjectId' });
    }

    try {
        const post = await Post.findById(id);
        if (!post) return response.status(404).json({ msg: 'Post not found' });

        await post.deleteOne();
        response.status(200).json({ msg: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error.message);
        response.status(500).json({ msg: 'Internal Server Error', error });
    }
};

export const getPost = async (request, response) => {
    const { id } = request.params;
    console.log('Received ID for post retrieval:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).json({ msg: 'Invalid ObjectId' });
    }

    try {
        const post = await Post.findById(id);
        if (!post) return response.status(404).json({ msg: 'Post not found' });

        response.status(200).json(post);
    } catch (error) {
        console.error('Error retrieving post:', error.message);
        response.status(500).json({ msg: 'Internal Server Error', error });
    }
};

export const getAllPosts = async (request, response) => {
    const username = request.query.username;
    const category = request.query.category;
    let posts;

    try {
        const filter = {};
        if (username) {
            filter.username = username; 
        }
        if (category) {
            filter.categories = category; 
        }

        posts = await Post.find(filter);

        response.status(200).json(posts);
    } catch (error) {
        console.error('Error retrieving posts:', error.message);
        response.status(500).json({ msg: 'Internal Server Error', error });
    }
};
