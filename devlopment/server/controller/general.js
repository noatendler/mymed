var mongoose = require('mongoose'),
general = require('../models/generalSchema');



exports.getData = function(req, res){
    general.find({},function(err, docs){
        console.log("docs "+docs);
        res.json(docs);
    });
}
