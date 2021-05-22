const http = require("http");
const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const flash = require("connect-flash")
const Auth = require('./auth.js')
const indexRoutes = require("./routes/index")
const postsRoutes = require("./routes/Posts")
const apiRoutes = require("./routes/api")
const userRoutes = require("./routes/user")
const app = express()
const server = http.createServer(app)
const port = process.env.PORT||3000
const io = require('socket.io')(server);
const MONGODB_URL = process.env.MONGODB_URL

mongoose.connect(MONGODB_URL||"mongodb://localhost:27017/portal",{useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(flash());
app.use(session({
    secret: process.env.SECRET||"1234",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.authenticate('session'));
Auth(passport);


function isAuthenticated(req,res,next){
    if(req.isAuthenticated()){

        next();
    }else{
        req.flash("message","You need to be logged in to use that")
        res.redirect(`/login?redirect=${req.path}`);
    }
}

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.message = req.flash("message");
    res.locals.messageSuccess = req.flash("messageSuccess");
    next();
})

app.get("/",(req,res)=>{
    res.render("home")
})

app.use(indexRoutes);
app.use(postsRoutes);
app.use(apiRoutes);
app.use(userRoutes);

app.get('/chat',isAuthenticated,(req,res)=>{
    res.render('chat/index');
})

io.on('connection',(socket) =>{
    socket.on('message',(data)=>{
        socket.broadcast.emit('message',data);
    })

})

server.listen(port,()=>{
    console.log("running")
});

