var mongoose = require('mongoose');
var schema = mongoose.Schema;


var personalSchema = new schema({
  email: {type:String},
  Tags : [],
  Title: {type:String},
  Info : {type:String},
  Category : {type : String},
  file: {type: String},
  Recommendation:{type:String},
  myDate: {type:String},
  permission: []
},{collection: 'personal'});


var personal = mongoose.model('personal', personalSchema);
module.exports = personal;