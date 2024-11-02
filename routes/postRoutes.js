// server/routes/postRoutes.js
import express from 'express';
import { createPost, getPost, updatePost, deletePost, getAllPosts } from '../controller/postController.js';

const router = express.Router();

router.post('/', createPost);
router.get('/:id', getPost); // Ensure this route matches the frontend API call
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.get('/', getAllPosts);

export default router;
