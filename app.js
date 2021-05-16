const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const session = require("express-session")
const passport = require("passport")
const Auth = require('./auth.js')
const indexRoutes = require("./routes/index")
const app = express()
const port = process.env.PORT||3000
const MONGODB_URL = process.env.MONGODB_URL

mongoose.connect(MONGODB_URL||'mongodb://localhost:27017/portal', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(session({
    secret: process.env.SECRET||"1234",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.authenticate('session'));
Auth(passport);

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
})

app.get("/",(req,res)=>{
    res.render("home")
})

app.use(indexRoutes);



app.listen(port,()=>{});