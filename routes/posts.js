var express  = require('express');
var router = express.Router();
var Post = require('../models/Post');
var util = require('../util');

// Index
router.get('/', util.isLoggedin, async function(req, res){
  var page = Math.max(1, parseInt(req.query.page)); // Query String으로 전달받은 page, limit를 req.query를 통해 읽어옴
  var limit = Math.max(1, parseInt(req.query.limit)); // 1이상의 정수를 받아오기 위해 Math.max, parseInt 사용
  page = !isNaN(page)?page:1; // 정수로 변환될 수 없는 값이 들어오는 경우
  limit = !isNaN(limit)?limit:5; // page, limit의 기본 값 설정


  var skip = (page-1)*limit; // 무시할 게시물의 수를 담는 변수 ex) limit이 5로 설정되어 있으므로 3번째 페이지를 만든다면 DB에서 처음 10개의 게시물을 무시하고 11 ~ 15번째 게시물을 보여줌
  var count = await Post.countDocuments({}); // 전체 게시글의 수, await를 사용하여 해당 작업이 완료될 때까지 다음 코드로 진행하지 않고 기다렸다가 완료되면 값을 반환
  var maxPage = Math.ceil(count/limit); // 전체 페이지 수
  var posts = await Post.find({}) // 전체 게시글
    .populate('author')
    .sort('-createdAt')
    .skip(skip) // 일정한 수 만큼 검색된 결과를 무시 (위의 var skip 설명)
    .limit(limit) // 일정한 수 만큼만 검색된 결과를 보여줌
    .exec();

  // new
  var post = req.flash('post')[0] || {};
  var errors = req.flash('errors')[0] || {};

  res.render('posts/index', {
    // new (새로운 글 생성을 위해 view로 전달)
    post:post,
    errors:errors,

    // index (현재 페이지와 마지막 페이지 번호, 페이지당 보여줄 게시물 수를 view로 전달)
    posts:posts,
    currentPage:page,
    maxPage:maxPage,
    limit:limit
  });
});

// create ('/'에 post 요청이 오는 경우)
router.post('/', util.isLoggedin, function(req, res){
  req.body.author = req.user._id;
  Post.create(req.body, function(err, post){ // DB에 data 생성
    if(err){ // 에러 발생 시 에러 flash 생성
      req.flash('post', req.body);
      req.flash('errors', util.parseError(err));
      return res.redirect('/posts');
    }
    res.redirect('/posts'); // 게시판 페이지로 이동
  });
});

module.exports = router;
