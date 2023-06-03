require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const md5=require("md5");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/",function(req,res){
  res.render("loginRegistration");
});

mongoose.connect("mongodb://0.0.0.0:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
  },
});

const User= mongoose.model("User",userSchema);

app.post('/register', async (req, res) => {
  try {
    const { username, email } = req.body;
    const password=md5(req.body.password);
    const user = new User({ username, email, password });

    await user.save();

    res.render("feed");
    } 
    catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const username_email = req.body.username_email;
    const password=md5(req.body.password);

    const user = await User.findOne({
      $or: [{ username: username_email }, { email: username_email }],
    });

    if (!user) {
      return res.status(401).json({ error: 'User doesn\'t exist' });
    }
    if (user.password !== password){
      return res.status(402).json({ error: 'Invalid password' });     
    }
    res.render("feed");
    }
    catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(5000, function() {
    console.log("Server started on port 5000.");
});