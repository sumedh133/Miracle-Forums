const mongoose = require('mongoose');
const Joi = require("joi");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 25,
    unique:true
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    default:[]
  }],
  users:{
    type:Number,
    default:0,
  }
});

const Tag = mongoose.model("Tag", tagSchema);

function validateTag(tag) {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(25),
  });
  return schema.validate(tag);
}

exports.validateTag = validateTag;
exports.tagSchema = tagSchema;
exports.Tag = Tag;