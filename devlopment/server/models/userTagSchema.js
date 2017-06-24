var mongoose = require('mongoose');
var schema = mongoose.Schema;


var userTagSchema = new schema({
  email: {type:String},
  tags:[],
  Category:[]
},{collection: 'mytags'});


var mytags = mongoose.model('mytags', userTagSchema);
module.exports = mytags;