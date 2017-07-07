var mongoose = require('mongoose'),
personal = require('../models/personalSchema');
var fs = require('fs')
    , knox = require('knox');
var mime = require('mime');
var user = require('../models/usersSchema');
var taginsert = require('../models/userTagSchema');
var ImageResize = require('node-image-resize');
var myNoti = require('../models/notificationSchema');
var category = require('../models/userCategory');
var data = require('../details/date.json');
var moment = require('moment');
var Sync = require('sync');
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': '6c380536-13b4-4188-b79b-1d2eae6a7e19',
  'password': 'japaBXYA4teX',
  'version_date': '2017-02-27'
});


exports.updatePersonal = function(req,res)
{
  
    var newTags = req.body.Tags;
    var oldTags = req.body.beforeTags;
    var toDel = [];
    var toAdd = [];
    var toArray = [];

    for(var i=0; i<newTags.length; i++)
    {
      toArray.push(newTags[i].name); 
    }
    for(var j=0; j<oldTags.length; j++)
    {
      if(toArray.indexOf(oldTags[j])==-1)
        toDel.push(oldTags[j]);
    }
    for(var j=0; j<toArray.length; j++)
    {
      if(oldTags.indexOf(toArray[j])==-1)
        toAdd.push(toArray[j]);
    }

    var updateTagsPersonal = [];
    taginsert.find({email: req.body.email}, function(err, currentTags){
        for(var i=0; i< currentTags[0].tags.length; i++)
        {
          var tagName = currentTags[0].tags[i].name; 
          var newNum = currentTags[0].tags[i].number;
          var found = 0;

          if(toDel.indexOf(tagName) >-1)
          {
            found=1;
            console.log('found a match to del '+tagName);
            newNum -=1;
            updateTagsPersonal.push({name: tagName, number:newNum});
          }
          else
          {
            if(toAdd.indexOf(tagName) > -1)
            {
              found=1
              console.log('found a match to add EXIST '+tagName);
              newNum +=1;
              updateTagsPersonal.push({name: tagName, number:newNum});
              var myPosition = toAdd.indexOf(tagName);
              toAdd.splice(myPosition,1); 
            }
          }
          if(found==0)
          {
            console.log('ADDING OLD '+tagName);
            updateTagsPersonal.push({name: tagName, number:newNum});
          }

          if(i == currentTags[0].tags.length-1)
          {
            for(var temp=0; temp<toAdd.length; temp++)
            {
              if(updateTagsPersonal.indexOf(toAdd[temp]) == -1)
                updateTagsPersonal.push({name:toAdd[temp], number:1});
            }
          }
        }

  taginsert.update({email: req.body.email},{tags:updateTagsPersonal}, {multi: false}, 
        function(err, num) {
          if(err)
            console.log(err);
          else{
            console.log("updated "+num);
          }
        }); 
  });

  personal.update({email: req.body.email, Info: req.body.oldInfo, Recommendation: req.body.oldRec, Title: req.body.oldTitle},{Tags: req.body.Tags, Info: req.body.Info, Recommendation:req.body.Recommendation, Title: req.body.Title,myDate:req.body.myDate, permission:req.body.Per}, {multi: true}, 
        function(err, num) {
          if(err)
            console.log(err);
          else{
            console.log("updated "+num);
          }
        }); 
 res.json("updated details");
}

exports.getDataByUser = function(req, res){
  var sendData = [];
  console.log(req.body.emailAccess);
  personal.find({email:req.body.emailAccess},function(err, docs){
    for(var i=0; i<docs.length; i++)
    {
      var info = docs[i];
      for(var j=0; j<info.permission.length; j++)
      {

          if(info.permission[j].perEmail == req.body.emailUser)
          sendData.push(docs[i]);        
      }
    }
    console.log(sendData);
    res.json(sendData);
    
  });

};

exports.getData = function(req, res){
  personal.find({},function(err, docs){

          res.json(docs);
  });
};

