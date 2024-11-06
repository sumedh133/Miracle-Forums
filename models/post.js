const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 80,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  }],
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
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
    default:null,
    unique:false
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default:null,
    unique:false
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default:null
  }],
  time: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

exports.postSchema = postSchema;
exports.Post = Post;