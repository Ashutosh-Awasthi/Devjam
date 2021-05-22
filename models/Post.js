const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    body: String,
    title: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        authorname: String
    },
    references: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ],
    ratings: {
        type: Number,
        default: 0
    },
    visits: {
        type:Number,
        default: 0
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    ratedby: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            unique: true
        }
    ]
});
postSchema.index({body:"text",title:"text","author.authorname":"text"});
module.exports = mongoose.model("post",postSchema);