var client = knox.createClient({
    key: 'key'
    , secret: 'secret'
    , bucket: 'bucket'
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

// checkReq++;

// if(typeof(request.files)==="undefined"){
//   checkfile=0;
// }
// else{
//   if(request.files.file.originalFilename==='')
//     checkfile=0;
//   else{
//     checkfile=1;
//     myfile = request.files.file;
//   }
// }
// if(JSON.stringify(request.body.Tags)!=null){
//   checktags=1;
//   mytags=request.body.Tags;
//   myemail= request.body.email;
//   tempDate = request.body.myDate;

// }


// if(checkReq===2 && checkfile===0)
// { 
//   var savePersonal = new personal({
//                 email : myemail,
//                 Tags : mytags,
//                 Title: request.body.Title,
//                 Info: request.body.Info,
//                 Category: request.body.Category,
//                 file: "none",
//                 Recommendation:request.body.Recommendation,
//                 myDate:tempDate
//               });
//               savePersonal.save(function(error, result) {
                
//                 if (error) {
//                   console.error(error);
//                 } else {
//                   console.log("save");                    
//                 }
//               })
//   checkfile=0;
//   checktags=0;
// }
// if( checkfile===1 && checktags===1)
// { 
//     var hash = hasher();
//     var stream = fs.createReadStream(myfile.path);
//     var mimetype = mime.lookup(myfile.path);
//     var req;
//         if (mimetype.localeCompare('image/jpeg')
//         || mimetype.localeCompare('image/pjpeg')
//         || mimetype.localeCompare('image/png')
//         || mimetype.localeCompare('image/gif')) {

//         req = client.putStream(stream, hash+'.jpeg',
//             {
//                 'Content-Type': mimetype,
//                 'Cache-Control': 'max-age=604800',
//                 'x-amz-acl': 'public-read',
//                 'Content-Length': myfile.size
//             },
//             function(err, result) {
//              var savePersonal = new personal({
//                 email : myemail,
//                 Tags : mytags,
//                 Title: request.body.Title,
//                 Info: request.body.Info,
//                 Category:request.body.Category,
//                 file: req.url,
//                 Recommendation:request.body.Recommendation,
//                 myDate:tempDate

//               });
//               savePersonal.save(function(error, result) {
//                 if (error) {
//                   console.error(error);
//                 } else {
//                   console.log("save");                  
//                 }
//               })
//           });
//        } else {
//             console.log(err);
//         }
//   checkfile=0;
//   checktags=0;
//   }
   
//   if(usertags == 0)
//   {
//     taginsert.find({email: myemail}, function(err, docsTags){
//       var tagtemp = [];

//       for(var t=0; t<docsTags.length; t++)
//       {
//         for(var k=0; k<(docsTags[t].tags).length ; k++)
//         {
//           tagtemp.push(docsTags[t].tags[k].name);
//         }
//       }

//         for(var j=0; j<(mytags).length ; j++)
//         {
//           if(!((tagtemp).indexOf(mytags[j].name) != -1))
//           {
//             taginsert.findOneAndUpdate(
//             {email:myemail},
//             {$push: {"tags": {name: mytags[j].name, number:1}}},
//             {safe: true, upsert: true},
//             function(err, model) {
//               if(err)
//                 console.log(err);
//             });
//           }
//           else
//           {
//            taginsert.find({tags: {$elemMatch: {name: req.body.username}}, email:myemail}, function(error, myTagsDoc){
//               if(myTagsDoc.length)
//               {
//                 console.log(myTagsDoc);
//               }
//            });
//           }

//         }
//     });
//     usertags++;
//   }
//   response.json("sucess");
}


exports.addInfoNoTags = function(request, response){

    var hash = hasher();
    var myfile = request.files.file;

    var stream = fs.createReadStream(myfile.path);
    var mimetype = mime.lookup(myfile.path);

    console.log("request.files.file.size "+request.files.file.size);

    var req;
    
        if (mimetype.localeCompare('image/jpeg')
        || mimetype.localeCompare('image/pjpeg')
        || mimetype.localeCompare('image/png')
        || mimetype.localeCompare('image/gif') ) {

        req = client.putStream(stream, hash+'.jpeg',
            {
                'Content-Type': mimetype,
                'Cache-Control': 'max-age=604800',
                'x-amz-acl': 'public-read',
                'Content-Length': myfile.size
            },
            function(err, result) {
            if(request.files.file.size!==0)
            {
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
            }
            else
            {
                var savePersonal = new personal({
                email : request.body.email,
                Tags : [],
                Title: request.body.Title,
                Info: request.body.Info,
                Category:request.body.Category,
                file: "none",
                Recommendation:request.body.Recommendation,
                myDate: request.body.mydate
              });
            }
              savePersonal.save(function(error, result) {
                if (error) {
                  console.error(error);
                } else {
                  console.log("save");

                  response.redirect('http://localhost:8080/insertTagsPermission.html');
                }
              })
          });
       } else {
            console.log(err);
        }
}

exports.getTagsFromText= function(req, res)
{
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
  console.log("88888888888888888888888888888888");
  console.log("in the addTagPer!!!!!!!!!!!!!!!!!!!");
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
      }
    }
      formatFound = getFormat(splitToArray[j]); //returns "YYYY-MM-DDTHH:MM:SS"
      if(formatFound !==null)
      {
         dateTime.push(splitToArray[j]);
      }
      if(!isNaN(splitToArray[j]))
      {
        dateTime.push(Number(splitToArray[j]));
      } 
  }

