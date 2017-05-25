var mongoose = require('mongoose'),
general = require('../models/generalSchema');
var doc = require('../models/doctorsSchema');
var NodeGeocoder = require('node-geocoder');


var options = {
  provider: 'google',
  httpAdapter: 'https', // Default 
  apiKey: 'AIzaSyCHo4IfFEKL8UxvDQkoEkD6UPggg9RFPBI', // for Mapquest, OpenCage, Google Premier 
  formatter: null         // 'gpx', 'string', ... 
};

var geocoder = NodeGeocoder(options);
var latitude,longitude;


exports.getData = function(req, res){
    general.find({},function(err, docs){
        console.log("docs "+docs);
        res.json(docs);
    });
}


exports.saveGeneralData = function(req , res){
    var convertAddress = req.body.address;
    geocoder.geocode(convertAddress, function(err, res) {
        //console.log(res);
        for(var i=0; i<res.length; i++)
        {
            latitude = res[i].latitude;
            longitude = res[i].longitude;
        }
        console.log(latitude+" "+longitude);
        var saveGeneralData = new doc({
        Entity: req.body.Entity,
        name: req.body.name,
        Expertise: req.body.Expertise,
        HMO: req.body.HMO,
        Address: req.body.Address,
        reception_hours: req.body.reception_hours,
        lat: latitude,
        lng: longitude,
        Ranking: 0,
        LastUpdate: req.body.LastUpdate,
        totaNumlRank : 0,
        myNumRank : 0       
    });
    saveGeneralData.save(function(error, result) {
        if (error) {
            console.error(error);
        } else {
            console.log("save");
        }
    });


    });
    
}