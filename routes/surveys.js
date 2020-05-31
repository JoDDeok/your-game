var express = require('express');
var router = express.Router();
var util = require('../util');

// Surveys
router.get('/', function(req, res){
  res.render('surveys/survey');
});

// Survey Result
router.get('/result', function(req, res){
  res.render('surveys/survey-result');
});

module.exports = router;
