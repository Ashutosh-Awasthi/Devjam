const express = require('express');
const router = express.Router();
// const bcrypt = require("bcrypt");
// const passport = require("passport");
// const User = require("../models/User");
const Post = require("../models/Post");
// const mongoose = require("mongoose");

function isAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash("message","You need to be logged in to use that")
        res.redirect(`/login?redirect=${req.path}`);
    }
}

function checkPostOwnership(req,res,next){
    Post.findById(req.params.id,(err,fP)=>{
        if(!err){
            if(fP.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("message","You don't have permission to do that");
                res.send("NOT AUTHORISED!!");
            }
        }else{
            res.send("OOPS!!");
        }
    })
}


router.get('/posts/new',isAuthenticated,(req,res)=>{
    res.render('Posts/new');
})

router.get('/posts/:id/answer',isAuthenticated,(req,res)=>{
    Post.findById(req.params.id,(err,data)=>{
        if(!err){
            res.render('answers/new',{Posts: data,id: req.params.id});
        }else{
            res.send("OOPS!!!")
        }
    })
})

router.get('/posts',(req,res)=>{
    Post.find({}).sort({"ratings":'desc'}).exec((err,data)=>{
        if(!err){
            res.render('Posts/index',{Posts: data});
        }else{
            res.send("OOPS!!");
        }
    })
})

router.get("/posts/search",(req,res)=>{    
    Post.find({$text: {$search: req.query.q}}).sort({score:{$meta: "textScore"}}).exec((err,sResults)=>{    
        console.log(sResults,err);
        res.render("search/result",{Posts:sResults});
    })
})


router.get('/posts/:id',async(req,res)=>{
    let isRated = true;
    if(req.user)
        await Post.findOne({_id: req.params.id, ratedby:{$in: [req.user._id]}},(err,data)=>{
            if(!err&&!data){
                isRated = false; 
            }else{
                isRated = true;
            }
        })

    Post.findById(req.params.id,(err,foundPost)=>{    
        if(!err){
            res.render('Posts/show',{Posts: foundPost,isRated: isRated});
        }else{
            res.send("OOPS!")
        }
    })
})

router.post('/posts',isAuthenticated,(req,res)=>{
    Post.create(req.body.Post,(err,newPost)=>{
        if(!err){
            newPost.author.id = req.user._id;
            newPost.author.authorname = req.user.username;
            newPost.save();
            // console.log(newPost);
            res.redirect('/posts');
        }else{
            res.send("OOPS!!")
        }
    })
})

router.post('/posts/:id',isAuthenticated,(req,res)=>{
    Post.create(req.body.Post,(err,newPost)=>{
        if(!err){
            console.log(newPost);
            Post.findById(req.params.id,(err,fP)=>{
                if(!err){
                    if(newPost.title.length>2 && newPost.title.slice(0,2) != "@ "){
                        newPost.title = "@ "+newPost.title;
                        newPost.save();
                    }
                    newPost.parent = req.params.id;
                    newPost.author.id = req.user._id;
                    newPost.author.authorname = req.user.username;
                    newPost.save();
                    fP.references.push(newPost);
                    fP.save();
                    // console.log(fP);
                    res.redirect('/posts');
                }else{
                    res.send("OOPS!!!");
                }
            })
        }else{
            res.send("OOPS!!")
        }
    })
})

router.post('/:id/ratings',isAuthenticated,(req,res)=>{

    Post.findById(req.params.id,(err,foundPost)=>{
        if(!err){
            try{
                foundPost.ratedby.push(req.user._id);
                foundPost.ratings = Number(req.body.rating) + Number(foundPost.ratings);
                foundPost.visits += 1;
                foundPost.save();
                // console.log(req.body.rating,foundPost.ratings.rates);
                // console.log(foundPost);
                res.redirect('/posts');
            }catch{
                res.send("OOPS!!")
            }
            
        }else{
            res.send("OOPS!!")
        }
    })
})

router.get('/:id/answers',(req,res)=>{
    Post.findById(req.params.id).populate("references").exec((err,foundPost)=>{
        if(!err){
            console.log(foundPost.references)
            res.render("answers/index",{Posts : foundPost.references})
        }else{
            res.send("OOPS!!")
        }
    })
})

router.post('/posts/:id/delete',isAuthenticated,checkPostOwnership,(req,res)=>{
    Post.findById(req.params.id).exec((err,fP)=>{
        if(!err){
            // console.log(fP.parent);
            Post.findByIdAndUpdate(fP.parent,{$pull: {references:{$in : [req.params.id]}}},{'new': true}).exec((err,data)=>{
                // console.log(data.references)
            })
        }
    })
    
    Post.findByIdAndRemove(req.params.id,(err)=>{
        if(!err){          
            res.redirect("/posts")
        }else{
            res.send("OOPS!!")
        }
    })
})

router.get('/posts/:id/edit',isAuthenticated,checkPostOwnership,(req,res)=>{
    Post.findById(req.params.id,(err,foundPost)=>{
        if(!err){
            res.render('Posts/edit',{Posts: foundPost});
        }else{
            res.send("OOPS!!")
        }
    })
})

router.post('/posts/:id/edit',isAuthenticated,checkPostOwnership,(req,res)=>{
    Post.findByIdAndUpdate(req.params.id,req.body.Post,(err,Post)=>{
        if(!err){
            console.log(req.params.id);
            res.redirect(`/Posts/${req.params.id}`);
        }else{
            res.send("OOPS!!")
        }
    })
})



module.exports =  router;