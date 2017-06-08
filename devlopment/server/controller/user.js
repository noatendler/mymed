var mongoose = require('mongoose'),
user = require('../models/usersSchema');
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
    //temp.push(request.body.email,0);
    user.find({email : request.body.email, key : request.body.key}, function(err, docs){
    if(docs.length){

      user.find({email : request.body.myemail} , function(err2, docs2){
       // console.log(JSON.parse(docs2.permission));
          //console.log(docs2[0].permission);;
          var toAdd = 1;
          for(key=0; key<docs2[0].permission.length; key++) {
            if (docs2[0].permission[key]["perEmail"] == request.body.email) {
              //console.log(docs2[0].permission[key]["perEmail"]);
              console.log('exists');
              toAdd=0;
            }
          }
          if(toAdd==1){
            console.log('not in the list');
            user.findOneAndUpdate(
            {email:request.body.myemail},
            {$push: {"permission": {perEmail: request.body.email}}},
            {safe: true, upsert: true},
            function(err, model) {
              if(err)
                console.log(err);
            });
          }
        });
        }
        else{
          console.log("try again email or key does not exist");
        }
    });
}


exports.deletePermission=function(request, response){
    user.find({email : request.body.myemail}, function(err, docs){
      for(key=0; key<docs[0].permission.length; key++) {
        if (docs[0].permission[key]["perEmail"] == request.body.email) {
          console.log('need to delete');
          user.findOneAndUpdate(
          {email:request.body.myemail},
          {$pull: {"permission": {perEmail: request.body.email}}},
          {safe: true, upsert: true},
          function(err, model) {
            if(err)
            console.log(err);
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