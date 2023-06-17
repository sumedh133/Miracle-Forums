const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Post, validatePost } = require("../models/post");
const { Reply, validateReply } = require("../models/replies");
const { User } = require("../models/user");
const { Tag } = require("../models/tag");
const mongoose=require("mongoose")

router.get('/exploreTags', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const preferredTags = user.preferredTags;
        const allTags = await Tag.find();
        const availableTags = allTags.filter(tag => !preferredTags.includes(tag._id));
        return res.render('exploreTags', { tags: availableTags });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch tags' });
    }
});

router.post("/exploreTags", async (req,res)=>{
    try{
        const selectedTags = [req.body.tags];
        const user = await User.findById(req.user._id);
        for (let i = 0; i < selectedTags.length; i++) {
            const tag = await Tag.findOne({ name: selectedTags[i] });
            user.preferredTags.push(tag._id);
          }
        await user.save();
        return res.status(500).json({ message: 'Successfully saved preferred tags' });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Failed to save preferred tags' });
    }
});

module.exports = router;

  