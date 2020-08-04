var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost:27017/auth_demo_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.set ('view engine', 'ejs');

app.get("/", function(req, res){
    res.render("home.ejs");
});

app.get("/secret", function(req, res){
    res.render("secret.ejs");
});

app.listen(3000, function(){
    console.log("The Server has started!");
 });