#!/usr/bin/env node
var mongoose = require('mongoose');
var myNoti = require('./models/notificationSchema');

function sendMail()
{
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

  myNoti.find({},function(err, docs){
    console.log("in the find function");
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
        today.setDate(today.getDate() + Number(docs[i].repeat));
        newupdate = new Date(today);
        notifi.update({email: email,Recommendation: recommendation},{dateNoti: newupdate}, 
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
  console.log("sending email");
  sendmail({
    from: 'mymedicalpro@gmail.com',
    to: email,
    subject: 'Notification from my medical',
    html: recommendation,
  }, function(err, reply) {
      console.log(err && err.stack);
      console.dir(reply);
    });
}


sendMail();