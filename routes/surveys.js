var express = require('express');
var router = express.Router();
var Game = require('../models/Game');
var util = require('../util');

// Surveys
router.get('/', function(req, res){
  res.render('surveys/survey');
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
