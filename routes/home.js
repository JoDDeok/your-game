var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var Game = require('../models/Game');
var util = require('../util');


// Home (메인 페이지, '/'에 get 요청이 오는 경우)
router.get('/', util.isLoggedin, async function(req, res){
  res.render('home/main');
});

// Name Search Result (검색 결과 페이지, 이름으로 검색한 경우)
router.get('/search', util.isLoggedin, async function(req, res){
  var searchQuery = createSearchQuery(req.query); // 이름으로 게임을 찾는 searchQuery 생성

  var games = await Game.find(searchQuery) // db에서 해당 query의 게임을 찾음
    .sort('-platform')
    .exec();

  res.render('home/search-name', { // view에서 검색 form에 현재 검색에 사용한 검색어를 보여줄 수 있게 해당 데이터를 view에 보냄
    games:games,
    searchText:req.query.searchText
  });
});

// Platform Search Result (검색 결과 페이지, 플랫폼 버튼 선택 시)
router.get('/platform', util.isLoggedin, async function(req, res){
  var searchQuery = createPlatformSearchQuery(req.query); // 플랫폼으로 게임을 찾는 searchQuery 생성

  var games = await Game.find(searchQuery) // db에서 해당 query의 게임을 찾음
    .sort('-platform')
    .exec();

  res.render('home/search-platform', { // 검색 결과 및 선택한 플랫폼을 view에 전달
    games:games,
    searchPlatform:req.query.searchPlatform
  });
});

// Login ('/login'에 get 요청이 오는 경우, 로그인 페이지로 이동)
router.get('/login', function (req,res) {
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('home/login', {
    username:username,
    errors:errors
  });
});

// Post Login (login form에서 보내진 post request를 처리해주는 route)
router.post('/login',
  function(req,res,next){ // 보내진 form에서 에러가 있으면 flash를 만들고 로그인 페이지로 돌아감
    var errors = {};
    var isValid = true;

    if(!req.body.username){
      isValid = false;
      errors.username = 'Username is required!';
    }
    if(!req.body.password){
      isValid = false;
      errors.password = 'Password is required!';
    }

    if(isValid){
      next();
    }
    else {
      req.flash('errors',errors);
      res.redirect('/login');
    }
  },
  passport.authenticate('local-login', { // passport local strategy를 호출해서 로그인(authenticate)을 진행
    successRedirect : '/surveys', // 로그인 성공 시 설문 시작 페이지로 이동
    failureRedirect : '/login' // 로그인 실패 시 로그인 페이지로 이동
  }
));

// Logout (logout해주는 route)
router.get('/logout', function(req, res) {
  req.logout(); // passport에서 제공된 req.logout 함수를 사용하여 로그아웃
  res.redirect('/login'); // 로그인 페이지로 이동
});

module.exports = router;

// 이름을 통해 게임을 검색하는 기능
function createSearchQuery(queries){
  var searchQuery = {};
  if(queries.searchText && queries.searchText.length >= 2){ // searchText가 2글자 이상인 경우에만 search query 생성, 이외의 경우에는 {}를 전달하여 모든 게시물 검색
    var gameQueries = [];

    gameQueries.push({ name: { $regex: new RegExp(queries.searchText, 'i') } }); // gameQueries에 해당 이름이 들어가는 게임을 regex 검색으로 찾아 push해줌, 'i' 옵션을 줘서 대소문자를 구별하지 않음

    if(gameQueries.length > 0) searchQuery = {$or:gameQueries};
  }
  return searchQuery;
}

// 전달받은 플랫폼과 같은 게임을 검색하는 기능
function createPlatformSearchQuery(queries){
  var searchQuery = {};
  if(queries.searchPlatform){
    var gameQueries = [];

    gameQueries.push({ platform: { $regex: new RegExp(queries.searchPlatform, 'i') } }); // gameQueries에 해당 플랫폼의 게임을 regex 검색으로 찾아 push해줌, 'i' 옵션을 줘서 대소문자를 구별하지 않음

    if(gameQueries.length > 0) searchQuery = {$or:gameQueries};
  }
  return searchQuery;
}
