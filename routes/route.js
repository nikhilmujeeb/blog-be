import express from 'express';
import { createPost, updatePost, deletePost, getPost, getAllPosts } from '../controller/post-controller.js';
import { newComment, getComments, deleteComment } from '../controller/comment-controller.js';
import { loginUser, signupUser, logoutUser } from '../controller/user-controller.js';
import { authenticateToken, createNewToken } from '../controller/jwt-controller.js';
import Post from './models/Post.js'; // Ensure this line correctly imports your Post model

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/logout', logoutUser);
router.post('/token', createNewToken);

router.post('/create', authenticateToken, createPost);
router.put('/update/:id', authenticateToken, updatePost);
router.delete('/delete/:id', authenticateToken, deletePost);
router.get('/post/:id', getPost);
router.get('/posts', getAllPosts);

router.post('/comment/new', authenticateToken, newComment);
router.get('/comments/:id', authenticateToken, getComments);
router.delete('/comment/delete/:id', authenticateToken, deleteComment);

// Example route to fetch a post by ID
router.get('/post/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the request parameters
        console.log('Received ID:', id); // Log the received ID for debugging

        const post = await Post.findById(id); // Ensure Post is defined here
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json({ isSuccess: true, data: post });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ msg: 'Error fetching post' });
    }
});

export default router;
