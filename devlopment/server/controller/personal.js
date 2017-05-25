var mongoose = require('mongoose'),
personal = require('../models/personalSchema');
var fs = require('fs')
    , knox = require('knox');
var mime = require('mime');
var user = require('../models/usersSchema');
var taginsert = require('../models/userTagSchema');
var ImageResize = require('node-image-resize');
var notifi = require('../models/notificationSchema');
var data = require('../details/date.json');
var moment = require('moment');
var sendmail = require('sendmail')();



exports.updatePersonal = function(req,res)
{
  personal.update({email: req.body.email, Info: req.body.oldInfo, Recommendation: req.body.oldRec, Title: req.body.oldTitle},{Tags: req.body.Tags, Info: req.body.Info, Recommendation:req.body.Recommendation, Title: req.body.Title,myDate:req.body.myDate}, {multi: true}, 
        function(err, num) {
          if(err)
            console.log(err);
          else
            console.log("updated "+num);
        }); 
  //console.log(req.body);

}

exports.getData = function(req, res){
        personal.find({},function(err, docs){
          //console.log("docs "+docs);
          res.json(docs);
    });
};

var client = knox.createClient({
    key: 'AKIAJEGUYTCV6V5XQFZA'
    , secret: '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'
    , bucket: 'mymedicalshenkar'
});

function hasher(){
    var AUID = [],
        CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    for (var i = 0; i < 6; i++) {
      AUID.push(CHARS[Math.floor(Math.random()*62)]);
    }
    return AUID.join('');
};

var usertags =0;
var checkfile=0;
var checktags = 0;
var myfile;
var checkReq=0;
var mytags;
var myemail;
var tempDate=null;
var saved=0;

exports.saveData=function(request, response){

checkReq++;

  console.log("i am definding date "+request.body.myDate);



if(typeof(request.files)==="undefined"){
  checkfile=0;
}
else{
  if(request.files.file.originalFilename==='')
    checkfile=0;
  else{
    checkfile=1;
    myfile = request.files.file;
  }
}
if(JSON.stringify(request.body.Tags)!=null){
  checktags=1;
  mytags=request.body.Tags;
  myemail= request.body.email;
  tempDate = request.body.myDate;

}
console.log("checkfile" + checkfile);
console.log("checktags" + checktags);

if(checkReq===2 && checkfile===0)
{
  console.log("save only my data no file");
  console.log("Date"+tempDate); 
  var savePersonal = new personal({
                email : myemail,
                Tags : mytags,
                Title: request.body.Title,
                Info: request.body.Info,
                Category: request.body.Category,
                file: "none",
                Recommendation:request.body.Recommendation,
                myDate:tempDate
              });
              savePersonal.save(function(error, result) {
                
                if (error) {
                  console.error(error);
                } else {
                  console.log("save");
                  //response.status(200).json({"res":"save"}); 
                    
                }
              })
  checkfile=0;
  checktags=0;
}
if( checkfile===1 && checktags===1)
{
  console.log("save all data");
  console.log("Date"+tempDate); 
  //console.log("file"+ myfile);  
    var hash = hasher();
    var stream = fs.createReadStream(myfile.path);
    var mimetype = mime.lookup(myfile.path);
    var req;
        if (mimetype.localeCompare('image/jpeg')
        || mimetype.localeCompare('image/pjpeg')
        || mimetype.localeCompare('image/png')
        || mimetype.localeCompare('image/gif')) {

        req = client.putStream(stream, hash+'.jpeg',
            {
                'Content-Type': mimetype,
                'Cache-Control': 'max-age=604800',
                'x-amz-acl': 'public-read',
                'Content-Length': myfile.size
            },
            function(err, result) {
             var savePersonal = new personal({
                email : myemail,
                Tags : mytags,
                Title: request.body.Title,
                Info: request.body.Info,
                Category:request.body.Category,
                file: req.url,
                Recommendation:request.body.Recommendation,
                myDate:tempDate

              });
              savePersonal.save(function(error, result) {
                if (error) {
                  console.error(error);
                } else {
                  console.log("save");
                  //response.redirect('http://localhost:8080/getPrivateData.html');
                  
                }
              })
          });
       } else {
            console.log(err);
        }


  checkfile=0;
  checktags=0;
  }
   
  if(usertags == 0)
  {
    taginsert.find({email: myemail}, function(err, docsTags){
      var tagtemp = [];

      for(var t=0; t<docsTags.length; t++)
      {
        for(var k=0; k<(docsTags[t].tags).length ; k++)
        {
          //console.log(docsTags[t].tags[k].name);
          tagtemp.push(docsTags[t].tags[k].name);
        }
      }

      //console.log(tagtemp);
      
     
        for(var j=0; j<(mytags).length ; j++)
        {
          //console.log( ((tagtemp).indexOf(mytags[j].name) != -1));
          if(!((tagtemp).indexOf(mytags[j].name) != -1))
          {
            taginsert.findOneAndUpdate(
            {email:myemail},
            {$push: {"tags": {name: mytags[j].name}}},
            {safe: true, upsert: true},
            function(err, model) {
              if(err)
                console.log(err);
            });
          }
        }
    });
    usertags++;
  }
  response.json("sucess");
}


