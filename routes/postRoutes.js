const express = require("express");
const router = express.Router();
const { Post } = require("../models/post");
const { Comment } = require("../models/comment");
const { User } = require("../models/user");
const { Tag } = require("../models/tag");

router.get('/feed', async function(req, res) {
  try {
    // Retrieve the user's preferred tags
    const user = await User.findById(req.user._id).populate("preferredTags");
    const preferredTags = user.preferredTags.map((tag) => tag._id);

    // Find posts with at least one of the preferred tags
    const posts = await Post.find({ tags: { $in: preferredTags } })
      .populate("tags")
      .sort({ time: -1 }) // Sort by date, descending order
      .populate("author");
      var checkUp=[];
      var checkDown=[];
      posts.forEach(post=>{
        if(post.upvotes.includes(user._id))
          checkUp.push(1);
        else
        checkUp.push(0);
        if(post.downvotes.includes(user._id))
          checkDown.push(1);
        else
        checkDown.push(0);
      });
    return res.render("feed", { feed: posts,user,checkUp,checkDown });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to retrieve user feed" });
  }
});

router.get("/create", function (req, res) {
    res.render("createPost");
});

router.post("/create", async (req, res) => {
  const tagsText = req.body.tags;
  const tagsArray = tagsText.split(',').map(tag => ({ name: tag.trim() }));
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    author: req.user._id,
    views: 1,
  });
  try {
    for (let i = 0; i < tagsArray.length; i++) {
      var tag = await Tag.findOne({ name: tagsArray[i].name });
      if (!tag) {
        tag = new Tag({ name: tagsArray[i].name, posts: post._id});
      } else {
        tag.posts.push(post._id);
      }
      await tag.save();
      post.tags.push(tag._id);
    }
    await post.save();
    const user = await User.findById(req.user._id);
    user.posts.push(post._id);
    await user.save();
    res.send("Post successfully created.");
  } catch (err) {
    console.log("Error creating post:", err);
    res.status(500).send("An error occurred while creating the post.");
  }
});


router.get("/viewPost/:postId", async function (req, res) {
  try {
    const user= await User.findById(req.user._id);
    const postId = req.params.postId;
    const post = await Post.findById(postId)
    .populate("author")
    .populate("tags")
    .populate("comments");
    var checkUp,checkDown;
    if(post.upvotes.includes(user._id))
      checkUp=1;
    else
      checkUp=0;
    if(post.downvotes.includes(user._id))
      checkDown=1;
    else
      checkDown=0;

    return res.render("openPost", { post,user,checkDown,checkUp });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error" });
}
});

// Upvote a post
router.post('/posts/:postId/upvote', async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isUpvoted = post.upvotes.includes(userId);

    if (isUpvoted) {
      post.upvotes.pull(userId);
    } else {
      if (post.downvotes.includes(userId)) {
        post.downvotes.pull(userId);
      }
      post.upvotes.push(userId);
    }
    post.votes = post.upvotes.length - post.downvotes.length;

    await post.save();

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to update post vote' });
  }
});

// Downvote a post
router.post('/posts/:postId/downvote', async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isDownvoted = post.downvotes.includes(userId);

    if (isDownvoted) {
      post.downvotes.pull(userId);
    } else {
      if (post.upvotes.includes(userId)) {
        post.upvotes.pull(userId);
      }

      post.downvotes.push(userId);
    }

    post.votes = post.upvotes.length - post.downvotes.length;

    await post.save();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to update post vote' });
  }
});

module.exports = router;

  