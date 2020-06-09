var express  = require('express');
var router = express.Router();
var Post = require('../models/Post');
var util = require('../util');

// Index
router.get('/', util.isLoggedin, async function(req, res){
  var page = Math.max(1, parseInt(req.query.page));
  var limit = Math.max(1, parseInt(req.query.limit));
  page = !isNaN(page)?page:1;
  limit = !isNaN(limit)?limit:5;

  var searchQuery = createSearchQuery(req.query);

  var skip = (page-1)*limit;
  var count = await Post.countDocuments(searchQuery);
  var maxPage = Math.ceil(count/limit);
  var posts = await Post.find(searchQuery)
    .populate('author')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .exec();

  // new
  var post = req.flash('post')[0] || {};
  var errors = req.flash('errors')[0] || {};

  res.render('posts/index', {
    // new
    post:post,
    errors:errors,

    // index
    posts:posts,
    currentPage:page,
    maxPage:maxPage,
    limit:limit,
    searchType:req.query.searchType,
    searchText:req.query.searchText
  });
});

// create
router.post('/', util.isLoggedin, function(req, res){
  req.body.author = req.user._id;
  Post.create(req.body, function(err, post){
    if(err){
      req.flash('post', req.body);
      req.flash('errors', util.parseError(err));
      return res.redirect('/posts');
    }
    res.redirect('/posts');
  });
});

module.exports = router;

// private functions
function checkPermission(req, res, next){
  Post.findOne({_id:req.params.id}, function(err, post){
    if(err) return res.json(err);
    if(post.author != req.user.id) return util.noPermission(req, res);

    next();
  });
}

function createSearchQuery(queries){
  var searchQuery = {};
  if(queries.searchType && queries.searchText && queries.searchText.length >= 3){ // 1
    var searchTypes = queries.searchType.toLowerCase().split(',');
    var postQueries = [];
    if(searchTypes.indexOf('title')>=0){
      postQueries.push({ title: { $regex: new RegExp(queries.searchText, 'i') } }); // 2
    }
    if(searchTypes.indexOf('body')>=0){
      postQueries.push({ body: { $regex: new RegExp(queries.searchText, 'i') } });
    }
    if(postQueries.length > 0) searchQuery = {$or:postQueries}; // 3
  }
  return searchQuery;
}