exports.addInfoNoTags = function(request, response){
  console.log("save data no tags, date, permission");

    var hash = hasher();
    var myfile = request.files.file;

    var stream = fs.createReadStream(myfile.path);
    var mimetype = mime.lookup(myfile.path);
    var req;
        if (mimetype.localeCompare('image/jpeg')
        || mimetype.localeCompare('image/pjpeg')
        || mimetype.localeCompare('image/png')
        || mimetype.localeCompare('image/gif')) {

        req = client.putStream(stream, hash+'.jpeg',
            {
                'Content-Type': mimetype,
                'Cache-Control': 'max-age=604800',
                'x-amz-acl': 'public-read',
                'Content-Length': myfile.size
            },
            function(err, result) {
             var savePersonal = new personal({
                email : request.body.email,
                Tags : [],
                Title: request.body.Title,
                Info: request.body.Info,
                Category:request.body.Category,
                file: req.url,
                Recommendation:request.body.Recommendation,
                myDate: request.body.mydate
              });
              savePersonal.save(function(error, result) {
                if (error) {
                  console.error(error);
                } else {
                  console.log("save");
                  response.redirect('http://localhost:8080/insertTagsPermission.html');
                  //response.json("save");
                }
              })
          });
       } else {
            console.log(err);
        }
}

exports.addTagPer = function(req, res){
 // console.log(req.body);
  var mydata = JSON.parse(JSON.stringify(data));
  var myKeys = Object.keys(mydata);
  //var myValue = Object.values(mydata);
  var dateFormats = {
  "iso_int" : "YYYY-MM-DD",
  "short_date" : "DD/MM/YYYY",
  "date_regular": "DD-MM-YYYY",
  "date_dots": "DD.MM.YYYY",
  "date_yearDOt":"DD.MM.YY",
  "date_2": "DD-MM-YY",
  "date_3":"DD/MM/YY"
  }

  function getFormat(d){
    for (var prop in dateFormats) {
          if(moment(d, dateFormats[prop],true).isValid()){
             return dateFormats[prop];
          }
    }
    return null;
  }

  var dateTime = [];
  //the recommendation analyze
  var recommendation = req.body.Recommendation;
  var splitToArray = recommendation.split(" ");
  var formatFound;


  for(var j=0; j<splitToArray.length; j++)
  {
    for(var i=0; i<myKeys.length ; i++)
    {
      if(myKeys[i] == splitToArray[j])
      {
        dateTime.push(mydata[myKeys[i]]);
        //console.log("added "+splitToArray[j]+" "+mydata[myKeys[i]]);
      }
    }
      formatFound = getFormat(splitToArray[j]); //returns "YYYY-MM-DDTHH:MM:SS"
      if(formatFound !==null)
      {
         dateTime.push(splitToArray[j]);
         //console.log("added "+splitToArray[j]);
      }
      if(!isNaN(splitToArray[j]))
      {
        dateTime.push(Number(splitToArray[j]));
        //console.log("added "+splitToArray[j]+" "+mydata[myKeys[i]]);
      } 
  }

var getDateNoti=0;

console.log(dateTime);
for(var k=0; k<dateTime.length; k++)
{
  if(getFormat(dateTime[k])!==null)
  {
      getDateNoti = dateTime[k];
      break;
  }
  else if(dateTime.length == 1)
  {
    getDateNoti = dateTime[k];
    break;
  }
  else if(dateTime[k] == 'every')
  {
    getDateNoti = 'every'+dateTime[k+1];
    break;
  }
  else
  {
    getDateNoti+=  dateTime[k++] * dateTime[k++]; 

  }
}

console.log(getDateNoti);


  var tagsName=[];
  var per = [];
  var myemail = req.body.email;

  for(var i=0; i<req.body.Tags.length; i++)
  {
    //console.log(req.body.Tags[i].name);
    tagsName.push({name:req.body.Tags[i].name});
  }
  for(var j=0; j<req.body.Permission.length; j++)
  {
   per.push({perEmail: req.body.Permission[j]});
  }
  personal.update({email: req.body.email, Info: req.body.Info, Recommendation: req.body.Recommendation, Title: req.body.Title, myDate:req.body.mydate},{Tags: tagsName, permission:per}, 
    function(err, num) {
      if(err)
        console.log(err);
      else
        console.log("updated"+num);
    });

  taginsert.find({email: myemail}, function(err, docsTags){
    var tagtemp = [];
    if(docsTags.length == 0)
    {
      var saveTag = new taginsert({
          email: myemail,
          tags: tagsName
      });
      saveTag.save(function(error, result) {
        if (error) {
          console.error(error);
        } else {
          console.log("save");
        }
      });
    }
    else{
      var tagtemp = [];
      for(var t=0; t<docsTags.length; t++)
      {
        for(var k=0; k<(docsTags[t].tags).length ; k++)
        {
          //console.log(docsTags[t].tags[k].name);
          tagtemp.push(docsTags[t].tags[k].name);
        }
      }
      //console.log(tagtemp); 

    for(var j=0; j<(tagsName).length ; j++)
    {
          //console.log( ((tagtemp).indexOf(mytags[j].name) != -1));
          if(!((tagtemp).indexOf(tagsName[j].name) != -1))
          {
            taginsert.findOneAndUpdate(
            {email:myemail},
            {$push: {"tags": {name: tagsName[j].name}}},
            {safe: true, upsert: true},
            function(err, model) {
              if(err)
                console.log(err);
            });
          }
        }
      }

      res.json({"date":getDateNoti});
    });


}

