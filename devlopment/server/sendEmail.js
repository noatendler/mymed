#!/usr/bin/env node
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var myNoti = require('./models/notificationSchema');
var mongoose = require('mongoose');
var CronJob = require('cron').CronJob;
config = {
    mongoUrl:'mongodb://user:pass@ds133338.mlab.com:33338/mymed1'
};


new CronJob('00  14 * * *', function() {
  console.log('You will see this message every second');
function sendMail()
{
  //The server option auto_reconnect is defaulted to true
var options = {
    server: {
    auto_reconnect:true,
    }
};
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl, options);
db = mongoose.connection;// a global connection variable
// Event handlers for Mongoose
db.on('error', function (err) {
    console.log('Mongoose: Error: ' + err);
});

db.on('open', function() {
    console.log('Mongoose: Connection established');
});

db.on('disconnected', function() {
    console.log('Mongoose: Connection stopped, recconect');
    mongoose.connect(config.mongoUrl, options);
});

db.on('reconnected', function () {
    console.info('Mongoose reconnected!');
});

  var email,Recommendation;
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
    dd='0'+dd
  } 
  if(mm<10) {
    mm='0'+mm
  } 
  var mytoday = dd+'/'+mm+'/'+yyyy;
  console.log(mytoday);

  myNoti.find({},function(err, docs){
    console.log('in the find function');
    for(var i=0; i<docs.length; i++)
    {
      email = docs[i].email;
      recommendation = docs[i].Recommendation;
      var tempDate = new Date(docs[i].dateNoti);
      dd = tempDate.getDate();
      mm = tempDate.getMonth()+1; //January is 0!
      yyyy = tempDate.getFullYear();
      if(dd<10) {
        dd='0'+dd
      } 
      if(mm<10) {
        mm='0'+mm
      } 
      tempDate = dd+'/'+mm+'/'+yyyy;

      if(mytoday === tempDate)
      {
        console.log("i'm in the if!");
        console.log("docs[i].repeat " +docs[i].repeat);
        today.setDate(today.getDate() + Number(docs[i].repeat));
        newupdate = new Date(today);
        myNoti.update({email: email,Recommendation: recommendation},{dateNoti: newupdate}, 
          function(err, num) {
            if(err)
              console.log(err);
            else
              console.log("updated"+num);
        }); 
         
        sendit(email, recommendation)
      }
    }

  });
}

function sendit(email, recommendation)
{
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'mymedicalpro@gmail.com',
        pass: 'mymed123'
    }
});

// setup e-mail data
var mailOptions = {
    from: '"MY MEDICAL " <mymedicalpro@gmail.com>', // sender address (who sends)
    to: email, // receiver
    subject: 'Notification', // Subject line
    text: '', // plaintext body
    html: recommendation
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }

    console.log('Message sent: ' + info.response);
});

}
sendMail();
}, null, true, 'America/Los_Angeles');

