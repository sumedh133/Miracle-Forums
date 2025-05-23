require("dotenv").config();
const express = require("express");
const passport=require("passport");
var {User} = require("../models/user");
const {Post} = require("../models/post");
const {Tag} = require("../models/tag");

const router = express.Router();

router.get("/",function(req,res){
  if(req.isAuthenticated()){
    return res.redirect("/feed");
  }
  else{
    return res.redirect("/loginRegistration");
  }
});

router.get("/loginRegistration", function(req, res) {
  return res.render("loginRegistration");
});



router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { 
      console.error('Error during logout:', err);
      return next(err); 
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session during logout:', err);
        return res.redirect('/'); 
      }
      return res.redirect('/loginRegistration'); 
    });
  });
});

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({ username, email });

  User.register(newUser, password, (err, user) => {
    if (err) {
      var errorMessageRegistration;
      if (err.message.includes('username')) {
        errorMessageRegistration="Username is already taken"
        return res.render("loginRegistration",{errorMessageRegistration})
      } else if (err.message.includes('email')) {
        errorMessageRegistration="E-mail is already taken"
        return res.render("loginRegistration",{errorMessageRegistration})
      }
      console.error('Failed to register user', err);
      return res.status(500).json({ message: 'Failed to register user' });
    }
    else{
      passport.authenticate("local")(req,res,function(){
        return res.redirect("/");
      });
    }
  });
});


router.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      console.error(err);
      return res.redirect("/loginRegistration");
    }
    if (!user) {
      var errorMessageLogin=info.message;
      if (info.message === "Invalid username or email" || info.message === "Invalid password") {
        return res.render("loginRegistration",{errorMessageLogin})
      } 
      else{
        console.log(info);
      }
    }
    req.logIn(user, function(err) {
      if (err) {
        console.error(err);
        return res.redirect("/loginRegistration");
      }
      let rememberMe=req.body.rememberMe;
      if(rememberMe)
        req.session.cookie.expires = new Date(Date.now() + 3600000*24*30);
        return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/profile", async function (req, res) {
  try {
    const userId = req.user._id;
    const posts = await Post.find({ author: userId })
    .populate("author")
    .populate("tags");
    posts.reverse();
    return res.render('userProfile', { user:req.user, posts});
  } catch (err) {
    console.log('Error retrieving user profile:', err);
    return res.status(500).send('An error occurred while retrieving the user profile.');
  }
});

module.exports=router;


