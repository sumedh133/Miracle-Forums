const express = require("express");
const router = express.Router();
const { Post } = require("../models/post");
const { Comment} = require("../models/comment");
const { User } = require("../models/user");

router.post("/submitComment/:postId", async function (req, res) {
    try {
      const postId = req.params.postId;
      const post = await Post.findById(postId);
      const user = await User.findById(req.user._id);
  
      const comment = new Comment({
        post: postId,
        content: req.body.commentContent,
        author: user._id,
        time: Date.now(),
      });
  
      await comment.save();
  
      post.comments.push(comment._id);
      await post.save();
  
      res.redirect(`/viewPost/${postId}`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error" });
    }
  });
  
// Upvote a comment
router.post('/comments/:commentId/upvote', async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const userId = req.user._id;
  
      const comment = await Comment.findById(commentId);
  
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      const isUpvoted = comment.upvotes.includes(userId);
  
      if (isUpvoted) {
        comment.upvotes.pull(userId);
      } else {
        if (comment.downvotes.includes(userId)) {
          comment.downvotes.pull(userId);
        }
        comment.upvotes.push(userId);
      }
  
      comment.votes = comment.upvotes.length - comment.downvotes.length;
  
      await comment.save();
  
      return res.status(200).json({ message: 'Comment vote updated successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to update comment vote' });
    }
  });
  
  // Downvote a comment
  router.post('/comments/:commentId/downvote', async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const userId = req.user._id;
  
      const comment = await Comment.findById(commentId);
  
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      const isDownvoted = comment.downvotes.includes(userId);
  
      if (isDownvoted) {
        comment.downvotes.pull(userId);
      } else {
        if (comment.upvotes.includes(userId)) {
          comment.upvotes.pull(userId);
        }
  
        comment.downvotes.push(userId);
      }
  
      comment.votes = comment.upvotes.length - comment.downvotes.length;
  
      await comment.save();
  
      return res.status(200).json({ message: 'Comment vote updated successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to update comment vote' });
    }
  });

  router.post("/comments/:commentId/reply", async function (req, res) {
    try {
      const commentId = req.params.commentId;
      const comment = await Comment.findById(commentId);
      const user = await User.findById(req.user._id);
  
      const reply = {
        author: user._id,
        content: req.body.replyContent,
        time: Date.now(),
      };
  
      comment.replies.push(reply);
      await comment.save();
  
      res.redirect(`/viewPost/${comment.post}`);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error" });
    }
  });
  
  
  module.exports = router;
  