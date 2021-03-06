var mongoose = require('mongoose');

// 게시글 schema
var postSchema = mongoose.Schema({
  body:{type:String, required:[true,'Body is required!']},
  author:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
  createdAt:{type:Date, default:Date.now},
});

// model & export
var Post = mongoose.model('post', postSchema);
module.exports = Post;
