var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var Game = require('../models/Game');
var util = require('../util');


// Home
router.get('/', util.isLoggedin, async function(req, res){
  var searchQuery = createSearchQuery(req.query);

  var count = await Game.countDocuments(searchQuery);
  var games = await Game.find(searchQuery)
    .sort('-platform')
    .exec();

  res.render('home/main', {
    games:games,
    searchText:req.query.searchText,
    searchPlatform:req.query.searchPlatform
  });
});

// Name Search Result
router.get('/search', util.isLoggedin, async function(req, res){
  var searchQuery = createSearchQuery(req.query);

  var count = await Game.countDocuments(searchQuery);
  var games = await Game.find(searchQuery)
    .sort('-platform')
    .exec();

  res.render('home/search-name', {
    games:games,
    searchText:req.query.searchText,
    searchPlatform:req.query.searchPlatform
  });
});

// Platform Search Result
router.get('/platform', util.isLoggedin, async function(req, res){
  var searchQuery = createPlatformSearchQuery(req.query);

  var games = await Game.find(searchQuery)
    .sort('-platform')
    .exec();

  res.render('home/search-platform', {
    games:games,
    searchText:req.query.searchText,
    searchPlatform:req.query.searchPlatform
  });
});

// Login
router.get('/login', function (req,res) {
  var username = req.flash('username')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('home/login', {
    username:username,
    errors:errors
  });
});

// Post Login
router.post('/login',
  function(req,res,next){
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
  passport.authenticate('local-login', {
    successRedirect : '/surveys',
    failureRedirect : '/login'
  }
));

// Logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

module.exports = router;

function createSearchQuery(queries){
  var searchQuery = {};
  if(queries.searchText && queries.searchText.length >= 2){
    var gameQueries = [];

    gameQueries.push({ name: { $regex: new RegExp(queries.searchText, 'i') } });

    if(gameQueries.length > 0) searchQuery = {$or:gameQueries};
  }
  return searchQuery;
}

function createPlatformSearchQuery(queries){
  var searchQuery = {};
  if(queries.searchPlatform){
    var gameQueries = [];

    gameQueries.push({ platform: { $regex: new RegExp(queries.searchPlatform, 'i') } });

    if(gameQueries.length > 0) searchQuery = {$or:gameQueries};
  }
  return searchQuery;
}
