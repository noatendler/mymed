var mongoose = require('mongoose');
var schema = mongoose.Schema;


var usersSchema = new schema({
  email: {type:String},
  userName:{type:String},
  pass:{type:String},
  key:{type:String},
  permission:[]
},{collection: 'users'});


var user = mongoose.model('user', usersSchema);
module.exports = user;