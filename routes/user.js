const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");

function isAuthenticated(req,res,done){
    if(req.isAuthenticated()){
        done();
    }else{
        req.flash("message","You need to be logged in to use that")
        res.redirect(`/login?redirect=${req.path}`);
    }
}

router.get("/user/edit",isAuthenticated,(req,res)=>{
    User.findById(req.user._id,(err,fUser)=>{
        let data = {
            name: fUser.name,
            description: fUser.description,
            address: fUser.address
        }
        res.render("User/edit",{user: data})
    })
})
router.post("/user/edit",isAuthenticated,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{name: req.body.name, address: req.body.address, description: req.body.description})
    .exec((err,user)=>{
        if(!err){
            res.redirect("/user")
        }else{
            res.redirect("/user/edit")
        }
    })
})

module.exports = router;