var mongoose = require('mongoose');
var schema = mongoose.Schema;


var notificationSchema = new schema({
  email: {type:String},
  Recommendation : {type:String},
  dateNoti: {type:Date},
  repeat: {type:Number}
},{collection: 'noti'});


var myNoti = mongoose.model('myNoti', notificationSchema);
module.exports = myNoti;