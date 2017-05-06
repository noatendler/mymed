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

exports.getCalRank = function(req,res){
	//console.log(req.body);
	var saveRank = new cal({
		insertDate: req.body.insertDate,
        Entity: req.body.entity,
        name: req.body.name,
        Expertise: req.body.expertise,
        Address: req.body.address,
        Attention: req.body.attention,
        Professional: req.body.proffessional,
        Availability: req.body.availability,
		Atmosphere: req.body.atmosphere,
		Recommendation: req.body.recommendation        
    });
    saveRank.save(function(error, result) {
       	
        if (error) {
        	console.error(error);
        } else {
        	console.log("save");
        	calRank(req.body,0);
        	//res.redirect('http://localhost:3000/calculateRanking',req.body);
        }
	});
}

var totalRank = 0;
var allDocRank=0;
var numUserRank =0;
function calRank(req,temp){
	
	cal.find({}, function(error, allRank){
		allDocRank = allRank.length;
	});

	//console.log(req);
	//console.log(sumCal);	
	cal.find({name: req.name,Address: req.address,Entity:req.entity,Expertise: req.expertise},function(err,docs){
			//console.log(docs);
			//res.json(docs);
			var sumCal = [];
			var t1=0,t2=0,t3=0,t4=0,t5=0;			
			
			for(var i=0; i<docs.length; i++)
			{
				t1=docs[i].Attention;
				t2=docs[i].Professional;
				t3=docs[i].Availability;
				t4=docs[i].Atmosphere;
				t5=docs[i].Recommendation;
				temp=(t1+t2+t3+t4+t5)/5;
				sumCal.push(temp);
			}

		    numUserRank = docs.length;
		    //console.log(numUserRank);


			for(var j=0; j<sumCal.length; j++)
			{
				//console.log("sunCal[j] "+sumCal[j]);
				totalRank += sumCal[j]; 
			}
			totalRank/=(sumCal.length);
			//console.log("total length "+ sumCal.length);
			//res.json(sumCal);
			//console.log("totalRank "+totalRank);
		doctors.findOneAndUpdate(
    	{name: req.name, Entity:req.entity, Address: req.address,
		Expertise: req.expertise},
            {$set: {Ranking:totalRank, LastUpdate:req.insertDate,myNumRank:numUserRank}},
            {safe: true, upsert: true},
            function(err, model) {
              if(err)
                console.log(err);
    	});

	    doctors.update({}, {totaNumlRank: allDocRank}, {multi: true}, 
		    function(err, num) {
		    	if(err)
		    		console.log(err);
		    	else
		        console.log("updated "+num);
		    });	
		});
	totalRank=0;

}
