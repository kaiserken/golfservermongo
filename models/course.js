var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema  = new Schema({
  coursename: String,
  city: String,
  state: String,
  coursepar: [Number],
  coursehcp: [Number],
});

module.exports = mongoose.model("Course", CourseSchema);
