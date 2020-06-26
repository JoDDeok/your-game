var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

// login시에 DB에서 발견한 user의 id를 session에 저장
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// request시 user정보를 DB에서 새로 받아옴
passport.deserializeUser(function(id, done) {
  User.findOne({_id:id}, function(err, user) {
    done(err, user);
  });
});

// local strategy
passport.use('local-login',
  new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, username, password, done) { // Login시에 호출되는 함수
      User.findOne({username:username}) // DB에서 해당 user를 찾음
        .select({password:1})
        .exec(function(err, user) {
          if (err) return done(err);

          if (user && user.authenticate(password)){ // user model에서 설정한 user.authenticate 함수를 이용해 입력받은 password와 저장된 password hash를 비교
            return done(null, user); // 값이 일치하면 해당 user를 done에 담아서 return
          }
          else { // 일치하지 않는 경우 에러 flash 생성 후 done에 false를 담아서 return
            req.flash('username', username);
            req.flash('errors', {login:'The username or password is incorrect.'});
            return done(null, false);
          }
        });
    }
  )
);

module.exports = passport;
