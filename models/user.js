var mongoose  = require('mongoose');
var bcrypt  = require('bcrypt-nodejs');
var Schema  = mongoose.Schema;


var UserSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String,
  name: String,
  favorites: [],
  winnings: [Number],
  scores: [Number],
});

UserSchema.pre('save', function(next){
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt){
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if (err) return next(err);
      user.password  = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword  = function(password){
  return bcrypt.compareSync(password, this.password);
};

module.exports  = mongoose.model('User', UserSchema);
