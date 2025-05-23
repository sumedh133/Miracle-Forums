const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
    required: true,
  },
  content: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 5000,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }],
  time: {
    type: Date,
    default: Date.now,
  },
  replies: [{
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 5000,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  }],
});


const Comment = mongoose.model("Comment", commentSchema);

exports.Comment = Comment;
