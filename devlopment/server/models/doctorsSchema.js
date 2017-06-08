var mongoose = require('mongoose');
var schema = mongoose.Schema;


var doctorsSchema = new schema({
  Entity: {type:String},
  name: {type:String},
  Expertise : {type:String},
  HMO: {type:String},
  Address: {type:String},
  reception_hours: [],
  lat: {type:Number},
  lng: {type:Number},
  Ranking : {type:Number},
  LastUpdate:{type:String},
  //Credibility:{type:Number}
  totaNumlRank:{type:Number},
  myNumRank:{type:Number}
},{collection: 'doctorsLocation'});


var doc = mongoose.model('doc', doctorsSchema);
module.exports = doc;