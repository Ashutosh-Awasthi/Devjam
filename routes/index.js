const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");
const flash = require("connect-flash");

function isAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash("message","You need to be logged in to use that")
        res.redirect(`/login?redirect=${req.path}`);
    }
}

//Auth routes..........................................................................................
router.get("/login",(req,res)=>{
    res.render("login",{redirect: req.query.redirect});
})

router.get("/register",(req,res)=>{
    res.render("register",{Posts: {}});
})

router.post("/register",async(req,res)=>{
    try{
        password = await bcrypt.hash(req.body.password,10);
    }catch{
        res.redirect("/register");
    }
    let data={
        password: password,
        username: req.body.username,
        email: req.body.email,
        description: req.body.description,
        name: req.body.name,
        address: req.body.address
    }

    User.create(data,(err,newUser)=>{
        if(!err){
            console.log(newUser);
            req.flash("messageSuccess","Congrats! you have been registered. Now sign-in to get started");
            res.redirect("/login")
        }else{
            if(err.code===11000)
                req.flash("message","Username or Email has already been registered")
            res.render("register",{Posts: data})
        }
    })
})

router.post("/login",passport.authenticate('local',{
    failureRedirect: '/login?status=failed',
    failureFlash: true
}),(req,res)=>{
        let redirect = req.query.redirect||'/'
        res.redirect(redirect);
})

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
})

router.get('/user',isAuthenticated,(req,res)=>{
    User.findById(req.user._id,(err,foundUser)=>{
        if(!err){
            res.render("User/index",{user: foundUser})
        }else{
            res.send("OOPS!!!")
        }
    })
})

module.exports =  router;