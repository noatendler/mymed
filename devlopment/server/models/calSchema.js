var mongoose = require('mongoose');
var schema = mongoose.Schema;


var calSchema = new schema({
  insertDate:{type:String},
  Entity: {type:String},
  name: {type:String},
  Expertise : {type:String},
  Address: {type:String},
  Attention : {type:Number},
  Professional: {type:Number},
  Availability: {type:Number},
  Atmosphere: {type:Number},
  Recommendation: {type:Number}
},{collection: 'cal'});

var cal = mongoose.model(cal, calSchema);
module.exports = cal;