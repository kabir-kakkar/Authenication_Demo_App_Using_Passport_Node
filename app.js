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
// This code should always come before app.use (passport.initialize()) and session
// Else the code will break and you will not be able to log in
app.use (require("express-session")({
    secret: "Wingardium Leviosa",
    resave: false,
    saveUninitialized: false
}));
// Initializing passport session
app.use (passport.initialize());
app.use (passport.session());

//Including body-parser so we can access the data in the form using req.body.(name)
app.use (bodyParser.urlencoded({extended: true}));

// We are creating a new local strategy using the User.authenticate method that is coming from
// models/user.js. (plugin passportLocalMongoose)
passport.use(new LocalStrategy(User.authenticate()));
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

// isLoggedIn is the middleware that we wrote out on our own. (see at bottom)
// therefore, whenever a user goes out to "/secret", out middleware isLoggedIn 
// checks if the user is logged in or not.
// if he is not logged in, then he will be redirected to the home page.
// if he is logged in, he will then be shown the secret page/
app.get("/secret", isLoggedIn, function(req, res){
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


//LOGIN ROUTES
// render login form
app.get ("/login", function(req, res){
    res.render("login.ejs");
});
// Login Logic
// Passport.autheticate is actually the middleware here.
// It is the code before it runs the final callback
// autheticate method checks the credentials 
app.post ("/login", passport.authenticate("local", {
        successRedirect: "/secret",
        failureRedirect: "/login"
    }), function (req, res){
        
});

//Logout Logic
app.get("/logout", function(req, res){
    // HERE PASSPORT IS DESTROYING ALL THE USER DATA IN THE CURRENT SESSION
    req.logout();

    res.redirect("/");
});

// WRITE OUR OWN MIDDLEWARE
// this function checks if the user is Authenticated (logged in)
// if he is logged in, then the next() function takes place which refers to 
// the callback function which will come afterwards
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

app.listen(3000, function(){
    console.log("The Server has started!");
 });