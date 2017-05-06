var mongoose = require('mongoose');
var schema = mongoose.Schema;


var gerenalSchema = new schema({
  idDoc: {type:Number},
  MyLocation : {type:String},
  Expertise: {type:String},
  HMO: {type:String},
  Tags: {type:[String]},
  name: {type:String},
  Info: {type:String},
  Ranking: {type:Number}
},{collection: 'general'});


var gen = mongoose.model('gen', gerenalSchema);
module.exports = gen;