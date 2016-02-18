var express = require('express');
var app  = express();
var mongoose  = require('mongoose');
var bodyParser = require('body-parser');
var secret = require('./config/secret');
var User  = require('./models/user');

mongoose.connect(secret.database, function(err){
  if (err) {
    console.log(err);
  } else {
    console.log("connected to the database");
  }
});

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/',  function(req, res){
  res.send(html);
});

app.post('/signup', function(req, res){
  var user  = new User();
  user.name  = req.body.name;
  user.email  = req.body.email;
  user.password  = req.body.password;

  User.findOne({email: req.body.email}, function(err, existingUser){
    if (existingUser){
      console.log("Account with that email already exists");
      return res.redirect("/");
    } else {
      user.save(function(err, user){
        if (err) return (err);
        res.json(user);
      });
    }
  });
});

app.post('/signin', function(req, res){
  User.findOne({ email: req.body.email}, function(err, user){
    if (err) return done(err);

    if (!user) {
      console.log("Not Found");
      return res.redirect("/");
    }
    if (!user.comparePassword(req.body.password)){
      console.log("Wrong Password");
      return res.redirect("/");
    }
    res.json(user);
  });
});


app.listen(secret.port, function(err){
  if (err) throw err;
  console.log('Server is running!');
});
