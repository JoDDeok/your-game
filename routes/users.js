var express = require('express');
var router = express.Router();
var User = require('../models/User');
var util = require('../util');

// New ('/new'에 get 요청이 오는 경우)
router.get('/new', function(req, res){
  var user = req.flash('user')[0] || {};
  var errors = req.flash('errors')[0] || {};
  res.render('users/new', { user:user, errors:errors }); // 회원가입 페이지로 이동
});

// create ('/'에 post 요청이 오는 경우)
router.post('/', function(req, res){
  User.create(req.body, function(err, user){ // DB에 data 생성
    if(err){ // 에러 발생 시 에러 flash 생성 및 회원가입 페이지로 이동
      req.flash('user', req.body);
      req.flash('errors', util.parseError(err));
      return res.redirect('/users/new');
    }
    res.redirect('/login'); // 로그인 페이지로 이동
  });
});

// update (회원정보 수정 기능, user db의 game과 gameURL 부분을 설문 결과의 게임으로 바꿔줍니다.)
router.put('/:username', util.isLoggedin, checkPermission, function(req, res, next){
  User.findOne({username:req.params.username}) // db에서 해당 user 정보를 찾음
    .select('game')
    .exec(function(err, user){
      if(err) return res.json(err);

      // update user object (전달받은 게임정보를 DB에서 읽어온 user data에 덮어씀)
      user.game = req.body.gameName;
      user.gameURL = req.body.gameURL;
      for(var p in req.body){
        user[p] = req.body[p];
      }

      // save updated user (db에 업데이트된 유저 정보 저장)
      user.save(function(err, user){
        if(err){ // 에러 발생 시 에러 flash 생성 및 설문 페이지로 이동
          req.flash('user', req.body);
          req.flash('errors', util.parseError(err));
          return res.redirect('/surveys/survey');
        }
        res.redirect('/surveys/result/?resultGame=' + req.body.gameName); // 설문 결과 페이지로 이동
      });
  });
});

module.exports = router;

// 해당 user의 id와 로그인된 user.id를 비교해 같은 경우에만 계속 진행하고 다르면 util.noPermission 함수 호출
function checkPermission(req, res, next){
  User.findOne({username:req.params.username}, function(err, user){
    if(err) return res.json(err);
    if(user.id != req.user.id) return util.noPermission(req, res);

    next();
  });
}
