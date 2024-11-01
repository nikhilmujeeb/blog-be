import Post from '../model/post.js';

export const createPost = async (request, response) => {
    try {
        const post = await new Post(request.body);
        await post.save(); // Ensure to await this operation

        response.status(200).json('Post saved successfully');
    } catch (error) {
        console.error('Error creating post:', error.message); // Logging the error
        response.status(500).json({ msg: 'Internal Server Error', error });
    }
}

export const updatePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (!post) return response.status(404).json({ msg: 'Post not found' });

        await Post.findByIdAndUpdate(request.params.id, { $set: request.body });
        response.status(200).json('Post updated successfully');
    } catch (error) {
        console.error('Error updating post:', error.message); // Logging the error
        response.status(500).json({ msg: 'Internal Server Error', error });
    }
}

export const deletePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (!post) return response.status(404).json({ msg: 'Post not found' });
        
        await post.deleteOne(); // Use deleteOne for safety
        response.status(200).json('Post deleted successfully');
    } catch (error) {
        console.error('Error deleting post:', error.message); // Logging the error
        response.status(500).json({ msg: 'Internal Server Error', error });
    }
}

export const getPost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (!post) return response.status(404).json({ msg: 'Post not found' });
        
        response.status(200).json(post);
    } catch (error) {
        console.error('Error retrieving post:', error.message); // Logging the error
        response.status(500).json({ msg: 'Internal Server Error', error });
    }
};

export const getAllPosts = async (request, response) => {
    let username = request.query.username;
    let category = request.query.category;
    let posts;
    try {
        if (username) 
            posts = await Post.find({ username: username });
        else if (category) 
            posts = await Post.find({ categories: category });
        else 
            posts = await Post.find({});
        
        response.status(200).json(posts);
    } catch (error) {
        console.error('Error retrieving posts:', error.message); // Logging the error
        response.status(500).json({ msg: 'Internal Server Error', error });
    }
}