var getDateNoti=0;

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

  var tagsName=[];
  var tagsNamePersonal=[];
  var per = [];
  var myemail = req.body.email;
  if(req.body.subTags != "none")
  {
    for(var t=0; t<req.body.subTags.length; t++)
    {
      console.log(req.body.subTags[t]);
      tagsName.push({name:req.body.subTags[t], number:1});
      tagsNamePersonal.push({name:req.body.subTags[t]});
    }
  }
  if(typeof(req.body.Tags)!='undefined')
  {
    for(var i=0; i<req.body.Tags.length; i++)
    {
      tagsName.push({name:req.body.Tags[i].name, number:1});
      tagsNamePersonal.push({name:req.body.Tags[i].name});
    }
  }
  for(var j=0; j<req.body.Permission.length; j++)
  {
   per.push({perEmail: req.body.Permission[j]});
  }
    personal.findOneAndUpdate(
    {email: req.body.email, Title:req.body.Title, Info: req.body.Info, myDate: req.body.mydate},
    {$set: {"permission": per, "Tags": tagsNamePersonal, "Category":req.body.Category}},
    {safe: true},
    function(err, model) {
      if(err)
        console.log(err);
      else
        console.log(model);
    });
    var cat = [];
    if(typeof(req.body.Category) != 'undefined')
    {
      cat = {name:req.body.Category, number:1};
    }

  taginsert.find({email: myemail}, function(err, docsTags){
    var tagtemp = [];
    //check if not found save new one
    if(docsTags.length == 0)
    {
      var saveTag = new taginsert({
          email: myemail,
          tags: tagsName,
          Category: cat
      });
      saveTag.save(function(error, result) {
        if (error) {
          console.error(error);
        } else {
          console.log("save tags");
        }
      });
    }
    else{
      for(var t=0; t<docsTags.length; t++)
      {
        for(var k=0; k<(docsTags[t].tags).length ; k++)
        {
          tagtemp.push(docsTags[t].tags[k].name);
        }
      }

      updateCatNumber=1;
      console.log(docsTags[0].Category);
      for(var temp=0; temp<docsTags[0].Category.length; temp++)
      {
        if(docsTags[0].Category[temp].name == req.body.Category)
        {
          updateCatNumber = docsTags[0].Category[temp].number;
          updateCatNumber +=1;
        }
      }

//tagtemp include all tags that need to add 1
 Sync(function(){
  var addNumTag = [];
    for(var j=0; j<(tagsName).length ; j++)
    {
          if(!((tagtemp).indexOf(tagsName[j].name) != -1))
          {
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
            addNumTag.push(tagsName[j].name);   
          }

        }

          if(updateCatNumber >1)
          {
          var setCat = {name: req.body.Category, number: updateCatNumber};
            taginsert.findOneAndUpdate({email: myemail, 'Category.name': req.body.Category}, { $set : { 'Category.$': setCat} },
              {safe: true},
              function (err, doc) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('updated! :)');
                }
            });
            }
            else
            {
            if(typeof(req.body.Category) != 'undefined'){
            var setCat = {name: req.body.Category, number: 1};
              taginsert.findOneAndUpdate({email: myemail}, { $push : { 'Category': setCat} },
                {safe: true},
                function (err, doc) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('updated! :)');
                  }
              });
              }
            }

        if (addNumTag.length >0)
        {
          taginsert.find({email:myemail}, function(error, myTagsDoc){
              if(myTagsDoc.length){
                for(var i=0; i<myTagsDoc[0].tags.length; i++){
                   if(addNumTag.indexOf(myTagsDoc[0].tags[i].name) != -1){
                    var getNum = myTagsDoc[0].tags[i].number;
                    getNum +=1;
                    updateMe(myTagsDoc[0].tags[i].name, getNum);
                   }
                  }
                }
              });

          function updateMe(updateTag, updateNumber)
          {
            var setTag = {name: updateTag, number: updateNumber};
            taginsert.findOneAndUpdate({email: myemail, 'tags.name': updateTag}, { $set : { 'tags.$': setTag} },
              {safe: true},
              function (err, doc) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('updated! :)');
                }
            });
        }
           
          }
       });
      }
      res.json({"date":getDateNoti});
    });


}

