require("dotenv").config();

const express = require('express');
const app = express();

const path = require('path');
const userModel = require('./models/user');
const postModel = require('./models/post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const upload = require("./config/multerconfig");


app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", async (req,res) => {
    let currUser = null;
    if( req.cookies.token && req.cookies.token !== ""){
        let data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        currUser = await userModel.findOne({email: data.email});
    }
    res.render('landing', {currUser});
})

app.get("/register", (req,res) => {
    res.render('index');
})

app.get("/userlogin", (req,res) => {
    if(req.cookies.token === "" || !req.cookies.token) return res.render('userlogin');
    else return res.redirect("/profile");
})

app.get("/profile", isLoggedIn, async (req,res) => {
    let currUser = await userModel.findOne({email: req.user.email}).populate("posts");    
    res.render('profile', {currUser});
})

app.get("/profile/avatar", isLoggedIn, (req, res) => {
    res.render("photo");
})

app.post("/upload", isLoggedIn, upload.single("avatar"), async (req, res) => {
    let user = await userModel.findOne({email: req.user.email});
    user.avatar = req.file.filename;
    await user.save();
    res.redirect("/profile");
  }
);

app.get("/saviors", isLoggedIn, async (req,res) => {
    let currUser = await userModel.findOne({email: req.user.email});
    let users = await userModel.find();    
    res.render('saviors', {currUser, users});
})

app.get("/allSaviors", isLoggedIn, async (req,res) => {
    let currUser = await userModel.findOne({email: req.user.email});
    let users = await userModel.find();    
    res.render('allSaviors', {currUser, users});
})

app.post("/update/:id",isLoggedIn, async (req,res) => {
    let {latitude, longitude, locality} = req.body;
    await userModel.findOneAndUpdate({_id: req.params.id}, 
        {$set: {
            "location.latitude" : latitude,
            "location.longitude" : longitude,
            "location.locality" : locality
        }},
    {new: true});    
    res.redirect("/profile");
})

app.post("/avail/:id", isLoggedIn, async (req, res) => {
    let {availability} = req.body;
    let user = await userModel.findOne({_id: req.params.id});
    user.availability = availability;
    user.save();
    res.redirect("/profile");
})

app.post("/rate/:id",isLoggedIn, async (req,res) => {
    let {rating} = req.body;
    let user = await userModel.findOne({_id: req.params.id});
    rating = Number(rating) + user.rating.tr;
    let count = 1 + user.rating.tu;
    
    await userModel.findOneAndUpdate({_id: req.params.id}, 
        {$set: {
            "rating.tr" : rating,
            "rating.tu" : count
        }},
    {new: true});    
    res.redirect("/saviors");
})

app.post("/rateAll/:id",isLoggedIn, async (req,res) => {
    let {rating} = req.body;
    let user = await userModel.findOne({_id: req.params.id});
    rating = Number(rating) + user.rating.tr;
    let count = 1 + user.rating.tu;
    
    await userModel.findOneAndUpdate({_id: req.params.id}, 
        {$set: {
            "rating.tr" : rating,
            "rating.tu" : count
        }},
    {new: true});    
    res.redirect("/allSaviors");
})

app.get("/post", isLoggedIn, async (req,res) => {
    let posts = await postModel.find().populate("user");
    let currUser = await userModel.findOne({email: req.user.email}).populate("posts");
    res.render('posts', {currUser, posts});
})

app.post("/post", isLoggedIn, async (req,res) => {
    let currUser = await userModel.findOne({email: req.user.email});    
    let {type, content} = req.body;
    let post = await postModel.create({
        user: currUser._id,
        type,
        content
    });

    currUser.posts.push(post._id);
    await currUser.save();
    res.redirect("/profile");
})

app.post("/create", async (req,res) => {
    try{
        let {type, name, username, age, number, email, password, latitude, longitude, locality} = req.body;
        let user = await userModel.findOne({email});
        if(user) return res.status(400).redirect("/register?error=email");
        if(type === "" || type === "none") type = null;
        let newUser;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        newUser = await userModel.create({
            type,
            name,
            username,
            age,
            number,
            email,
            location: {
                latitude,
                longitude,
                locality
            },
            password: hash,
            rating: {
                tr: 0,
                tu: 0
            },
            availability: "Available"
        });


        let token = jwt.sign({email: newUser.email , userid: newUser._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        res.cookie("token", token);
        res.status(201).redirect("/profile?register=success");
    } catch(err) {
        console.error(err);
        res.status(500).send("Server error");
    }
})

app.post("/userlogin", async (req,res) => {
    let {email, password} = req.body;
    let user = await userModel.findOne({email});
    if(!user) return res.status(500).send("Something went wrong!!");
    
    bcrypt.compare(password, user.password, (err, result) => {
        if(result) {
            let token = jwt.sign({email: user.email, userid: user._id}, process.env.JWT_SECRET);
            res.cookie("token", token);
            res.status(200).redirect("/profile?login=success");
        }
        else return res.status(500).send("Something went wrong!!");
    })
})

app.get("/logout", (req,res) => {
    res.clearCookie("token");
    res.redirect("/");
})

app.get("/solved/:id", isLoggedIn, async (req,res) => {
    await postModel.findOneAndDelete({_id: req.params.id});
    res.redirect("/profile/#myPosts");
})

function isLoggedIn(req, res, next){
    if(req.cookies.token === "" || !req.cookies.token) return res.redirect("/userlogin");
    else{
        let data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        req.user = data;
        next();
    }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`running on localhost:${PORT}...`);
})