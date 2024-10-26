import Post from '../model/post.js';

export const createPost = async (request, response) => {
    try {
        const post = new Post(request.body);
        await post.save();

        response.status(200).json('Post saved successfully');
    } catch (error) {
        response.status(500).json({ msg: 'Error saving post', error });
    }
}

export const updatePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (!post) return response.status(404).json({ msg: 'Post not found' });

        await Post.findByIdAndUpdate(request.params.id, { $set: request.body });

        response.status(200).json('Post updated successfully');
    } catch (error) {
        response.status(500).json({ msg: 'Error updating post', error });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const result = await PostModel.findByIdAndDelete(postId);
        if (!result) {
            return res.status(404).json({ isSuccess: false, message: "Post not found" }); // Handle not found case
        }
        res.status(200).json({ isSuccess: true, message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ isSuccess: false, message: "Failed to delete post" });
    }
};

export const getPost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);

        if (!post) {
            return response.status(404).json({ msg: 'Post not found' }); // Handle the case if the post doesn't exist
        }

        response.status(200).json(post);
    } catch (error) {
        response.status(500).json(error);
    }
}

export const getAllPosts = async (request, response) => {
    let username = request.query.username;
    let category = request.query.category;
    let posts;
    try {
        if (username) {
            posts = await Post.find({ username: username });
        } else if (category) {
            posts = await Post.find({ categories: category });
        } else {
            posts = await Post.find({});
        }
        
        response.status(200).json(posts);
    } catch (error) {
        response.status(500).json(error);
    }
}
