var mymedical = angular.module("mymed",['ngRoute','ngCookies','ngTagsInput']);


mymedical.controller('getPersonalCtrl',['$scope','$http','$cookies',function($scope,$http,$cookies) {
var emailCookie1 = $cookies.get('cookieEmail');
    $http.get("http://localhost:3000/getPersonal").success(function(data){
            var myData = [];
            var searchFilter;
            var allTags;
            
            //display data only for online email
            for(var t=0; t<data.length ;t++)
            {
              if(data[t].email == emailCookie1 )
              {
                myData.push(data[t]);
              }
              $scope.insertDataToDB = myData;
            }

            var shortBy;
            $scope.shortFunc= function(){
              shortBy = document.getElementById('shortData').value;
              //console.log(shortBy);
            

            switch(shortBy)
            {
              case 'AZ':{
                myData.sort(function(a, b) {
                  var textA = a.Title.toUpperCase();
                  var textB = b.Title.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
              break;
              }
              case 'ZA':{
                myData.reverse(function(a, b) {
                  var textA = a.Title.toUpperCase();
                  var textB = b.Title.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
                break;
              }
              case 'firstDate':{
                myData.sort(function(a,b) {
                  a = a.myDate.split('/').reverse().join('');
                  b = b.myDate.split('/').reverse().join('');
                  return a > b ? 1 : a < b ? -1 : 0;
                });
                break;
              }
              case 'lastDate':
                myData.reverse(function(a,b) {
                  a = a.myDate.split('/').sort().join('');
                  b = b.myDate.split('/').sort().join('');
                  return a > b ? 1 : a < b ? -1 : 0;
                });
                break;
            }

        }
   });

  

  var x= {};
  x.email = emailCookie1;
  
    $http.post('http://localhost:3000/getPersonalTags',JSON.stringify(x)).then(function(res){
       var temp = res.data;
       var myPersonalTags = [];
       for(var i=0; i<temp.length ; i++)
       {
          // console.log(temp[i].tags);
          myPersonalTags.push(temp[i].tags);
       }
       $scope.personalTag = myPersonalTags;
    });

    $scope.removeTag = function(val)
    { 

      console.log(val);
      var data ={};
      data.email = emailCookie1;
      data.tag = val;
      $http.post('http://localhost:3000/removePersonalTag',JSON.stringify(data)).then(function(res){
          window.location = "getPrivateData.html";
      });
    }

    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
   
    $scope.deletePopUp = function(value)
    {
      console.log(value);

       modal.style.display = "block";
      // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    $scope.popUp = value;
   // console.log(value);
    }

    $scope.closePopUp= function(){
      modal.style.display = "none";
    }

    var dataToDelete={};
    $scope.deleteInfo = function(val){
      dataToDelete.email = val.email;
      dataToDelete.Title = val.Title;
      dataToDelete.Info = val.Info;
      dataToDelete.Category = val.Category;
      dataToDelete.Tags = val.Tags;
      dataToDelete.Recommendation = val.Recommendation;
      dataToDelete.myDate = val.myDate;
      //console.log("dataToDelete   " +JSON.stringify(dataToDelete));

      $http.post('http://localhost:3000/deletePersonalInfo', JSON.stringify(dataToDelete)).then()
      modal.style.display = "none";
      location.reload();
    }
var emailCookie = $cookies.get('cookieEmail');
   var userPermission=[];
      //get all users 

      $http.get("http://localhost:3000/userInformation").success(function(data){
            
        //check who have premision to this user
        
        
        var choosenUser;

        console.log(emailCookie);

        for(var i=0 ; i< data.length ; i++)
        {
          for(var j=0;j<(data[i].permission).length; j++)
          {
            if(data[i].permission[j].perEmail == emailCookie)
              userPermission.push(data[i].email);
          }
        }
        });
        //console.log(userPermission);       
        $scope.names = userPermission;  
        
    $scope.getAllAccess = function()
      {
       //var showDataUser= [];
       choosenUser = document.getElementById('selectedName').value;
        var selectUser = choosenUser.substr(7);
        // $http.get("http://localhost:3000/getPersonal").success(function(personalInfo){
        //   console.log(personalInfo);
        //   for(var t=0 ; t< personalInfo.length; t++)
        //   {
        //     console.log(personalInfo);
        //     //console.log(personalInfo[t].permission);
        //     for(var i=0; i<(personalInfo[t].permission).length; i++)
        //     {
        //       if(personalInfo[t].permission[i].perEmail == emailCookie )
        //         showDataUser.push(personalInfo[t]);
        //     }
        //   }
        var sendUser ={};
        sendUser.emailAccess = selectUser;
        sendUser.emailUser = emailCookie;
        $http.post("http://localhost:3000/getPersonalByEmail", JSON.stringify(sendUser)).then(function(docs)
        {
          console.log(docs.data);
          $scope.getUserPer = docs.data;
        });
        
        
          
    }

$scope.viewCurrent = function(value){
  $cookies.put('cookieView',JSON.stringify(value));
  window.location = "viewDetails.html";
}


$scope.editData = function(valueEdit){
  $cookies.put('cookieEdit',JSON.stringify(valueEdit));
  window.location = "editData.html";
}


}]);


mymedical.controller('searchController',['$scope','$http',function($scope,$http) {
// var element = document.getElementById('serachRes');
// element.style.width="100";
// element.style.height="400px";
// element.innerHTML = "";
    $http.get("http://localhost:3000/doctors").success(function(myjson){       

    var mylat, mylng;
    var myName, myAddress;
    //$scope.input1 = null;
    var clickSubmit = 0;
          var hmo = document.getElementById("HMO").value;
      var expertise = document.getElementById("expertise").value;

    $scope.checkSearch = function (val) {
    // element.innerHTML = "";
    console.log(val); //this is tel aviv
    var Address = val;
    getLatitudeLongitude(showResult, Address);

}
    //this function get the doctor around the lat lang
    function getDocAround(mylat,mylng){
      console.log("in getDocAround");
      var colsestDoc = [];
      var docArrayDis = Array();
      var docArrayAdd = Array();
      var docArrayName = Array();
      var docArrayHMO = Array();
      var docArrayExp = Array();
      var docArrayhours = Array();

      //goes over the json we got from DB to get it details
      for(var j=0; j<myjson.length; j++)
      {

        var maxDic = 99999; 
        var p1 = new google.maps.LatLng(mylat, mylng);
        var p2 = new google.maps.LatLng(myjson[j].lat, myjson[j].lng);
        //calcDistance from my point
        var x = calcDistance(p1, p2);
        //add all the res to array
        docArrayDis.push(x);
        docArrayAdd.push(myjson[j].Address);
        docArrayName.push(myjson[j].name);
        docArrayHMO.push(myjson[j].HMO);
        docArrayExp.push(myjson[j].Expertise);
        docArrayhours.push(myjson[j].reception_hours);
      }

      for(var i=0;i<docArrayDis.length;i++){
        colsestDoc.push({distance:docArrayDis[i],addres:docArrayAdd[i],name:docArrayName[i],HMO:docArrayHMO[i],Expertise:docArrayExp[i],reception_hours:docArrayhours[i]});
      }
     
      console.log('get closest Doc' + colsestDoc);
      // $scope.docNearby= [];
      var docAroundMe = [];

      colsestDoc.sort(function (a, b) {   
        //console.log("sorting my array by distance");
        return a.distance - b.distance || a.Address - b.Address;
      });
        for(var j=0 ; j<colsestDoc.length ; j++){        
          if((colsestDoc[j].distance < 10) && (colsestDoc[j].HMO == hmo) && (colsestDoc[j].Expertise === expertise)){
            
            docAroundMe.push(colsestDoc[j]);
        }
          else if((colsestDoc[j].distance < 10) && (colsestDoc[j].HMO == hmo) && (expertise === 'all')){
            docAroundMe.push(colsestDoc[j]);  
          }
          else if((colsestDoc[j].distance < 10) && (hmo==='all') && (colsestDoc[j].Expertise === expertise)){
            docAroundMe.push(colsestDoc[j]);  
          }
          else if((colsestDoc[j].distance < 10) && (hmo==='all') && (expertise==='all')){
            docAroundMe.push(colsestDoc[j]);  
          }
      }
    return docAroundMe;  
 };      
  //calculates distance between two points in km's
  function calcDistance(p1, p2) {
    console.log("in cal to check distance");
    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2)/1000).toFixed(2);
  }
  
  function showResult(result) {
    //var listDoc = " ";
    mylat=result.geometry.location.lat();
    mylng=result.geometry.location.lng();
    listDoc = getDocAround(mylat,mylng);
    console.log(listDoc);
    $scope.docNearby = listDoc;
  }

    function getLatitudeLongitude(callback, address) {
      console.log('getLatitudeLongitude');
      var Address = address;
      // Initialize the Geocoder
      geocoder = new google.maps.Geocoder();
      if (geocoder) {
        geocoder.geocode({
        'address': Address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                callback(results[0]);
                //this callback calls the showResulat
            }
        });
      }
    }
 });
}]);

mymedical.controller('insertPersonalCtrl',['$scope','$http',function($scope,$http){   
  
  $scope.clickme = function(){  
    var data = {};
    //tags = [];
    console.log($scope.tags);     
    data.email = $scope.email;
                //data.tags = t;
              data.Title = $scope.Title;
                data.Info = $scope.Info;
                data.Category=$scope.Category;
                data.Recommendation = $scope.Recommendation;
                data.file = $scope.file;
                //console.log(val);
            //$http.post('http://localhost:3000/addPersonal', JSON.stringify(data.Tags)).then()
        }                
}]);

mymedical.controller('loginCtrl',['$scope','$http','$cookies', function($scope,$http,$cookies){
        $scope.cookieAndCheck = function(value){
        var user = {};
        console.log("i'm in the controller of login");
        user.email=$scope.myemail;
        user.pass = $scope.pass;
        $cookies.put('cookieEmail',value);
        console.log(value);

        $http.post('http://localhost:3000/login', JSON.stringify(user)).then(function(res){
            if(res.data.val == 204)
            {
              alert("login successfull");
              window.location = "index.html";
            }
            else
            {
              alert("the user does not exist please register");
              window.location = "register.html";
            }
        })
      
  }
}]);

mymedical.controller('registerCtrl',['$scope','$http','$cookies', function($scope,$http,$cookies){
  $scope.registerUser = function(valEmail){
        var user = {};
        user.email=$scope.myemail;
        user.pass = $scope.pass;
        user.userName = $scope.userName;
        $cookies.put('cookieEmail',valEmail);
        $http.post('http://localhost:3000/saveUser', JSON.stringify(user)).then(function(res){
          if(res.data.val == 204)
          {
            window.location = "index.html";
          }
          else
          {
            window.location = "login.html";
          }
        }) 
  }
}]);

/*
mymedical.controller('MainCtrl',['$scope','$http','$cookies', function($scope,$http,$cookies){
      
  $scope.tags = [];
  var data={};

$scope.submitForm = function() {
  console.log("mdkdmkdm");
  data.Tags = $scope.tags;
        
  data.email = $scope.email;
  data.Title = $scope.Title;
  data.Info = $scope.Info;
  data.Category = $scope.Category;
  data.Recommendation = $scope.Recommendation;

  $http.post('http://localhost:3000/',JSON.stringify(data)).then()
}

$scope.loadCountries = function($query) {
    return $http.get('js/countries.json', { cache: true}).then(function(response) {
      var countries = response.data;
      return countries.filter(function(country) {
        return country.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    });
  };
  
}]);
*/
/*
mymedical.controller('MainCtrl',['$scope','$http','$cookies', function($scope,$http,$cookies){

var x ={};
var emailCookie = $cookies.get('cookieEmail');
x.email =emailCookie;
var arrayPermission = [];

$http.post('http://localhost:3000/userInfo',JSON.stringify(x)).success(function(data){
  
  for(var i=0; i<data.length; i++)
  {
    for(var j=0; j<(data[i].permission).length; j++)
    {
      arrayPermission.push(data[i].permission[j].perEmail);
    }
  }
  $scope.names = arrayPermission;

  $scope.$watch('permission', function() {
  var getPremission = $scope.permission;
  //console.log(getPremission);
  var showPermission = document.getElementById('userPermission');
  
  //console.log(showPermission);
  if(getPremission ==1 && showPermission!=null)
  {
      showPermission.style.display = "block";
  } 
  else
  {
    if(showPermission!=null)
      showPermission.style.display = "none";
  }
});

});



var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

  if(dd<10) {
      dd='0'+dd
  } 

  if(mm<10) {
      mm='0'+mm
  } 

  today = dd+'/'+mm+'/'+yyyy;
//alert(today);
     
          //console.log("1");
$scope.Tags = [];
var data ={};

var choice = [];

$scope.getChocie = function(val) {

  var myPosition = choice.indexOf(val);
  if(myPosition==-1)
    choice.push(val);
  else
    choice.splice(myPosition,1);

}

$scope.submitForm = function() {
console.log(choice);  

  var emailCookie = $cookies.get('cookieEmail');
     data.Tags = $scope.Tags;
     data.email = emailCookie;
     //console.log(data.email);
     data.Info  = $scope.Info;
     data.Category  = $scope.Category;
     data.Recommendation  = $scope.Recommendation;
     data.Title  = $scope.Title;
     data.myDate = today;
    //var myfile = document.getElementById("file");  
    //data.file = myfile.src;
//alert(data.myDate);
//console.log("submit");
 
   $http.post('http://localhost:3000/addPersonal',JSON.stringify(data)).then(function(data){
       $scope.Category = '';
       $scope.Recommendation ='';
       $scope.Title = '';
       $scope.Info='';
       $scope.Tags=''; 
       data = {};
  
  })

  }

    $scope.loadTags = function($query) {
    return $http.get('http://localhost:3000/getTags', { cache: true}).then(function(response) {
      var tags = response.data;
      return tags.filter(function(tag) {
        return tag.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    });
  };
  
}]);
*/

mymedical.controller('detailsCtrl',['$scope','$http','$cookies', function($scope,$http,$cookies){

  var emailCookie = $cookies.get('cookieEmail');
  $scope.showEmail = emailCookie;
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 
    today = dd+'/'+mm+'/'+yyyy;
    $scope.showDate = today;
    
    //get category from db by email
    var catData = {};
    catData.email = emailCookie;
    $http.post("http://localhost:3000/getCategory",JSON.stringify(catData)).then(function(res){
      console.log(res.data);
      var catNames = [];
      for(var i=0; i<res.data.length; i++)
      {
        //console.log(res.data[i].category);
        catNames.push(res.data[i].category);
      }
      $scope.names = catNames;
    });    

    $scope.personalSave =function(){
      
      var saveInfo ={};
      saveInfo.email = emailCookie;
      saveInfo.Title = $scope.Title;
      saveInfo.Category = $scope.selectedCat;
      saveInfo.Info = $scope.Info;
      saveInfo.Recommendation = $scope.Recommendation;
      saveInfo.mydate = today;

      // $http.post('http://localhost:3000/getKeywords',JSON.stringify(saveInfo)).then(function(tags){
      //   $cookies.put('Tags', JSON.stringify(tags.data));
         $cookies.put('cookieSave',JSON.stringify(saveInfo));
         //window.location ="insertTagsPermission.html";
      // });


  }
}]);

mymedical.controller('TagsPerCtrl',['$scope','$http','$cookies','dateFilter', function($scope,$http,$cookies,dateFilter){

 
var myinfo;
var myTags;

  $(body).ready(function() {
    console.log( "ready!" );
     $scope.myinfo = JSON.parse($cookies.get('cookieSave'));
      myinfo = JSON.parse($cookies.get('cookieSave'));
      $http.post("http://localhost:3000/getKeywords",JSON.stringify(myinfo)).then(function(res){
      console.log(res);
      myTags = res.data;
      var newArrayTags = Object.values(myTags)
      $scope.Tags = newArrayTags;
      });
    });

    var element_input = document.getElementById('inputAdd');
    var element_btn = document.getElementById('buttonAdd');
    console.log(element_input + " " + element_btn);
    element_btn.style.display = "none";
    element_input.style.display = "none"; 

    $scope.addOtherUser = function() {
      console.log("click");
      element_btn.style.display = "block";
      element_input.style.display = "block";
    }

  $scope.callfunction = function()
  {
    var element_input = document.getElementById('inputAdd').value;
    //console.log("element_input"+element_input);
    var saveEmailPer = {};
    saveEmailPer.email = element_input;
    saveEmailPer.myemail = emailCookie;
    //console.log(saveEmailPer);

    $http.post('http://localhost:3000/addPerUser',JSON.stringify(saveEmailPer)).then(function(res){
        if(res.data === "success"){
          console.log(res.data);
          window.location="insertTagsPermission.html";
         }
        else
        {
          alert("can't add user");
        }
    });  
  }



  var sendData ={};
  var emailCookie = $cookies.get('cookieEmail');
  sendData.email =emailCookie;
  var arrayPermission = [];

$http.post('http://localhost:3000/userInfo',JSON.stringify(sendData)).success(function(data){
  for(var i=0; i<data.length; i++)
  {
    for(var j=0; j<(data[i].permission).length; j++)
    {
      arrayPermission.push(data[i].permission[j].perEmail);
    }
  }
  $scope.names = arrayPermission;
  console.log('this is the arrayPermission');
  console.log(arrayPermission+ "<br>");

  $scope.$watch('permission', function() {
  var getPremission = $scope.permission;
  //console.log(getPremission);
  var showPermission = document.getElementById('userPermission');
  
  //console.log(showPermission);
  if(getPremission ==1 && showPermission!=null)
  {
      showPermission.style.display = "block";
  } 
  else
  {
    if(showPermission!=null)
      showPermission.style.display = "none";
  }
});

});

var choice = [];

$scope.getChocie = function(val) {

  var myPosition = choice.indexOf(val);
  if(myPosition==-1)
    choice.push(val);
  else
    choice.splice(myPosition,1);

}
var modal = document.getElementById('myModal');

  $scope.addTagsPer = function(){
    
//get category sub tags
  var categoryName = myinfo.Category;
  var data = {};
  data.email = emailCookie;
  data.name = categoryName;
  console.log("dattaaaaaa  " + data);
  var subCategory = [];
  if(!categoryName == '')
  {
  $http.post('http://localhost:3000/getSubTags',JSON.stringify(data)).success(function(res){
      console.log(res[0].tags);
      for(var i=0 ;i<res[0].tags.length; i++)
      {
        //console.log(res[0].tags[i].text);
        subCategory.push(res[0].tags[i].text);
      }
      callme(subCategory);
  });
  }
  else{
    callme("none");
  }

// console.log("subCategory "+ subCategory);
function callme(sub){
  console.log("in the call me function!");
    var tagsPer = {};
    tagsPer.email = emailCookie;
    tagsPer.Title = myinfo.Title;
    tagsPer.Info = myinfo.Info;
    // tagsPer.Category = sub;
    tagsPer.subTags = sub;
    tagsPer.Recommendation = myinfo.Recommendation;
    tagsPer.mydate = myinfo.mydate;
    // tagsPer.subTags = subCategory;
    tagsPer.Tags = $scope.Tags;
    tagsPer.Permission = choice;
    //console.log("tagsPer   " + tagsPer);
    $http.post('http://localhost:3000/addPerTags',JSON.stringify(tagsPer)).then(function(docs){
    var notiDate = docs.data.date;
    var mytype = (typeof(notiDate));
    $scope.date = new Date();
    var todayDate = new Date();
    $scope.$watch('date', function (date)
    {
      var somedate = date;
      var reminderDay = document.getElementsByName('reminder');        
      if(mytype != typeof(1))
      {
        if(notiDate.includes("every"))
        {
          var getRepeat = notiDate.replace("every", "");
          for (var i = 0, length = reminderDay.length; i < length; i++) {
            if (reminderDay[i].value == Number(getRepeat)) {
                reminderDay[i].checked = true;
              break;
            }
          }
          $scope.dateString = todayDate;       
        }
        else if(notiDate.includes("-"))
        {
          var myDate = new Date(notiDate.split('-').reverse().join('/'));
          $scope.dateString = myDate;
        }
        else if(notiDate.includes("/"))
        {
          var myDate = new Date(notiDate.split('/').reverse().join('/'));
          $scope.dateString = myDate;
        }
        else if( notnotiDateiDay.includes("."))
        {
          var myDate = new Date(notiDate.split('.').reverse().join('/'));
          $scope.dateString = myDate;
        }
      }
      else
      {
        var numberOfDaysToAdd = notiDate;
        somedate.setDate(somedate.getDate() + numberOfDaysToAdd);
        somedate = new Date(somedate);     
        $scope.dateString = somedate;
      }
    });
      

          // Get the <span> element that closes the modal
          var span = document.getElementsByClassName("close")[0];
       
          modal.style.display = "block";
          // When the user clicks on <span> (x), close the modal
          span.onclick = function() {
              modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    } 
    });
  }
  }

  //   $scope.loadTags = function($query) {
  //   return $http.get('http://localhost:3000/getTags', { cache: true}).then(function(response) {
  //     var tags = response.data;
  //     return tags.filter(function(tag) {
  //       return tag.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
  //     });
  //   });
  // };
  
    $scope.loadTags = function($query) {
    return $http.get('http://localhost:3000/getTags/'+emailCookie,{ cache: true}).then(function(response) {
      var tags = response.data;
      return tags.filter(function(tag) {
        //return tag.toLowerCase();
        return tag.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    });
  };

//save notification for each user by email
$scope.SaveNoti = function(val)
{

    if(val == 'no')
    {
      modal.style.display = "none";
    }
    if(val == 'yes')
    {
      var saveNoti = {};
      saveNoti.email = emailCookie;
      saveNoti.Recommendation = myinfo.Recommendation;
      saveNoti.dateNoti = $scope.dateString;
      var reminderDay = document.getElementsByName('reminder');        
      for (var i = 0, length = reminderDay.length; i < length; i++) {
        if (reminderDay[i].checked) {
          saveNoti.repeat=reminderDay[i].value;
          break;
        }
      }
      modal.style.display = "none";
      $http.post('http://localhost:3000/addNotification',JSON.stringify(saveNoti)).then() 
    }

    window.location ="http://localhost:8080/getPrivateData.html";
}

}]);


mymedical.controller('profileCtrl',['$scope','$http','$cookies', function($scope,$http,$cookies){
      
      var user = {};
      var emailCookie = $cookies.get('cookieEmail');
      $scope.showEmail = emailCookie;
      user.email = emailCookie;

      var addPermission ={};
      $scope.addUser = function()
      {
        console.log("adding user");
        addPermission.email = $scope.userEmail;
        //addPermission.key = $scope.userKey;
        addPermission.myemail = emailCookie;
        console.log(addPermission);

        $http.post('http://localhost:3000/addPerUser',JSON.stringify(addPermission)).then(function(res){
            alert("User successfully added");
            window.location = "profile.html";
        });
      }

      var deletePermission ={};
      $scope.deleteUser = function()
      {
        console.log("delete user");
        deletePermission.email = $scope.delEmail;
        deletePermission.myemail = emailCookie;
        console.log(deletePermission);

        $http.post('http://localhost:3000/deletePerUser',JSON.stringify(deletePermission)).then(function(res){
            alert("User deleted successfully");
            window.location = "profile.html";
        });
      }

       $http.post('http://localhost:3000/userInfo',JSON.stringify(user)).then(function(response){
          console.log(response.data);
          var userDetails = response.data;
           $scope.key = userDetails[0].key;
           $scope.username =userDetails[0].userName;  
       });
}]);

mymedical.controller('calCtrl',['$scope','$http','$cookies', function($scope,$http,$cookies){
 //go top button when scroll
  window.onscroll = function() {scrollFunction()};

  function scrollFunction() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          document.getElementById("myBtn").style.display = "block";
      } else {
          document.getElementById("myBtn").style.display = "none";
      }
  }

  $scope.topFunction = function()
  {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  $http.get('http://localhost:3000/doctors').then(function(doctors) {
        var temp = [];
        $scope.general = doctors.data;
        
    });

  var emailCookie = $cookies.get('cookieEmail');

  $scope.user = function()
  {
    if(emailCookie == 'admin@gmail.com')
      return true;
    else
      return false;
  }

  $scope.edit = function(valueEdit)
  {
      $cookies.put('cookieEditGeneral',JSON.stringify(valueEdit));
      window.location = "editGeneralData.html";
  }


    $scope.deleteDoc=function(doc)
    {
      var deletemodal = document.getElementById('deletePopup');

      // Get the <span> element that closes the modal
      var deletespan = document.getElementsByClassName("closeDelete")[0];
 
      console.log("fgefe");
      console.log(doc);
      deletemodal.style.display = "block";
      // When the user clicks on <span> (x), close the modal
      deletespan.onclick = function() {
          deletemodal.style.display = "none";
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
          if (event.target == deletemodal) {
              deletemodal.style.display = "none";
          }
      }
      $scope.delAddress = doc.Address; 
      $scope.delName = doc.name; 
      $scope.delEntity = doc.Entity;

      $scope.delYes= function(){
        deletemodal.style.display = "none";
        $http.post('http://localhost:3000/delGeneral',JSON.stringify(doc));
      }

      $scope.delNo = function(){
        deletemodal.style.display = "none";
      }

    }

  $scope.PA = 0;
  $scope.Pro = 0;
  $scope.AV = 0;
  $scope.AT = 0;
  $scope.Rec = 0;

var userRank ={};

  $scope.rankDoc = function(entity,name,expertise, address, rank,lastUp,numAll, numMy){
    //console.log(rank);
    $scope.dataName = name;
    $scope.dataAddress = address;
    $scope.dataRank = rank;
    $scope.lastUpdate = lastUp;
    $scope.Credibility = Math.round((numMy/numAll)*100);
    userRank.name = name;
    userRank.address = address;
    userRank.entity = entity;
    userRank.expertise =expertise;


    // Get the modal
    console.log("im in the right function");

    var modal = document.getElementById('myModal');

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
 
    modal.style.display = "block";
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    var star = document.getElementById("showMyRank");
    
    while (star.hasChildNodes()) {
        star.removeChild(star.lastChild);
    }


    switch(Math.round(rank)){
      case 0:
      {
        for(var i=0; i<5; i++)
        {
          var node = document.createElement("img");
          node.src = "../images/star-empty-lg.png";
          star.appendChild(node);
        }
        break;
      }
      case 1:
      {
        for(var i=0; i<1; i++)
        {
          var node = document.createElement("img");
          node.src = "../images/star-fill-lg.png";
          star.appendChild(node);
        }
        for(var i=0; i<4; i++)
        {
          var node = document.createElement("img");
          node.src = "../images/star-empty-lg.png";
          star.appendChild(node);
        }
        break;
      }
      case 2:
      {
        for(var i=0; i<2; i++)
        {
          var node = document.createElement("img");
          node.src = "../images/star-fill-lg.png";
          star.appendChild(node);
        }
        for(var i=0; i<3; i++)
        {
          var node = document.createElement("img");
          node.src = "../images/star-empty-lg.png";
          star.appendChild(node);
        }

        break;
      }
      case 3:
      {
        for(var i=0; i<3; i++)
        {
          var node = document.createElement("img");
          node.src = "../images/star-fill-lg.png";
          star.appendChild(node);
        }
        for(var i=0; i<2; i++)
        {
          var node = document.createElement("img");
          node.src = "../images/star-empty-lg.png";
          star.appendChild(node);
        }
        break;
      }
      case 4:
      {
        for(var i=0; i<4; i++)
        {
          var node = document.createElement("img");
          node.src = "../images/star-fill-lg.png";
          star.appendChild(node);
        }
        for(var i=0; i<1; i++)
        {
          var node = document.createElement("img");
          node.src = "../images/star-empty-lg.png";
          star.appendChild(node);
        }

        break;
      }
      case 5:
      {
        for(var i=0; i<5; i++)
        {
          var node = document.createElement("img");
          node.src = "../images/star-fill-lg.png";
          star.appendChild(node);
        }

        break;
      }
    }

    $scope.clickPA = function (param) {
        console.log("ranking of personal attention " + param );
        userRank.attention = param;
    };
    $scope.clickPro = function (param) {
        console.log("ranking of proff " + param );
        userRank.proffessional = param;
    };
    $scope.clickAV = function (param) {
        console.log("ranking of availiable " + param );
        userRank.availability = param;
    };
    $scope.clickAT = function (param) {
        console.log("ranking of atmosphere " + param );
        userRank.atmosphere = param;
    };
    $scope.clickRec = function (param) {
        console.log("ranking of personal recommendation " + param );
        userRank.recommendation = param;
    };
    $scope.sendRank= function()
    {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        } 

        if(mm<10) {
            mm='0'+mm
        } 

        today = dd+'/'+mm+'/'+yyyy;
        userRank.insertDate = today;
      if(userRank.attention!=null && userRank.proffessional!=null && userRank.availability!=null
        && userRank.atmosphere!=null && userRank.recommendation!=null){
        $http.post('http://localhost:3000/getOneRank', userRank);
        modal.style.display = "none";   
      }
      else{
        var error = document.getElementById('errorLog');
        error.innerHTML="please rank all categories";
      }

      location.reload();
    }
  }
  

}]);



mymedical.directive('starRating', function () {
    return {
        scope: {
            rating: '=',
            maxRating: '@',
            readOnly: '@',
            click: "&",
            mouseHover: "&",
            mouseLeave: "&"
        },
        restrict: 'EA',
        template:
            "<div style='display: inline-block; margin: 0px; padding: 0px; cursor:pointer;' ng-repeat='idx in maxRatings track by $index'> \
                    <img ng-src='{{((hoverValue + _rating) <= $index) && \"http://www.codeproject.com/script/ratings/images/star-empty-lg.png\" || \"http://www.codeproject.com/script/ratings/images/star-fill-lg.png\"}}' \
                    ng-Click='isolatedClick($index + 1)' \
                    ng-mouseenter='isolatedMouseHover($index + 1)' \
                    ng-mouseleave='isolatedMouseLeave($index + 1)'></img> \
            </div>",
        compile: function (element, attrs) {
            if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
                attrs.maxRating = '5';
            };
        },
        controller: function ($scope, $element, $attrs) {
            $scope.maxRatings = [];

            for (var i = 1; i <= $scope.maxRating; i++) {
                $scope.maxRatings.push({});
            };

            $scope._rating = $scope.rating;
      
      $scope.isolatedClick = function (param) {
        if ($scope.readOnly == 'true') return;

        $scope.rating = $scope._rating = param;
        $scope.hoverValue = 0;
        $scope.click({
          param: param
        });
      };

      $scope.isolatedMouseHover = function (param) {
        if ($scope.readOnly == 'true') return;

        $scope._rating = 0;
        $scope.hoverValue = param;
        $scope.mouseHover({
          param: param
        });
      };

      $scope.isolatedMouseLeave = function (param) {
        if ($scope.readOnly == 'true') return;

        $scope._rating = $scope.rating;
        $scope.hoverValue = 0;
        $scope.mouseLeave({
          param: param
        });
      };
        }
    };
});

