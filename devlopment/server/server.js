var express=require('express');
var app = express();


var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var multipartAction = multipart();

var general = require('./controller/general');
var personal = require('./controller/personal');
var user = require('./controller/user');
var doctors = require('./controller/doctors');
var tag = require('./controller/tag');


var port = process.env.PORT || 3000;
app.set('port', port);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



app.use(function(req, res, next) {
    res.setHeader("Content-Type", "text/html");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Accept,Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Content-Type", "application/json");
    next();
});

app.use('/index', express.static('./public'));
app.use('/login', express.static('./public'));
app.use('/saveUser', express.static('./public'));



app.get('/general', general.getData);
app.post('/getPersonalByEmail',multipartAction, personal.getDataByUser);
app.get('/getPersonal', personal.getData);
app.post('/addPersonal',multipartAction,personal.saveData);
app.post('/login',multipartAction, user.findUser);
app.post('/saveUser',multipartAction,user.saveNewUser);
app.get('/doctors', doctors.getData);
app.get('/getTags/:email', tag.getTag);
app.get('/getTagsSeclect/:email',tag.getTagsSeclect);
app.post('/addPerUser', multipartAction, user.addPermission);
app.post('/deletePerUser', multipartAction, user.deletePermission);
app.post('/userInfo',multipartAction,user.getUserByEmail);
app.get('/userInformation',user.getUsers);
//app.post('/calculateRanking',multipartAction, doctors.calRank);
app.post('/deletePersonalInfo',multipartAction, personal.delInfo);
app.post('/getOneRank',multipartAction,doctors.getCalRank);
app.post('/updatePersonalData',multipartAction,personal.updatePersonal);
app.post('/getPersonalTags',multipartAction, personal.personalTags);
app.post('/removePersonalTag',multipartAction,personal.removeTag);

//this is a try to do tag, data not together
app.post('/addDataNoTags',multipartAction, personal.addInfoNoTags);
app.post('/addPerTags',multipartAction, personal.addTagPer);
app.post('/getGeneralData',multipartAction,general.saveGeneralData);
app.post('/addNotification',multipartAction,personal.saveNotification);
app.post('/updateGeneralData',general.updateGeneral);
app.post('/delGeneral',general.delGeneral);
app.post('/getKeywords',multipartAction, personal.getTagsFromText);
app.post('/getAllDocs',multipartAction,personal.getAllDocumentByTag);
app.post('/addNewTag',multipartAction,personal.addNewTag);
app.post('/removeTagMyTag',multipartAction,personal.removeTagMyTag);
app.post('/addNewCategory',multipartAction,user.addNewCategory);
app.post('/getCategory',multipartAction,user.getCategory);
app.post('/getSubTags',multipartAction,personal.getSubTags);
app.post('/getSubCategory',multipartAction,user.getSubCategory);

app.listen(port);