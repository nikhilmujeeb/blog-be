import Post from '../model/post.js';

// Create a new post
export const createPost = async (request, response) => {
    try {
        const post = new Post(request.body);
        await post.save();
        response.status(201).json({ isSuccess: true, message: 'Post saved successfully', post });
    } catch (error) {
        console.error("Error saving post:", error);
        response.status(500).json({ isSuccess: false, message: 'Error saving post' });
    }
}

// Update an existing post
export const updatePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (!post) {
            return response.status(404).json({ isSuccess: false, message: 'Post not found' });
        }

        await Post.findByIdAndUpdate(request.params.id, { $set: request.body }, { new: true });
        response.status(200).json({ isSuccess: true, message: 'Post updated successfully', post });
    } catch (error) {
        console.error("Error updating post:", error);
        response.status(500).json({ isSuccess: false, message: 'Error updating post' });
    }
}

// Delete a post
export const deletePost = async (request, response) => {
    try {
        const postId = request.params.id;
        const result = await Post.findByIdAndDelete(postId);
        if (!result) {
            return response.status(404).json({ isSuccess: false, message: "Post not found" });
        }
        response.status(200).json({ isSuccess: true, message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        response.status(500).json({ isSuccess: false, message: "Failed to delete post" });
    }
};

// Get a single post by ID
export const getPost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (!post) {
            return response.status(404).json({ isSuccess: false, message: 'Post not found' });
        }
        response.status(200).json({ isSuccess: true, post });
    } catch (error) {
        console.error("Error fetching post:", error);
        response.status(500).json({ isSuccess: false, message: 'Error fetching post' });
    }
}

// Get all posts or filter by username or category
export const getAllPosts = async (request, response) => {
    const { username, category } = request.query;
    try {
        const query = {};
        if (username) query.username = username;
        if (category) query.categories = category;

        const posts = await Post.find(query);
        response.status(200).json({ isSuccess: true, posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        response.status(500).json({ isSuccess: false, message: 'Error fetching posts' });
    }
}
