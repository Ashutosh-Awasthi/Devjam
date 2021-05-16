const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");

//Auth routes..........................................................................................
router.get("/login",(req,res)=>{
    res.render("login");
})

router.get("/register",(req,res)=>{
    res.render("register");
})

router.post("/register",async(req,res)=>{
    try{
        password = await bcrypt.hash(req.body.password,10);
    }catch{
        res.redirect("/register");
    }
    let data={
        password: password,
        username: req.body.username
    }

    User.create(data,(err,newUser)=>{
        if(!err){
            res.redirect("/")
        }else{
            res.redirect("/register")
        }
    })
})

router.post("/login",passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login'
}))

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
})

module.exports =  router;