const express = require("express");
const router = express.Router();
const { Post } = require("../models/post");
const { User } = require("../models/user");
const { Tag } = require("../models/tag");

router.get('/manageTags', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const preferredTags = user.preferredTags;

    const tags = await Tag.find().lean();

    const tagsWithCounts = tags.map(tag => {
      const postCount = tag.posts.length;
      const userCount = tag.users;
      return { ...tag, postCount, userCount };
    });

    const savedSortOption = req.query.savedSort || 'recentSaved'; // Default to 'recentSaved' if not specified in the query
    const unsavedSortOption = req.query.unsavedSort || 'recentUnsaved'; // Default to 'recentUnsaved' if not specified in the query

    let availableTags = tagsWithCounts.filter(tag => !preferredTags.includes(tag._id));
    let savedTags = tagsWithCounts.filter(tag => preferredTags.includes(tag._id));

    if (savedSortOption === 'posts') {
      savedTags = savedTags.sort((a, b) => b.postCount - a.postCount);
    } else if (savedSortOption === 'users') {
      savedTags = savedTags.sort((a, b) => b.userCount - a.userCount);
    } else {
      // Default to sorting by most recent for saved tags
      savedTags = savedTags.reverse();
    }

    if (unsavedSortOption === 'posts') {
      availableTags = availableTags.sort((a, b) => b.postCount - a.postCount);
    } else if (unsavedSortOption === 'users') {
      availableTags = availableTags.sort((a, b) => b.userCount - a.userCount);
    } else {
      // Default to sorting by most recent for unsaved tags
      availableTags = availableTags.reverse();
    }

    return res.render('manageTags', { tags: availableTags, sTags: savedTags, savedSortOption, unsavedSortOption });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch tags' });
  }
});

  
router.post("/saveTags", async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const selectedTags = await Tag.find({ _id: { $in: req.body.tags } });
      selectedTags.users=selectedTags.users+1;
      if (Array.isArray(selectedTags)) {
        const ids = selectedTags.map(tag => tag._id);
        user.preferredTags.push(...ids);
        selectedTags.forEach(tag => {
            tag.users = tag.users + 1;
        });
      } else {
        user.preferredTags.push(selectedTags._id);
        selectedTags.users = selectedTags.users + 1;
      }
      await user.save();
      await Promise.all(selectedTags.map(tag => tag.save()));
      return res.redirect("/manageTags");
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
            selectedTags.forEach(tag => {
                tag.users = tag.users - 1;
            });
        }
        else
        {
            user.preferredTags.pull(selectedTags._id);
            selectedTags.users = selectedTags.users - 1;
        }
        await user.save();
        await Promise.all(selectedTags.map(tag => tag.save()));
        return res.redirect("/manageTags");
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
        return res.render("tagPosts", { posts,tag,check });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to retrieve tag posts" });
    }
});

router.post("/saveTag/:tagId", async (req, res) => {
    try{
        const tagId = req.params.tagId;
        const user=await User.findById(req.user._id);
        const tag=await Tag.findById(tagId);
        tag.users=tag.users+1;
        await tag.save();
        user.preferredTags.push(tagId);
        await user.save();
        return res.redirect("/viewTagPosts/"+tagId);
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
        const tag=await Tag.findById(tagId);
        tag.users=tag.users-1;
        await tag.save();
        user.preferredTags.pull(tagId);
        await user.save();
        return res.redirect("/viewTagPosts/"+tagId);
    }
    catch(err)
    {
        console.log(err);
        return res.json({ message: "error removing tag!" });
    }
});

router.get('/suggestedTags', async (req, res) => {
  try {
    const input = req.query.input;
    // Perform the tag suggestion logic here
    // Fetch the suggested tags based on the input and send the response
    const suggestedTags = await Tag.find({ name: { $regex: input, $options: 'i' } }).lean();
    return res.json(suggestedTags);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch suggested tags' });
  }
});

module.exports = router;

  