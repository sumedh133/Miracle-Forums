require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var {User} = require("./models/user.js");
const mongoose=require("mongoose");
const session=require("express-session");
const passport=require("passport");
const LocalStrategy = require("passport-local");

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

mongoose.connect('mongodb+srv://wishafish:ssb13032004@survey.sxac1.mongodb.net/?retryWrites=true&w=majority&appName=Survey', {
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


const postRoutes = require("./routes/postRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const tagRoutes = require("./routes/tagRoutes.js");
const commentRoutes = require("./routes/commentRoutes.js");
app.use("/",userRoutes);
app.use("/",postRoutes);
app.use("/",tagRoutes);
app.use("/",commentRoutes);

app.listen(5001, function() {
  console.log("Server started on port 5001.");
  console.log("localhost:5001");
});