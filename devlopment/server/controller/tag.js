var mongoose = require('mongoose'),
tags = require('../models/tagsSchema');
var userTags = require('../models/userTagSchema');


exports.getTag = function(req, res){
    var doc1 = []; 
    var doc2 = [];
    var total;
    //console.log(req.params.email);
    tags.find({},function(err, docs){
        //console.log("docs "+docs.length);
        for(var i=0; i<docs.length; i++)
        {
            //console.log(docs[i].name);
            doc1.push(docs[i].name);
        }
        userTags.find({email:req.params.email},function(err,docsUser){
           //console.log(docsUser.length);
            for(var j=0; j<docsUser.length; j++)
            {
                //console.log(docsUser[j].tags);
                for(var t=0; t<docsUser[j].tags.length; t++)
                {
                    //console.log(docsUser[j].tags[t].name);
                    doc2.push(docsUser[j].tags[t].name);
                }
            }
            //remove equal value
            total = doc1.concat(doc2);
            var uniqueNames = [];
            uniqueNames = total.filter(function(item, pos) {
                return total.indexOf(item) == pos;
            })
            res.json(uniqueNames);
        });
    })
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