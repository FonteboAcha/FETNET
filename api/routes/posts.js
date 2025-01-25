import express from "express"

const router = express.Router();
// import connection from '../db';
import { getPosts, createPost, addComment, likeUnlikePost, viewComments }  from '../controllers/postsController.js'

// Fetch all posts from backend
router.get('/all', getPosts);

//create a new post
router.post('/write', createPost);

router.post('/:postId/like', likeUnlikePost);


router.post('/:postId/comments', addComment);
router.get('/:postId/comments', viewComments);

// Delete post
// router.delete("/:id", deletePost);

// Get a single post
// router.get('/:id', getPost)
// Like/Unlike post
export default router