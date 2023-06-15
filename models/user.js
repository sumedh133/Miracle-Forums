var mongoose = require("mongoose");
const {postSchema}=require("./post.js");
var passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique:true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: '',
    },
    profilePicture: {
      type: String,
      default: 'public/css/default-profile.png',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    posts: [postSchema],
  });

UserSchema.plugin(passportLocalMongoose, {usernameQueryFields: ["email"],
errorMessages: {
  IncorrectPasswordError: 'Invalid password',
  IncorrectUsernameError: 'Invalid username or email',
}});

const User= mongoose.model("User", UserSchema);
exports.User=User;