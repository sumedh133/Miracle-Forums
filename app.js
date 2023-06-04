require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const session=require("express-session");
const passport=require("passport");
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
});

userSchema.plugin(passportLocalMongoose);

const User= mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
  res.render("loginRegistration");
});

app.get("/feed",function(req,res){
  if(req.isAuthenticated()){
    res.render("feed");
  }
  else{
    res.redirect("/");
  }
});

app.get('/logout', function(req, res, next) {
  //clicking on logout button will no longer accept the cookie as valid
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({ username, email });

  User.register(newUser, password, (err, user) => {
    if (err) {
      if (err.message.includes('username')) {
        res.status(400).json({ message: 'Username is already taken' });
      } else if (err.message.includes('email')) {
        res.status(400).json({ message: 'Email is already taken' });
      }
      console.error('Failed to register user', err);
      res.status(500).json({ message: 'Failed to register user' });
    }
    else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/feed");
      });
    }
  });
});

app.post('/login', (req, res) => {
  const { usernameOrEmail, password, rememberMe } = req.body;

  // searching user by username or email
  User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] })
    .then((user) => {
      if (!user) {
        // Invalid username or email
        res.status(401).json({ message: 'Invalid username or email' });
      }

      // authenticating the user using the provided password
      user.authenticate(password)
        .then((authenticated) => {
          if (!authenticated) {
            // invalid password
            res.status(401).json({ message: 'Invalid password' });
          }
          // logging in the user
          req.login(user, (err) => {
            if (err) {
              // error during login
              console.error('Error during login', err);
              res.status(500).json({ message: 'Error during login' });
            }else{
              if(rememberMe)
              req.session.cookie.expires = new Date(Date.now() + 3600000*24*30);
            // if successful 
              res.redirect("/feed");
            }
          });
        });
    })
    .catch((err) => {
      // Error during authentication
      console.error('Error during authentication', err);
      res.status(500).json({ message: 'Error during authentication' });
    });
});


app.listen(5000, function() {
  //checking working port
    console.log("Server started on port 5000.");
});