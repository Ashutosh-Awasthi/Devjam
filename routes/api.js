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

router.get('/api/username',isAuthenticated,(req,res)=>{
    res.send(req.user.username);
})

module.exports = router;