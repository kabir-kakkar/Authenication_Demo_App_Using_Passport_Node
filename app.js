var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require ('./models/user');

mongoose.connect('mongodb://localhost:27017/auth_demo_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.set ('view engine', 'ejs');
// Initializing passport session
app.use (passport.initialize());
app.use (passport.session());
app.use (require("express-session")({
    secret: "Wingardium Leviosa",
    resave: false,
    saveUninitialized: false
}));

// They are responsible for reading the session, taking the data from the session,
// Encode it - SerailizeUser
// And Decode it - DeserializeUser
passport.serializeUser(User.serializeUser());
passport.deserializeUser (User.deserializeUser());

app.get("/", function(req, res){
    res.render("home.ejs");
});

app.get("/secret", function(req, res){
    res.render("secret.ejs");
});

app.listen(3000, function(){
    console.log("The Server has started!");
 });