exports.delInfo = function(req, res){

  var tagDelOne = [];

  for(var i=0; i<req.body.Tags.length; i++)
  {
      tagDelOne.push(req.body.Tags[i].name);
  }

  var getNum;
  taginsert.find({email: req.body.email}, function(errorTag, docAllTags){
    if(docAllTags.length){
      for(var k=0; k<docAllTags[0].tags.length; k++){
        if(tagDelOne.indexOf(docAllTags[0].tags[k].name) > -1){
          getNum = docAllTags[0].tags[k].number;
          reduceByOne(getNum, docAllTags[0].tags[k].name);
        }
      };
    }
  });
  function reduceByOne(num, valTag){
    num -=1;
    var setTag = {name:valTag, number:num};
    taginsert.findOneAndUpdate({email: req.body.email, 'tags.name': valTag}, { $set : { 'tags.$': setTag} },
      {safe: true},
      function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log('updated tag --');
        }
    });      
  }
    personal.remove({email:req.body.email,Title:req.body.Title,Info:req.body.Info,Category:req.body.Category,Recommendation:req.body.Recommendation,myDate:req.body.myDate},function(err, docs){

      if(err){
        console.log(err);
      }
      else{
        console.log("success");
      }
    });
    res.json("sucess to remove data");
}
exports.personalTags = function(req, res){

  taginsert.find({email:req.body.email},function(err, docs){
    res.json(docs);
  });
}

exports.removeTag = function(req, res)
{
  var coockieTag = req.body.tag;

Sync(function(){
  personal.find({email:req.body.email}, function(err, doc){
    for(var j=0; j<doc.length; j++)
    {
      for(var i=0; i<doc[j].Tags.length; i++)
      {
        if(doc[j].Tags[i].name == coockieTag)
        {
          removeTagDoc(doc[j], coockieTag);
        }
      }
    }
  })
  function removeTagDoc(mydoc, tag)
  {
     personal.findOneAndUpdate(
      {email:req.body.email, Title:mydoc.Title, Info:mydoc.Info, Recommendation: mydoc.Recommendation, myDate:mydoc.myDate},
      { "$pull": { "Tags": { "name": tag } } },
      { safe: true }, function(err, obj) {
        if(err)
          console.log(err);
        else
          console.log("success");
      });
  }
  //remove from tags
  taginsert.update({email:req.body.email}
  , { "$pull": { "tags": { "name": req.body.tag } } }
  , { safe: true }, function(err, obj) {
    if(err)
      console.log(err);
    else
      console.log("success");
  });
})

}

exports.saveNotification = function(req, res)
{
  console.log("in saveNotification");
//console.log("req.body.dateNoti  " + req.body.dateNoti);
  var myDate = new Date(req.body.dateNoti);
console.log("myDate " + myDate);
console.log("req.body.email "+req.body.email);
console.log("repeat: req.body.repeat "+ req.body.repeat);
  var saveMyNoti = new myNoti({
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
  res.json("save notification");  
}
exports.getAllDocumentByTag = function(req,res)
{
  var tagNameFind = req.body.Tags;
  var resultDoc = [];
  personal.find({email:req.body.email},function(err, docs){
    for(var i=0; i<docs.length; i++)
    {
        for(var j=0; j<docs[i].Tags.length; j++)
        {
            if(docs[i].Tags[j].name == tagNameFind)
            {
               resultDoc.push(docs[i]);
            }
        }
    }
    res.json(resultDoc);
  });

}

//save new tag
exports.addNewTag = function(req,res)
{
  var email = req.body.email;
  var tag = req.body.Tags;
  
  for(var i=0; i<tag.length; i++)
  {
    taginsert.findOneAndUpdate(
            {email:email},
            {$push: {"tags": {name: tag[i].name,number:0}}},
            {safe: true, upsert: true},
            function(err, model) {
              if(err){
                console.log(err);
              }
              else{
                res.json(200);
              }
    });
  }
}

exports.getSubTags = function(req,res)
{
  category.find({email:req.body.email,category:req.body.name},function(err,docs){
      res.json(docs);
  });
}

exports.removeTagMyTag = function(req,res)
{
  taginsert.update(
    { email: req.body.email },
    { $pull: { 'tags': { name: req.body.tag } } },
      function(err, model) {
        if(err){
        console.log(err);
        }
        else{
          res.json(200);
        }
    });
}