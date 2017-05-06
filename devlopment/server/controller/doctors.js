var mongoose = require('mongoose'),
doctors = require('../models/doctorsSchema');
cal = require('../models/calSchema');


exports.getData = function(req, res){
    //console.log("in the doctor location");
    doctors.find({},function(err, docs){
        //console.log("docs "+docs);
        res.json(docs);
    });
}

exports.calRank = function(req, res){
	cal.find({name: req.body.name, Entity:req.body.Entity, Address: req.body.Address,
	Expertise: req.body.Expertise},function(err,docs){
			console.log(docs);
			//res.json(docs);
			var sumCal=0;
			for(var i=0; i<docs.length; i++)
			{
				sumCal+=docs[i].Attention;
				sumCal+=docs[i].Professional;
				sumCal+=docs[i].Availability;
				sumCal+=docs[i].Atmosphere;
				sumCal+=docs[i].Recommendation;
				sumCal/=5;
			}
			res.json(sumCal);
	});
}
