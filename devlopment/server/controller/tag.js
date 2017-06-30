var mongoose = require('mongoose'),
tags = require('../models/tagsSchema');
var userTags = require('../models/userTagSchema');


exports.getTag = function(req, res){
    console.log("in get tags");
    var doc1 = []; 
    var doc2 = [];
    var total;
   
    tags.find({},function(err, docs){
       console.log("docs  "  + docs);
        for(var i=0; i<docs.length; i++)
        {
            doc1.push(docs[i].name);
        }
        userTags.find({email:req.params.email},function(err,docsUser){
            console.log("docsUser   " + docsUser);
            for(var j=0; j<docsUser.length; j++)
            {
                for(var t=0; t<docsUser[j].tags.length; t++)
                {
                    doc2.push(docsUser[j].tags[t].name);
                }
            }
            total = doc1.concat(doc2);
            var uniqueNames = [];
            uniqueNames = total.filter(function(item, pos) {
                return total.indexOf(item) == pos;
            })
            console.log("uniqueNames   " + uniqueNames);
            res.json(uniqueNames);
        });
    });
}

exports.getAllTag = function(req, res){
    var doc1 = []; 

    tags.find({},function(err, docs){
        if(docs.length){
            for(var i=0; i<docs.length; i++)
            {
                doc1.push({name:docs[i].name});
            }
            res.json(doc1);
        }
        else
            res.json("error");
    });
}
exports.getTagsSeclect = function(req,res)
{
    var myTags = [];
    userTags.find({email:req.params.email},function(err,docsUser){
        if(docsUser.length)
        {
            for(var i=0; i<docsUser.length;i++)
            {
                for(var j=0; j<docsUser[i].tags.length;j++)
                {
                    myTags.push(docsUser[i].tags[j].name);
                }
            }
            res.json(myTags);
        }
    });
}