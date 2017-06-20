var mongoose = require('mongoose');
var schema = mongoose.Schema;


var CategorySchema = new schema({
  email: {type:String},
  category : {type: String},
  tags:[]
},{collection: 'categories'});


var category = mongoose.model('category', CategorySchema);
module.exports = category;