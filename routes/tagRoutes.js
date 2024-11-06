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
        const tag= await Tag.findById(tagId);

        // Retrieve the sorting option from the query parameters
        const sortBy = req.query.sortBy || "recent"; // Default to sorting by most recent

        // Define the sort criteria
        let sortCriteria = {};
        if (sortBy === "upvotes") {
          sortCriteria = { votes: -1 }; // Sort by votes, descending order
        } else if (sortBy === "comments") {
          sortCriteria = { comments_size: -1 }; // Sort by comment count, descending order
        } else {
          sortCriteria = { time: -1 }; // Sort by date, descending order (most recent)
        }

        const posts = await Post.aggregate([
          { $match: { tags: { $in: [tag._id] } } },
          { $lookup: { from: "comments", localField: "comments", foreignField: "_id", as: "comments" } },
          { $addFields: { comments_size: { $size: "$comments" } } },
          { $sort: sortCriteria },
          { $lookup: { from: "tags", localField: "tags", foreignField: "_id", as: "tags" } },
          { $lookup: { from: "users", localField: "author", foreignField: "_id", as: "author" } },
          { $unwind: "$author" }
        ]);

        const user=await User.findById(req.user._id);
        return res.render("tagPosts", { posts,tag,sortBy,user});
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

//suggesting tags whicle creating posts
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

  