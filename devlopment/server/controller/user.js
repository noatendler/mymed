var mongoose = require('mongoose'),
user = require('../models/usersSchema');
var category = require('../models/userCategory');
//var setCookie = require('set-cookie');

var cooikeEmail;
exports.findUser = function(req, res){
   // console.log(Globals);
    user.find({email:req.body.email, pass:req.body.pass},function(err, docs){
        if(docs.length){
          console.log("found");
          //res.redirect('http://localhost:8080/index.html');
          res.json({"val":204});
        }
        else{
          console.log("can't find user");
          //res.redirect('http://localhost:8080/register.html');
          res.json({"val":302});
        }
    });
    
}

function hasher(){
    var AUID = [],
        CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    for (var i = 0; i < 6; i++) {
      AUID.push(CHARS[Math.floor(Math.random()*62)]);
    }
    return AUID.join('');
};

exports.saveNewUser = function(request, response){
  var hash = hasher();
  console.log(request.body);
    user.find({email : request.body.email},function(err, docs){
         if (docs.length){
            console.log('User exists already');
            //response.redirect('http://localhost:8080/login.html');
            response.json({"val":500});
          }
         else{
             var saveUser = new user({
                email : request.body.email,
                userName : request.body.userName,
                pass: request.body.pass,
                key: hash,
                premission: []
              });
              saveUser.save(function(error, result) {
                if (error) {
                  console.error(error);
                } else {
                  console.log("saved!");
                }
                //response.redirect('http://localhost:8080/index.html');
                response.json({"val":204});
              });
            }
          });    
}


exports.addPermission=function(request, response){
    var temp = [];
    console.log(request.body);
    var userExist = 0 ;
    var toAdd = 0;
    user.find({email: request.body.email}, function(error,res){
      console.log("in the user search function - looking for adding pre email");
      console.log(res);
      if(res.length)
      {
        if(res[0].email == request.body.myemail)
          toAdd = 0;
        else
          toAdd = 1;
        console.log("exist");
        user.find({email:request.body.myemail},function(err,document1){
        //console.log("document   "+document[0].permission.length);
        for(var i=0; i<document1[0].permission.length; i++)
        {
          if(document1[0].permission[i]["perEmail"] == request.body.email)
          {
            toAdd = 0;
            console.log("bad");
          }
        }
          console.log("toAdd   "+ toAdd);
        if(toAdd == 1)
        {
            user.findOneAndUpdate(
              {email:request.body.myemail},
              {$push: {"permission": {perEmail: request.body.email}}},
              {safe: true, upsert: true},
              function(err, model) {
                if(err)
                  console.log(err);
                else
                  response.json("success");
            });
        }
        else
          response.json("user wan't added");

      }); 
      }
      else{
        console.log('user does not exist in the DB');
        response.json("no");
      }
    });
  
}



exports.deletePermission=function(request, response){
    user.find({email : request.body.myemail}, function(err, docs){
      for(key=0; key<docs[0].permission.length; key++) {
        if (docs[0].permission[key]["perEmail"] == request.body.email) {
          //console.log('need to delete');
          user.findOneAndUpdate(
          {email:request.body.myemail},
          {$pull: {"permission": {perEmail: request.body.email}}},
          {safe: true, upsert: true},
          function(err, model) {
            if(err)
              console.log(err);
            else
              response.json("delete");
          });
        }
      }
    });
}

exports.getUserByEmail = function(request, response){
  //console.log(request.body);
  user.find({email:request.body.email}, function(err, docs){
    response.json(docs);

  });
}


exports.getUsers = function(request, response){
  user.find({}, function(err, docs){
    response.json(docs);

  });
}

//add new category to user
exports.addNewCategory = function(req,res)
{
  //console.log(req.body);
  var myemail = req.body.email;
  var cat = req.body.category[0].name;
  var tag = req.body.tags;
  //console.log(tag);
  var uniqueValue = [];
  var tags = [];
  var tagsDb = [];
  for(var i=0; i<tag.length;i++)
  {
    tags.push(tag[i].text);
  }

//console.log(tags[0]);
  category.find({email:myemail,category:cat},function(err,doc){
    if(doc.length)
    {
      for(var i=0; i<doc.length; i++)
      {
        for(var j=0; j<doc[i].tags.length;j++)
        {
          tagsDb.push(doc[i].tags[j].text);
        }
      }
      var myCurrentTags=[];
  for(var temp=0; temp<tags.length; temp++)
  {
    console.log("tags   " + tags[temp]);
    console.log("----------------------");
    if(myCurrentTags.indexOf(tags[temp]) == -1)
    {
      myCurrentTags.push(tags[temp]);
    }
  }
  for(var temp=0; temp<tagsDb.length; temp++)
  {
    if(myCurrentTags.indexOf(tagsDb[temp]) == -1){
      myCurrentTags.push(tagsDb[temp]);
    }
  }
  console.log(myCurrentTags);

  for(var k=0; k<myCurrentTags.length; k++){
    uniqueValue.push({text:myCurrentTags[k]});
  }
  category.findOneAndUpdate({email: myemail,category:cat}, { $set : { 'tags': uniqueValue} },
    {safe: true, upsert:true},
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
      var saveCat = new category({
        email : myemail,
        category : cat,
        tags : tag
      });
      saveCat.save(function(error, result) {
        if (error) {
          console.error(error);
        } else {
          console.log("saved!");
        }
        res.json(200);
      });
    }
  });

  

//   category.find({email:myemail,category:cat},function(err,doc){
//     if(doc.length)
//      {
//     console.log("doc    " + doc.length);
//      var myCurrentTags =[];
//      for(var i=0; i<doc[0].tags.length; i++)
//      {
//       //console.log(doc[0].tags[i]);
//           myCurrentTags.push(doc[0].tags[i].text);
//      }
//      var total = myCurrentTags;
//      console.log("myCurrentTags  " +myCurrentTags);
// console.log("*****************************");
//      for(var t=0; t<myCurrentTags.length;t++)
//      {
//       for(k=0; k<tag.length; k++)
//       {
//         //console.log(tag[k].name);
//         if(tag[k].name == myCurrentTags[t])
//         {
//           if(uniqueValue.indexOf(tag[k].text) == -1)
//           {
//             uniqueValue.push(tag[k].text);
//           }
//         }
//         else
//         {
//           if(uniqueValue.indexOf(tag[k].text) == -1)
//           {
//             uniqueValue.push(tag[k].text); 
//           }
//           if(uniqueValue.indexOf(myCurrentTags[t]) == -1)
//           {
//            uniqueValue.push(myCurrentTags[t]); 
//           }
//         }
//       }
//      }
//   console.log("uniqueValue     " + uniqueValue);
// console.log("**********************************");
//         category.findOneAndUpdate({email: myemail,category:cat}, { $set : { 'tags': uniqueValue} },
//           {safe: true},
//             function (err, doc) {
//               if (err) {
//                   console.log(err);
//               } else {
//                   console.log('updated! :)');
//               }
//         });
//      }
//      else
//      {
//         var saveCat = new category({
//                 email : myemail,
//                 category : cat,
//                 tags : tag
//         });
//         saveCat.save(function(error, result) {
//                 if (error) {
//                   console.error(error);
//                 } else {
//                   console.log("saved!");

//                 }
//                 res.json(200);
//         });
//      }
//   });
}

exports.getCategory = function(req,res)
{
  console.log(req.body);
  category.find({email:req.body.email}, function(err, docs){
    res.json(docs);
  });
}

exports.getSubCategory = function(req,res)
{
    category.find({email:req.body.email,category:req.body.category}, function(err, docs){
       res.json(docs);
    });
}
