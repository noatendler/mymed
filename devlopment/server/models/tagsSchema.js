var mongoose = require('mongoose');
var schema = mongoose.Schema;


var tagSchema = new schema({
  name: {type:String}
},{collection: 'tags'});


var getTags = mongoose.model('getTags', tagSchema);
module.exports = getTags;