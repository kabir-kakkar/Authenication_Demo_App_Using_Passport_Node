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
//Including body-parser so we can access the data in the form using req.body.(name)
app.use (bodyParser.urlencoded({extended: true}));

// They are responsible for reading the session, taking the data from the session,
// Encode it - SerailizeUser
// And Decode it - DeserializeUser
passport.serializeUser(User.serializeUser());
passport.deserializeUser (User.deserializeUser());

// ======================
// ROUTES
// ======================

app.get("/", function(req, res){
    res.render("home.ejs");
});

app.get("/secret", function(req, res){
    res.render("secret.ejs");
});

// AUTH ROUTES
// show sign up form
app.get("/register", function(req, res){
    res.render("register.ejs");
});

//handling user signup
app.post ("/register", function(req, res){
    // We only pass in username but not the password
    // Instead we add the password as the second parameter
    // User.register takes the password(the second argument) and hashes it 
    // then finally the call back function takes the new user and puts everything inside of it.
    // It has username and the hash password as well
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err) {
            console.log (err);
            return res.render('register');
        } 
        // Once the user has been created and there is not an error
        // We run passport.authenticate which will log the user in, run the passport serializeUser method, store 
        // information and specify that we want to use the "local" strategy (it can be "twitter" if we want to sign up with twitter but we use local here as we want the information to be stored locally)
        
        passport.authenticate("local")(req, res, function(){
            // Once the user has ben logged in, we redirect to the secret page
            res.redirect("/secret");
        });
    });
});

app.listen(3000, function(){
    console.log("The Server has started!");
 });