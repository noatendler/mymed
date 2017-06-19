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
var Sync = require('sync');
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': '6b67cdbd-8e43-48a9-9e80-16f45128caac',
  'password': 'kqUf2M10gsyN',
  'version_date': '2017-02-27'
});


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

 // sendUser.emailAccess = selectUser;
 //        sendUser.emailUser = emailCookie;
exports.getDataByUser = function(req, res){
  var sendData = [];
  console.log(req.body.emailAccess);
  personal.find({email:req.body.emailAccess},function(err, docs){
    for(var i=0; i<docs.length; i++)
    {
      var info = docs[i];
      for(var j=0; j<info.permission.length; j++)
      {
        for(var k=0; k<info.permission[j].length; k++)
        {
          if(info.permission[j][k].perEmail == req.body.emailUser)
          sendData.push(docs[i]);
        }
        
      }
    }
    console.log(sendData);
    res.json(sendData);
    
  });

};


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
      console.log("docsTags" + docsTags);

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
            {$push: {"tags": {name: mytags[j].name, number:1}}},
            {safe: true, upsert: true},
            function(err, model) {
              if(err)
                console.log(err);
            });
          }
          else
          {
           taginsert.find({tags: {$elemMatch: {name: req.body.username}}, email:myemail}, function(error, myTagsDoc){
              if(myTagsDoc.length)
              {
                console.log(myTagsDoc);
              }
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

exports.getTagsFromText= function(req, res)
{
  console.log('in getTagsFromText');
  var parameters = {
  'text': req.body.Recommendation,
  'features': {
    'keywords': {
      'sentiment': true,
      'limit': 5
    }
  }
};
var anaylizeKey;
var getKey = {};

natural_language_understanding.analyze(parameters, function(err, response) {
  if (err)
  {
    console.log('error:', err);
    anaylizeKey= "error";
  }
  else
  {
    var jsonkey = response;
    var allkeys = jsonkey.keywords;
    for(var i=0; i<allkeys.length; i++)
    {
      getKey[i]={"name":allkeys[i].text};
    }
  }
  console.log(getKey);
  res.json(getKey);
});

}

exports.addTagPer = function(req, res){
// var insertPer = [];
// var insertTag = [];

  console.log('in addTagPer');
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
  var tagsNamePersonal=[];
  var per = [];
  var myemail = req.body.email;

  if(typeof(req.body.Tags)!=='undefined')
  {
    for(var i=0; i<req.body.Tags.length; i++)
    {
      //console.log(req.body.Tags[i].name);
      tagsName.push({name:req.body.Tags[i].name, number:1});
      tagsNamePersonal.push({name:req.body.Tags[i].name});
    }
  }
  for(var j=0; j<req.body.Permission.length; j++)
  {
   per.push({perEmail: req.body.Permission[j]});
  }
console.log(tagsName);
console.log(per);
    // personal.findOneAndUpdate(
    // {email: req.body.email, Info: docinfo, Recommendation: docrec, Title: doctitle},
    // {$set: {"Tags": newTags1}},
    // {safe: true},
    // function(err, model) {
    //   if(err)
    //     console.log(err);
    //   else
    //     console.log(model);
    // }); 
    personal.findOneAndUpdate(
    {email: req.body.email, Title:req.body.Title, Info: req.body.Info, myDate: req.body.mydate},
    {$push: {"permission": per, "Tags": tagsNamePersonal}},
    {safe: true},
    function(err, model) {
      if(err)
        console.log(err);
      else
        console.log(model);
    });

//myemail hold coockie email
  taginsert.find({email: myemail}, function(err, docsTags){
    var tagtemp = [];
    //check if not found save new one
    if(docsTags.length == 0)
    {
      //console.log("not fount save new");
      var saveTag = new taginsert({
          email: myemail,
          tags: tagsName
      });
      //console.log("saveTag  " + saveTag);
      saveTag.save(function(error, result) {
        if (error) {
          console.error(error);
        } else {
          console.log("save tags");
        }
      });
    }
    else{
      //already exist get add 1 to number and update
      //var tagtemp = [];
      for(var t=0; t<docsTags.length; t++)
      {
        for(var k=0; k<(docsTags[t].tags).length ; k++)
        {
          //console.log("docsTags[t].tags[k].name " + docsTags[t].tags[k].name);
          tagtemp.push(docsTags[t].tags[k].name);
        }
      }
      //console.log("tagtemp  " + tagtemp); 
//tagtemp include all tags that need to add 1
    for(var j=0; j<(tagsName).length ; j++)
    {
      //console.log("tagsName  " + tagsName[j].name);
          //console.log( ((tagtemp).indexOf(mytags[j].name) != -1));
          if(!((tagtemp).indexOf(tagsName[j].name) != -1))
          {
            //console.log("in the if");
            taginsert.findOneAndUpdate(
            {email:myemail},
            {$push: {"tags": {name: tagsName[j].name, number:1}}},
            {safe: true, upsert: true},
            function(err, model) {
              if(err)
                console.log(err);
            });
          }
          else
          {
            var nameTag = tagsName[j].name;
            //console.log(tagsName[j].name);
            //console.log("in the else");
          Sync(function(){
            taginsert.find({tags: {$elemMatch: {name: tagsName[j].name}}, email:myemail}, function(error, myTagsDoc){
              if(myTagsDoc.length)
              {
                var getNumber;
                for(var k=0; k<myTagsDoc[0].tags.length; k++)
                {
                  if(nameTag === myTagsDoc[0].tags[k].name)
                  {
                    //console.log("goood found a match");
                    getNumber = myTagsDoc[0].tags[k].number;
                    //console.log("---------------");
                    //console.log(myTagsDoc[0].tags[k].name);
                    updateme(myTagsDoc[0].tags[k].name,getNumber+1);
                  }
                }
                function updateme (setTag, setNum){
                //console.log('in the update function');
                  var setTag = {name: setTag, number: setNum};
                  taginsert.findOneAndUpdate({email: myemail, 'tags.name': nameTag}, { $set : { 'tags.$': setTag} },
                  {safe: true, upsert: true},
                  function (err, doc) {
                      if (err) {
                          console.log(err);
                      } else {
                          res.json(doc);
                          console.log('did it');
                      }
                   });
                }

                // taginsert.update({email:myemail,name: nameTag}, {$set: {number:getNumber}},function(err,es1){
                //   if(err)
                //   {
                //     console.log(err);
                //   }
                // });

              //   taginsert.findOneAndUpdate(
              //   {email:myemail, tags: {$elemMatch: {name: nameTag}}},
              //   {$push: {"tags": {name: nameTag, number:getNumber}}},
              //   {safe: true},
              //   function(err, model) {
              //     if(err)
              //       console.log(err);
              // });     
              }
           }); 
           })      
          }
        }
      }
      res.json({"date":getDateNoti});
    });


}

exports.delInfo = function(req, res){

  //  console.log(req.body);
  // var tagDelOne = [];

  // for(var i=0; i<req.body.Tags.length; i++)
  // {
  //   console.log(req.body.Tags[i]);
  //   // for(var j=0; j<req.body.Tags[i].length; j++)
  //   // {
  //    console.log(req.body.Tags[i].name);
  //     tagDelOne.push({name: req.body.Tags[i].name,number:0});
  //   //}
  // }

  // console.log("tagDelOne   " + tagDelOne );
  // console.log("-----------------------");

  

    personal.remove({email:req.body.email,Title:req.body.Title,Info:req.body.Info,Category:req.body.Category,Recommendation:req.body.Recommendation,myDate:req.body.myDate},function(err, docs){
      if(err){
        console.log(err);
      }
      else{
        console.log("success");
      }
    });
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
  console.log("removeTag");
  var newTags1 = [];
  var newTags2 = [];
  console.log(req.body);
  var coockieTag = req.body.tag;
  console.log("------------------------------------");
Sync(function(){
  personal.find({email:req.body.email}, function(err, doc){
    console.log(doc);
  console.log("------------------------------------");
  var docinfo,docrec,doctitle;
  for(var j=0; j<doc.length; j++)
  {
    //console.log("try    " + doc[j].Info);
    doctitle = doc[j].Title;
    docrec = doc[j].Recommendation;
    docinfo = doc[j].Info;
    doctags = doc[j].Tags;
    for(var temp = 0 ; temp < (doc[j].Tags).length ; temp++)
    {
      for(var i=0 ; i<doc[j].Tags[temp].length; i++)
      {
          if(doc[j].Tags[temp][i].name != coockieTag)
          {
            newTags1.push({name:doc[j].Tags[temp][i].name});
            // personal.update({email: req.body.email, Info: docinfo, Recommendation: docrec, Title: doctitle}
            // , { "$pull": { "Tags": { "name": coockieTag } } }
            // , { safe: true }, function(err, obj) {
            //   if(err)
            //     console.log(err);
            //   else
            //     console.log("success remove from personal");
            // });
          }
      }
    }
    console.log(newTags1);
    console.log("********************************************");
    personal.findOneAndUpdate(
    {email: req.body.email, Info: docinfo, Recommendation: docrec, Title: doctitle},
    {$set: {"Tags": newTags1}},
    {safe: true},
    function(err, model) {
      if(err)
        console.log(err);
      else
        console.log(model);
    }); 
  }
});
});
//remove from tags
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
  var myDate = new Date(req.body.dateNoti);
  //addOne.setDate(addOne.getDate());
  //addOne = new Date(addOne);
  console.log(myDate) 
    var saveMyNoti = new notifi({
          email: req.body.email,
          Recommendation : req.body.Recommendation,
          dateNoti : myDate,
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
exports.getAllDocumentByTag = function(req,res)
{
  console.log(req.body);
  console.log("email    " + req.body.email);
  console.log("tag     " + req.body.Tags);
  var tagNameFind = req.body.Tags;
  var resultDoc = [];
  personal.find({email:req.body.email},function(err, docs){
    for(var i=0; i<docs.length; i++)
    {
        //console.log(docs[i].Tags);
        for(var j=0; j<docs[i].Tags.length; j++)
        {
          //console.log(docs[i].Tags[j]);
          for(var t=0; t<docs[i].Tags[j].length; t++)
          {
            //console.log(docs[i].Tags[j][t].name);
            if(docs[i].Tags[j][t].name == tagNameFind)
            {
              //console.log(docs[i]);
              resultDoc.push(docs[i]);
            }
          }
        }
    }
  console.log(resultDoc);
  res.json(resultDoc);
  });
}

//save new tag
exports.addNewTag = function(req,res)
{
 // console.log(req.body);
  var email = req.body.email;
  var tag = req.body.Tags;
console.log("email   " + email + " " + "Tags   " + tag);
  
  for(var i=0; i<tag.length; i++)
  {
    taginsert.findOneAndUpdate(
            {email:email},
            {$push: {"tags": {name: tag[i].name,number:1}}},
            {safe: true, upsert: true},
            function(err, model) {
              if(err)
                console.log(err);
    });
  }
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