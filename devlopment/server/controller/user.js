var mongoose = require('mongoose'),
user = require('../models/usersSchema');
var category = require('../models/userCategory');
var myTag = require('../models/userTagSchema');

var cooikeEmail;
exports.findUser = function(req, res){

    user.find({email:req.body.email, pass:req.body.pass},function(err, docs){
        if(docs.length){
          console.log("found");
          res.json({"val":204});
        }
        else{
          console.log("can't find user");
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
  var myemail = req.body.email;
  var cat = req.body.category[0].name;
  var tag = req.body.tags;
  var uniqueValue = [];
  var tags = [];
  var tagsDb = [];
  for(var i=0; i<tag.length;i++)
  {
    tags.push(tag[i].text);
  }

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
}

exports.getCategory = function(req,res)
{
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

exports.getCategoryByUser = function(req,res)
{
  console.log(req.body);
  myTag.find({email:req.body.email},function(err,doc){
      if (err) {
        console.log(err);
      } else {
        res.json(doc);
      }
  });
}

exports.getCatAndSubBySub =function(req,res)
{
    category.find({email:req.body.email}, function(err, docs){
       for(var i=0; i<docs.length; i++)
       {
          for(var j=0; j<docs[i].tags.length; j++)
          {
            if(docs[i].tags[j].text == req.body.sub)
            {
              console.log(docs[i]);
            }
          }
       }
       res.json("204");
    });
}

exports.getSubCateygoryEmail  = function(req,res)
{
    category.find({email:req.body.email}, function(err, docs){
       res.json(docs);
    });
}