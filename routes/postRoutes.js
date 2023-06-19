const express = require("express");
const router = express.Router();
const { Post } = require("../models/post");
const { Comment } = require("../models/comment");
const { User } = require("../models/user");
const { Tag } = require("../models/tag");

router.get("/create", function (req, res) {
    res.render("createPost");
});

router.post("/create", async (req, res) => {
  const tagsText = req.body.tags;
  const tagsName = tagsText.split(',');
  const tagsArray = tagsText.split(',').map(tag => ({ name: tag.trim() }));
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    tags_name:tagsName,
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

router.get('/tag/suggestions', async (req, res) => {
  try {
    const searchText = req.query.searchText; // Get the entered text from the query parameter

    // Perform a search in the tags collection based on the entered text
    const matchedTags = await Tag.find({ name: { $regex: searchText, $options: 'i' } });

    res.json(matchedTags); // Return the matched tags as the response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving tag suggestions' });
  }
});



module.exports = router;

  