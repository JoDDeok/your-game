var express = require('express');
var router = express.Router();
var Game = require('../models/Game');
var util = require('../util');

// Survey - 1 (첫 번째 설문 페이지)
router.get('/', function(req, res){
  res.render('surveys/survey-1');
});

// Survey - 2 (두 번째 설문 페이지)
router.get('/survey-2', function(req, res){
  var type = req.query.type;

  res.render('surveys/survey-2', {
    type:type
  });
});

// Survey - 3 (세 번째 설문 페이지)
router.get('/survey-3', function(req, res){
  var type = req.query.type;

  res.render('surveys/survey-3', {
    type:type
  });
});

// Survey Result (설문 결과 페이지, 비동기 형식으로 game DB에서 해당 게임을 찾아옴)
router.get('/result', async function(req, res){
  var game = await Game.findOne({name:req.query.resultGame})
    .exec();

  res.render('surveys/survey-result', { // 설문 결과 페이지에 해당 게임 정보들 전달
    game:game
  });
});

module.exports = router;
