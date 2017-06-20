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
    //console.log("email"+request.body.email);
    //console.log("myemail"+request.body.myemail);
    console.log(request.body.email);
    var userExist = 0 ;
    user.find({email: request.body.email}, function(error,res){
      console.log("in the user search function - looking for adding pre email");
      console.log(res);
      if(res.length)
      {
        var toAdd = 1;
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

      }); 
      }
      else{
        console.log('user does not exist in the DB');
        response.json("no");
      }
    });
  

    //temp.push(request.body.email,0);
    // user.find({email : request.body.email, key : request.body.key}, function(err, docs){
    // if(docs.length){

    //   user.find({email : request.body.myemail} , function(err2, docs2){
    //    // console.log(JSON.parse(docs2.permission));
    //       //console.log(docs2[0].permission);;
    //       var toAdd = 1;
    //       for(key=0; key<docs2[0].permission.length; key++) {
    //         if (docs2[0].permission[key]["perEmail"] == request.body.email) {
    //           //console.log(docs2[0].permission[key]["perEmail"]);
    //           console.log('exists');
    //           toAdd=0;
    //         }
    //       }
    //       if(toAdd==1){
    //         console.log('not in the list');
    //         user.findOneAndUpdate(
    //         {email:request.body.myemail},
    //         {$push: {"permission": {perEmail: request.body.email}}},
    //         {safe: true, upsert: true},
    //         function(err, model) {
    //           if(err)
    //             console.log(err);
    //         });
    //       }
    //     });
    //     }
    //     else{
    //       console.log("try again email or key does not exist");
    //     }
    // });
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
  console.log(req.body);
  var myemail = req.body.email;
  var cat = req.body.category[0].name;
  var tag = req.body.tags;
  var uniqueValue = [];
  category.find({email:myemail,category:cat},function(err,doc){
    if(doc.length)
     {
    console.log("doc    " + doc.length);
     var myCurrentTags =[];
     for(var i=0; i<doc[0].tags.length; i++)
     {
      //console.log(doc[0].tags[i]);
          myCurrentTags.push({name:doc[0].tags[i].name});
     }
     var total = myCurrentTags;
console.log("*****************************");
     for(var t=0; t<myCurrentTags.length;t++)
     {
      for(k=0; k<tag.length; k++)
      {
        //console.log(tag[k].name);
        if(tag[k].name == myCurrentTags[t].name)
        {
          if(uniqueValue.indexOf(tag[k].name) == -1)
          {
            uniqueValue.push({name:tag[k].name});
          }
        }
        else
        {
          if(uniqueValue.indexOf(tag[k].name) == -1)
          {
            uniqueValue.push({name:tag[k].name}); 
          }
          if(uniqueValue.indexOf(myCurrentTags[t].name) == -1)
          {
           uniqueValue.push({name:myCurrentTags[t].name}); 
          }
        }
      }
     }
  console.log("uniqueValue     " + uniqueValue);
console.log("**********************************");
        category.findOneAndUpdate({email: myemail,category:cat}, { $set : { 'tags': uniqueValue} },
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
                //response.redirect('http://localhost:8080/index.html');
                res.json(result);
        });
     }
  });
}

exports.getCategory = function(req,res)
{
  console.log(req.body);
  category.find({email:req.body.email}, function(err, docs){
    res.json(docs);
  });
}
