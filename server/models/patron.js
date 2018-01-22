var mongoose = require('mongoose');

var patronSchema = mongoose.Schema({
  userid: String,
  date: { type: Date, default: Date.now },
  visit: {
    date:  String,
    location: String,
    username: String
  }
});

module.exports = mongoose.model('Patron', patronSchema);