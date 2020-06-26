var util = {};

util.parseError = function(errors){
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  }
  else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message:'This username already exists!' };
  }
  else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}

// 사용자의 로그인 여부를 확인하는 기능
util.isLoggedin = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  }
  else { // 로그인이 되어있지 않을 경우 에러 메세지와 함께 로그인 페이지로 이동
    req.flash('errors', {login:'Please login first'});
    res.redirect('/login');
  }
}

// route에 접근권한이 없다고 판단된 경우에 호출
util.noPermission = function(req, res){ // 헤어 메세지와 함께 로그인 페이지로 이동
  req.flash('errors', {login:"You don't have permission"});
  req.logout();
  res.redirect('/login');
}

module.exports = util;
