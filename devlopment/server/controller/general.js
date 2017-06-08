var mongoose = require('mongoose'),
general = require('../models/generalSchema');
var doctors = require('../models/doctorsSchema');
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

exports.updateGeneral = function(req , res)
{
console.log(req.body);
 doctors.update({Entity: req.body.EntityBefore, name:req.body.NameBefore, Address:req.body.AddressBefore},{Entity: req.body.Entity, name:req.body.name, Address:req.body.Address, Expertise:req.body.Expertise,HMO:req.body.HMO,reception_hours:req.body.reception_hours},
        function(err, num) {
          if(err)
            console.log(err);
          else
            console.log("updated "+num);
 });
}

exports.delGeneral = function(req , res)
{
    doctors.remove({Entity: req.body.Entity, name:req.body.name, Address:req.body.Address, Expertise:req.body.Expertise,HMO:req.body.HMO,reception_hours:req.body.reception_hours},function(err, docs){
      if(err){
        console.log(err);
      }
      else{
        console.log("success");
      }
    });
}
