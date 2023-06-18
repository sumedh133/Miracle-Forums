const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Post, validatePost } = require("../models/post");
const { Reply, validateReply } = require("../models/replies");
const { User } = require("../models/user");
const { Tag } = require("../models/tag");
const mongoose=require("mongoose")

router.get('/manageTags', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const preferredTags = user.preferredTags;
        const allTags = await Tag.find();
        var availableTags=[];
        var savedTags=[];
        availableTags = allTags.filter(tag => !preferredTags.includes(tag._id));
        savedTags= allTags.filter(tag=> preferredTags.includes(tag._id));
        return res.render('manageTags', { tags: availableTags, sTags:savedTags });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch tags' });
    }
});

router.post("/saveTags", async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const selectedTags = await Tag.find({ _id: { $in: req.body.tags } });
      if (Array.isArray(selectedTags)) {
        const ids = selectedTags.map(tag => tag._id);
        user.preferredTags.push(...ids);
      } else {
        user.preferredTags.push(selectedTags._id);
      }
      await user.save();
      return res.status(500).json({ message: 'Successfully saved preferred tags' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Failed to save preferred tags' });
    }
  });
  

router.post("/removeTags", async (req,res)=>{
    try{
        const user = await User.findById(req.user._id);
        const selectedTags = await Tag.find({ _id: { $in: req.body.stags } });
        if(Array.isArray(selectedTags))
        {
            const ids = selectedTags.map(tag => tag._id);
            user.preferredTags.pull(...ids);
        }
        else
        {
            user.preferredTags.pull(selectedTags._id);
        }
        await user.save();
        return res.status(500).json({ message: 'Successfully removed from preferred tags' });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Failed to remove from preferred tags' });
    }
});

router.get("/viewTagPosts/:tagId", async (req, res) => {
    try {
      const tagId = req.params.tagId;
      const posts = await Post.find({ tags: tagId });
      const tag= await Tag.findById(tagId);
      const user=await User.findById(req.user._id);
      const check = user.preferredTags.includes(tag._id);
      res.render("tagPosts", { posts,tag,check });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to retrieve tag posts" });
    }
});

router.post("/saveTag/:tagId", async (req, res) => {
    try{
        const tagId = req.params.tagId;
        const user=await User.findById(req.user._id);
        user.preferredTags.push(tagId);
        await user.save();
        return res.json({ message: "Tag saved successfully" });
    }
    catch(err)
    {
        console.log(err);
        res.json({ message: "error saving tag!" });
    }
});

router.post("/removeTag/:tagId", async (req, res) => {
    try{
        const tagId = req.params.tagId;
        const user=await User.findById(req.user._id);
        user.preferredTags.pull(tagId);
        await user.save();
        return res.json({ message: "Tag removed successfully" });
    }
    catch(err)
    {
        console.log(err);
        return res.json({ message: "error removing tag!" });
    }
});



module.exports = router;

  