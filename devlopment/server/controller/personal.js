var mongoose = require('mongoose'),
personal = require('../models/personalSchema');
var fs = require('fs')
    , knox = require('knox');
var mime = require('mime');
var user = require('../models/usersSchema');

exports.getData = function(req, res){
        personal.find({},function(err, docs){
          console.log("docs "+docs);
          res.json(docs);
    });
};

var client = knox.createClient({
    key: 'AKIAIUG5TZXOMHY74LLA'
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

var checkfile=0;
var checktags = 0;
var myfile;
var checkReq=0;
var mytags;
var myemail;
var tempDate=null;
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
                  response.redirect('http://localhost:8080/getPrivateData.html');
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

        req = client.putStream(stream, hash+'.png',
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
                  response.redirect('http://localhost:8080/getPrivateData.html');

                }
              })
          });
       } else {
            console.log(err);
        }

  checkfile=0;
  checktags=0;
  }

}

exports.delInfo = function(req, res){
    personal.remove({email:req.body.email,Title:req.body.Title,Info:req.body.Info,Category:req.body.Category,Recommendation:req.body.Recommendation,myDate:req.body.myDate},function(err, docs){
          // console.log("docs "+docs);
          // res.json(docs);
      if(err){
        console.log(err);
      }
      else{
        console.log("wooooowwwww");
      }
    });
// console.log("$$$$$$$$$$$$$$$$$$$$$$$$");
// console.log(req.body);
}