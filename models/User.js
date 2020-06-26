var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// 유저 schema
var userSchema = mongoose.Schema({
  username:{
    type:String,
    required:[true,'Username is required!'],
    match:[/^.{4,12}$/,'Should be 4-12 characters!'],
    trim:true,
    unique:true
  },
  password:{
    type:String,
    required:[true,'Password is required!'],
    select:false
  },
  game:{type:String, default:'나만의 게임'},
  gameURL:{type:String, default:'/surveys'},
},{
  toObject:{virtuals:true}
});

// virtuals (회원가입시에 필요한 정보이지만 db에는 저장될 필요가 없기에 virtual 사용)
userSchema.virtual('passwordConfirmation')
  .get(function(){ return this._passwordConfirmation; })
  .set(function(value){ this._passwordConfirmation=value; });

// password validation (password를 DB에 생성, 수정하기 전에 값이 유효한지 확인)
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = 'Should be minimum 8 characters of alphabet and number combination!';
userSchema.path('password').validate(function(v) {
  var user = this;

  // create user (회원가입시 예외처리들)
  if(user.isNew){
    if(!user.passwordConfirmation){
      user.invalidate('passwordConfirmation', 'Password Confirmation is required.');
    }

    if(!passwordRegex.test(user.password)){
      user.invalidate('password', passwordRegexErrorMessage);
    }
    else if(user.password !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }

  // update user (유저 정보 수정시 에러들)
  if(!user.isNew){

  }
});

// hash password
userSchema.pre('save', function (next){
  var user = this;
  if(!user.isModified('password')){
    return next();
  }
  else {
    user.password = bcrypt.hashSync(user.password); // password를 hash값으로 바꿈
    return next();
  }
});

// model methods (user model의 password hash와 입력받은 password text를 비교하는 method)
userSchema.methods.authenticate = function (password) {
  var user = this;
  return bcrypt.compareSync(password,user.password);
};

// model & export
var User = mongoose.model('user',userSchema);
module.exports = User;
