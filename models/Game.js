var mongoose = require('mongoose');

// schema
var gameSchema = mongoose.Schema({
  name:{type:String},
  platform:{type:String},
  siteURL:{type:String},
  image:{type:String},
  video:{type:String},
  bgm:{type:String},
});

// model & export
var Game = mongoose.model('game', gameSchema);
module.exports = Game;
