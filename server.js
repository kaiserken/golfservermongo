var express = require('express');
var app  = express();
var mongoose  = require('mongoose');
var bodyParser = require('body-parser');
var secret = require('./config/secret');
var User  = require('./models/user');
var Course  = require('./models/course');

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

// sign up new user
app.post('/signup', function(req, res){
  var user  = new User();
  user.name  = req.body.name;
  user.email  = req.body.email;
  user.password  = req.body.password;

  User.findOne({email: req.body.email.toLowerCase()}, function(err, existingUser){
    if (existingUser){
      console.log("Account with that email already exists");
      return res.send("Account with that email already exists");
    } else {
      user.save(function(err, user){
        if (err) return (err);
        res.json(user);
      });
    }
  });
});

// sign in and verify user password
app.post('/signin', function(req, res){
  User.findOne({ email: req.body.email.toLowerCase()}, function(err, user){
    if (err) return (err);

    if (!user) {
      console.log("Not Found");
      return res.send("Not Found");
    }
    if (!user.comparePassword(req.body.password)){
      console.log("Wrong Password");
      return res.send("Wrong Password");
    }
    res.json(user);
  });
});

// add favorite course to existing user
app.post('/addfavorite', function(req, res){
  User.findOneAndUpdate({ email: req.body.email.toLowerCase()}, {$push:{favorites: req.body.coursename}} , function(err, user){
    if (err){
      console.log(err);
      return;
    }

    if (!user){
      console.log("User Not Found");
      return res.redirect("/");
    }
    res.json(user);
  });
});

app.post('/addresults', function(req, res){
  User.findOneAndUpdate({ email: req.body.email.toLowerCase()}, {$push:{winnings: req.body.betresult, scores: req.body.score}} , function(err, user){
    if (err){
      console.log(err);
      return;
    }

    if (!user){
      console.log("User Not Found");
      return res.redirect("/");
    }
    res.json(user);
  });
});



// add course to database
app.post('/createcourse', function(req, res){
  var course  = new Course();
  course.coursename  = req.body.name;
  course.city  = req.body.city;
  course.state  = req.body.state;
  course.coursepar = req.body.par;
  course.coursehcp  = req.body.handicap;

  Course.findOne({coursename: req.body.name}, function(err, existingCourse){
    if (existingCourse){
      console.log("Course already exists");
      return res.redirect("/");
    } else {
      course.save(function(err, course){
        if (err) return (err);
        res.json(course);
      });
    }
  });
});
// find courses by city
app.post('/coursecity', function(req, res){
  Course.find({city: req.body.city}, function(err, course){
    if (err){
     console.log(err);
     return;
    }
    if (!course) {
      console.log("No Courses Found");
      return res.redirect("/");
    }
    res.json(course);
  });
});

// find courses by Name
app.post('/courseinfo', function(req, res){
  Course.find({coursename: req.body.coursename}, function(err, course){
    if (err){
     console.log(err);
     return;
    }
    if (!course) {
      console.log("No Courses Found");
      return res.redirect("/");
    }
    res.json(course);
  });
});




app.listen(secret.port, function(err){
  if (err) throw err;
  console.log('Server is running!');
});
