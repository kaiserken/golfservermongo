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

app.get('/login',  function(req, res){
  res.json("login route is working");
});

app.listen(secret.port, function(err){
  if (err) throw err;
  console.log('Server is running!');
});
