require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
var User = require("./models/user.js");
const ejs = require("ejs");
const mongoose=require("mongoose");
const session=require("express-session");
const passport=require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret:process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://0.0.0.0/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/",function(req,res){
  if(req.isAuthenticated()){
    return res.redirect("/feed");
  }
  else{
    return res.redirect("/loginRegistration");
  }
});

app.get('/feed', function(req, res) {
  return res.render("feed");
});

app.get('/loginRegistration', function(req, res) {
  return res.render("loginRegistration");
});

app.get('/logout', function(req, res, next) {
  //clicking on logout button will no longer accept the cookie as valid
  req.logout(function(err) {
    if (err) { return next(err); }
    return res.redirect('/loginRegistration');
  });
});


app.post("/register", function(req, res){
  // console.log(req.body.username);
  // console.log(req.body.password);
  User.register(new User({username: req.body.username,email: req.body.email}), req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.status(400).json({ message: 'Error during registration' });
      }
      passport.authenticate("local")(req, res, function(){
          res.redirect("/feed");
      });
  });
});


app.post("/login", passport.authenticate("local",{
  successRedirect: "/feed",
  failureRedirect: "/loginRegistration"
}), function(req, res){
  
});

app.listen(5000, function() {
  //checking working port
    console.log("Server started on port 5000.");
});