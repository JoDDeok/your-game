var express = require('express');
var router = express.Router();
var Game = require('../models/Game');
var util = require('../util');

// Survey - 1
router.get('/', function(req, res){
  res.render('surveys/survey-1');
});

// Survey - 2
router.get('/survey-2', function(req, res){
  var type = req.query.type;

  res.render('surveys/survey-2', {
    type:type
  });
});

// Survey - 3
router.get('/survey-3', function(req, res){
  var type = req.query.type;

  res.render('surveys/survey-3', {
    type:type
  });
});

// Survey Result
router.get('/result', async function(req, res){
  var game = await Game.findOne({name:req.query.resultGame})
    .exec();

  res.render('surveys/survey-result', {
    game:game
  });
});

module.exports = router;
