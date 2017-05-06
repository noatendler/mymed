var mongoose = require('mongoose'),
tags = require('../models/tagsSchema');



exports.getTag = function(req, res){
    tags.find({},function(err, docs){
        //console.log("docs "+docs);
        res.json(docs);
    });
}
