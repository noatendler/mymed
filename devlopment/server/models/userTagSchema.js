var mongoose = require('mongoose');
var schema = mongoose.Schema;


var userTagSchema = new schema({
  email: {type:String},
  tags:[]
},{collection: 'mytags'});


var mytags = mongoose.model('mytags', userTagSchema);
module.exports = mytags;