mymedical.controller('viewPersonalCtrl',['$scope','$http','$cookies', function($scope,$http,$cookies){
    //$scope.myinfo = get();

    $scope.myinfo=JSON.parse($cookies.get('cookieView'));

    //console.log("trying to get");
    console.log(typeof($scope.myinfo));
}]);

mymedical.controller('editPersonalCtrl',['$scope','$http','$cookies', function($scope,$http,$cookies){
var etidTag = [];
    var myEdit = JSON.parse($cookies.get('cookieEdit'));
    $scope.myinfoEdit= myEdit;
    for(var i=0;i<myEdit.Tags.length;i++){
      for(var j=0;j<myEdit.Tags[i].length;j++)
      {
        etidTag.push(myEdit.Tags[i][j].name);
      }
    }
  // console.log(etidTag);
    $scope.Tags = etidTag;
    var data ={};

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

      if(dd<10) {
          dd='0'+dd
      } 

      if(mm<10) {
          mm='0'+mm
      } 

    today = dd+'/'+mm+'/'+yyyy;

    $scope.loadTag = function($query) {
        return $http.get('http://localhost:3000/getTags', { cache: true}).then(function(response) {
      var tags = response.data;
      console.log();
        return tags.filter(function(tag) {
          return tag.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    });
  };

    $scope.submitEdit = function() {
      var info = document.getElementById('Info').value;
      var recommendation = document.getElementById('Recommendation').value;
      var title = document.getElementById('Title').value;

     data.Tags = $scope.Tags;
     data.Info  = info;
     data.Recommendation  = recommendation;
     data.Title  = title;
     data.email = myEdit.email;
     data.oldInfo = myEdit.Info;
     data.oldRec =  myEdit.Recommendation;
     data.oldTitle = myEdit.Title;
     data.myDate = today;
    console.log("submit");


  $http.post('http://localhost:3000/updatePersonalData',JSON.stringify(data)).then()
  
  }


}]);

mymedical.controller('insertGeneralCtrl',['$scope','$http','$cookies', function($scope,$http,$cookies){


    var data ={};

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

      if(dd<10) {
          dd='0'+dd
      } 

      if(mm<10) {
          mm='0'+mm
      } 

    today = dd+'/'+mm+'/'+yyyy;

//get resp hours
    $scope.saveGeneral = function() {
      var convertAddress = $scope.Address;
      var sunday,monday,tuesday,wednesday,thursday,friday;
      var receptionHours = [];
      
      var sundayFrom = document.getElementById("SundayHoursFrom").value;
      var sundayUntil = document.getElementById("SundayHoursUntil").value;
      var mondayFrom = document.getElementById("MondayHoursFrom").value;
      var mondayUntil = document.getElementById("MondayHoursUntil").value;
      var tuesdayFrom = document.getElementById("TuesdayHoursFrom").value;
      var tuesdayUntil = document.getElementById("TuesdayHoursUntil").value;
      var wednesdayFrom = document.getElementById("WednesdayHoursFrom").value;
      var wednesdayUntil = document.getElementById("WednesdayHoursUntil").value;
      var thursdayFrom = document.getElementById("ThursdayHoursFrom").value;
      var thursdayUntil = document.getElementById("ThursdayHoursUntil").value;
      var fridayFrom = document.getElementById("FridayHoursFrom").value;
      var fridayUntil = document.getElementById("FridayHoursUntil").value;
      var HMO = document.getElementById('hmoSelect').value;
      var Entity = document.getElementById('entitySelect').value;

      sunday = "Sunday:"+' '+sundayFrom+' '+"-"+' '+sundayUntil;
      monday = "Monday:"+' '+mondayFrom+' '+"-"+' '+mondayUntil;
      tuesday = "Tuesday:"+' '+tuesdayFrom+' '+"-"+' '+tuesdayUntil;
      wednesday = "Wednesday:"+' '+wednesdayFrom+' '+"-"+' '+wednesdayUntil; 
      thursday = "Thursday:"+' '+thursdayFrom+' '+"-"+' '+thursdayUntil; 
      friday = "Friday:"+' '+fridayFrom+' '+"-"+' '+fridayUntil; 
      receptionHours.push(sunday,monday,tuesday,wednesday,thursday,friday);

      //console.log(receptionHours);

     data.Entity = Entity;
     data.name  = $scope.name;
     data.Expertise  = $scope.Expertise;
     data.HMO  = HMO;
     data.Address = $scope.Address;
     data.reception_hours = receptionHours;
     data.address = convertAddress;
     data.LastUpdate = today;

  $http.post('http://localhost:3000/getGeneralData',JSON.stringify(data)).then()
  
  }

}]);

mymedical.controller('editGeneralCtrl',['$scope','$http','$cookies', function($scope,$http,$cookies){

    var generalEdit = JSON.parse($cookies.get('cookieEditGeneral'));
    $scope.infoGeneral= generalEdit;

    for(var i=0; i<generalEdit.reception_hours.length; i++)
    {
      if(generalEdit.reception_hours[i].Sunday != null)
        $scope.sunday = generalEdit.reception_hours[i].Sunday;
      if(generalEdit.reception_hours[i].Monday != null)
        $scope.monday = generalEdit.reception_hours[i].Monday;
      if(generalEdit.reception_hours[i].Tuesday != null)
        $scope.tuesday = generalEdit.reception_hours[i].Tuesday;
      if(generalEdit.reception_hours[i].Wednesday != null)
        $scope.wednesday = generalEdit.reception_hours[i].Wednesday;
      if(generalEdit.reception_hours[i].Thursday != null)
        $scope.thursday = generalEdit.reception_hours[i].Thursday;
      if(generalEdit.reception_hours[i].Friday != null)
        $scope.friday = generalEdit.reception_hours[i].Friday;
    } 

    var data ={};
    var reception = {};
    
    $scope.EditGeneral = function() {
     
      if($scope.sunday != null)
        reception.Sunday = $scope.sunday;
      if($scope.monday != null)
        reception.Monday = $scope.monday;
      if($scope.tusday != null)
        reception.Tuesday = $scope.tusday;
      if($scope.wednesday != null)
        reception.Wednesday = $scope.wednesday;
      if($scope.thursday != null)
        reception.Thursday = $scope.thursday;
      if($scope.friday != null)
        reception.Friday = $scope.friday;

     data.Entity  = $scope.infoGeneral.Entity;
     data.name  = $scope.infoGeneral.name;
     data.Expertise  = $scope.infoGeneral.Expertise;
     data.HMO = $scope.infoGeneral.HMO;
     data.reception_hours = reception;
     data.EntityBefore = generalEdit.Entity;
     data.NameBefore = generalEdit.name;
     data.AddressBefore = generalEdit.Address;
    //console.log(data);


  $http.post('http://localhost:3000/updateGeneralData',JSON.stringify(data)).then()
  
  }
      
}]);

