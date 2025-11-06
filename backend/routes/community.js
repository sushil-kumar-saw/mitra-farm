import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import CommunityPost from '../models/CommunityPost.js';
import User from '../models/user.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, posts });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create a new post (requires auth)
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { question } = req.body;
    
    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const newPost = new CommunityPost({
      authorId: userId,
      authorName: user.name,
      question: question.trim(),
      replies: []
    });

    await newPost.save();
    await newPost.populate('authorId', 'name email');

    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add a reply to a post (requires auth)
router.post('/:postId/replies', verifyToken, async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { content } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Reply content is required' });
    }

    const post = await CommunityPost.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.replies.push({
      authorId: userId,
      authorName: user.name,
      content: content.trim()
    });

    await post.save();
    await post.populate('authorId', 'name email');

    res.json({ success: true, post });
  } catch (err) {
    console.error('Error adding reply:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete a post (only by author)
router.delete('/:postId', verifyToken, async (req, res) => {
  try {
    const userId = req.user;
    const post = await CommunityPost.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.authorId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await CommunityPost.findByIdAndDelete(req.params.postId);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete a reply (only by author)
router.delete('/:postId/replies/:replyId', verifyToken, async (req, res) => {
  try {
    const userId = req.user;
    const post = await CommunityPost.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const reply = post.replies.id(req.params.replyId);
    
    if (!reply) {
      return res.status(404).json({ success: false, message: 'Reply not found' });
    }

    if (reply.authorId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this reply' });
    }

    reply.deleteOne();
    await post.save();

    res.json({ success: true, message: 'Reply deleted' });
  } catch (err) {
    console.error('Error deleting reply:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