exports.delInfo = function(req, res){
    personal.remove({email:req.body.email,Title:req.body.Title,Info:req.body.Info,Category:req.body.Category,Recommendation:req.body.Recommendation,myDate:req.body.myDate},function(err, docs){
          // console.log("docs "+docs);
          // res.json(docs);
      if(err){
        console.log(err);
      }
      else{
        console.log("success");
      }
    });
// console.log("$$$$$$$$$$$$$$$$$$$$$$$$");
// console.log(req.body);
}

exports.personalTags = function(req, res){
  taginsert.find({email:req.body.email},function(err, docs){
    //console.log("docs "+docs);
    res.json(docs);
  });
}

exports.removeTag = function(req, res)
{
  
  personal.find({email:req.body.email}, function(err, doc){
  //var jsonDoc=JSON.stringify(doc);
  console.log(doc.length);
  for(var j=0; j<doc.length; j++)
  {
    //var jsonDoc =JSON.stringify(doc);
    var newTags = [];
    var oldTags= doc[j].Tags;
    console.log(oldTags);

     for(var i=0; i<oldTags.length; i++){
      //console.log(oldTags[i].name);
        if(oldTags[i].name != req.body.tag)
          newTags.push(oldTags[i]);
      }
      for(var x=0; x<newTags.length; x++)
        console.log(newTags[x].name);

      personal.update({email: doc[j].email, Info: doc[j].Info, Recommendation: doc[j].Recommendation, Title: doc[j].Title},{Tags: newTags}, {multi: true}, 
        function(err, num) {
          if(err)
            console.log(err);
          else
            console.log("updated "+num);
        });
          
  }



});
  //console.log(req.body);
  taginsert.update({email:req.body.email}
  , { "$pull": { "tags": { "name": req.body.tag } } }
  , { safe: true }, function(err, obj) {
    if(err)
      console.log(err);
    else
      console.log("success");
  });

}

exports.saveNotification = function(req, res)
{
  console.log(req.body);
    var saveMyNoti = new notifi({
          email: req.body.email,
          Recommendation : req.body.Recommendation,
          dateNoti : req.body.dateNoti,
          repeat: req.body.repeat
      });
      saveMyNoti.save(function(error, result) {
        if (error) {
          console.error(error);
        } else {
          console.log("save");
        }
      });
}
/*
exports.sendEmail = function(req , res)
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
  today = dd+'/'+mm+'/'+yyyy;

  notifi.find({}, function(err, docs){
    for(var i=0; i<docs.length; i++)
    {
      email = docs[i].email;
      Recommendation = docs[i].Recommendation;
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
    
      if(today === tempDate)
      {
          console.log("sending email");
          sendmail({
              from: 'mymedicalpro@gmail.com',
              to: email,
              subject: 'Notification from my medical',
              html: Recommendation,
            }, function(err, reply) {
              console.log(err && err.stack);
              console.dir(reply);
          });
      }
    }
  });
}
*/