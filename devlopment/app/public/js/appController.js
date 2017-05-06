var mymedical = angular.module("mymed",['ngRoute','ngCookies','ngTagsInput']);


mymedical.controller('getPersonalCtrl',['$scope','$http','$cookies',function($scope,$http,$cookies) {

    $http.get("http://localhost:3000/getPersonal").success(function(data){
            var myData = [];
            var searchFilter;
            var allTags;
            var emailCookie1 = $cookies.get('cookieEmail');

            //desplay data only for online email
            for(var t=0; t<data.length ;t++)
            {
              if(data[t].email == emailCookie1 )
              {
                myData.push(data[t]);
              }
            }
            $scope.insertDataToDB = myData;
            
             

   });

    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
   
    $scope.deletePopUp = function(value)
    {

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

    $scope.deleteInfo = function(val){
      $http.post('http://localhost:3000/deletePersonalInfo', JSON.stringify(val)).then()
      modal.style.display = "none";
      location.reload();
    }

    $scope.getAllAccess = function()
    {     //get all users 
          $http.get("http://localhost:3000/userInformation").success(function(data){
            
             //check who have premision to this user
              var emailCookie = $cookies.get('cookieEmail');
              var userPermission;
              var checkEmailPer=[];
              var userPerData = [];
              var choosenUser;
              var checkNamePer=[];

              for(var i=0 ; i< data.length ; i++)
              {
                for(var j=0 ; j<(data[i].permission).length ; j++)
                {
                    if(data[i].permission[j].perEmail == emailCookie)
                    {
                       userPermission = data[i];
                    }
                }
              }
             
               checkEmailPer.push(userPermission.email);
               checkNamePer.push(userPermission.userName);
               
                  $scope.names = checkEmailPer;
                  
                  choosenUser = document.getElementById('selectedName').value;
                 
                  var selectUser = choosenUser.substr(7);
                
                $http.get("http://localhost:3000/getPersonal").success(function(data2){
                  for(var t=0 ; t< data2.length; t++)
                  {
                     if((data2[t].email == checkEmailPer) && (data2[t].email == selectUser))
                     {
                        userPerData.push(data2[t]);
                     }
                  }
                  $scope.getUserPer = userPerData;
              });
          });
    }

$scope.viewCurrent = function(value){
  console.log("setting the value");
  set(value);
  window.location= "viewDetails.html";
}

}]);


mymedical.controller('searchController',['$scope','$http',function($scope,$http) {
    var colsestDoc = [];

    $http.get("http://localhost:3000/doctors").success(function(myjson){       

    var mylat, mylng;
    var myName, myAddress;
    $scope.input1 = null;
    var clickSubmit = 0;

    $scope.show = function(){
      
      location.reload();
      document.getElementById("showButton").style.display="none";
      document.getElementById("sendButton").style.display="block";
      
    }

    $scope.checkSearch = function (val) {
      clickSubmit++;
      var hmo = document.getElementById("HMO").value;
      var expertise = document.getElementById("expertise").value;

      if(clickSubmit == 2){
      document.getElementById("sendButton").style.display="none";
      document.getElementById("showButton").style.display="block";
      clickSubmit = 0;
    }

    function showResult(result) {
      mylat=result.geometry.location.lat();
      mylng=result.geometry.location.lng();
      myfun(mylat,mylng);
    }

    function getLatitudeLongitude(callback, address) {
      Address = Address;
      // Initialize the Geocoder
      geocoder = new google.maps.Geocoder();
      if (geocoder) {
        geocoder.geocode({
        'address': Address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                callback(results[0]);
            }
        });
      }
    }

    var Address = val;
    getLatitudeLongitude(showResult, Address);
    
    function myfun(mylat,mylng){
  
      var docArrayDis = Array();
      var docArrayAdd = Array();
      var docArrayName = Array();
      var docArrayHMO = Array();
      var docArrayExp = Array();
      var docArrayhours = Array();

      
      for(var j=0; j<myjson.length; j++)
      {

        var maxDic = 99999; 
        var p1 = new google.maps.LatLng(mylat, mylng);
        var p2 = new google.maps.LatLng(myjson[j].lat, myjson[j].lng);
        var x = calcDistance(p1, p2);
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
     
      $scope.docNearby= [];
      colsestDoc.sort(function (a, b) {   
        return a.distance - b.distance || a.Address - b.Address;
      });
        for(var j=0 ; j<colsestDoc.length ; j++){        
          if((colsestDoc[j].distance < 10) && (colsestDoc[j].HMO == hmo) && (colsestDoc[j].Expertise === expertise)){
            
            $scope.docNearby.push(colsestDoc[j]);
        }
          else if((colsestDoc[j].distance < 10) && (colsestDoc[j].HMO == hmo) && (expertise === 'all')){
            $scope.docNearby.push(colsestDoc[j]);  
          }
          else if((colsestDoc[j].distance < 10) && (hmo==='all') && (colsestDoc[j].Expertise === expertise)){
            $scope.docNearby.push(colsestDoc[j]);  
          }
          else if((colsestDoc[j].distance < 10) && (hmo==='all') && (expertise==='all')){
            $scope.docNearby.push(colsestDoc[j]);  
          }
      }
 };
}      
  //calculates distance between two points in km's
  function calcDistance(p1, p2) {
    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2)/1000).toFixed(2);
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
        //user.email = $scope.
        //console.log($scope.email);

        user.email=$scope.myemail;
        user.pass = $scope.pass;

    
        //var cook=$cookies.get('cookieEmail');
        $cookies.put('cookieEmail',value);
        console.log(value);

        $http.post('http://localhost:3000/login', JSON.stringify(user)).then()
      
  }
}]);

mymedical.controller('registerCtrl',['$scope','$http','$cookies', function($scope,$http,$cookies){
  $scope.registerUser = function(valEmail, valUser){
        var user = {};
        user.email=$scope.myemail;
        user.pass = $scope.pass;
        user.userName = $scope.userName;

        //var cook=$cookies.get('cookieEmail');
        $cookies.put('cookieEmail',value);
        $cookies.put('cookieUserName',value);
        //console.log(value);
              


        $http.post('http://localhost:3000/saveUser', JSON.stringify(user)).then() 
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
mymedical.controller('MainCtrl',['$scope','$http','$cookies', function($scope,$http,$cookies){
      
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



$scope.submitForm = function() {
  //$window.location.reload();
  var emailCookie = $cookies.get('cookieEmail');
  //console.log(emailCookie);
     //data.file = $scope.file;
     //console.log(data.file);
     data.Tags = $scope.Tags;
     //console.log(data.Tags);
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
console.log("submit");

 
  $http.post('http://localhost:3000/addPersonal',JSON.stringify(data)).then()
  
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

mymedical.controller('profileCtrl',['$scope','$http','$cookies', function($scope,$http,$cookies){
      
      var user = {};
      var emailCookie = $cookies.get('cookieEmail');
      $scope.showEmail = emailCookie;
      user.email = emailCookie;

      var addPermission ={};
      $scope.addUser = function()
      {
        console.log("adding user");
        addPermission.permission = $scope.readWrite;        
        addPermission.email = $scope.userEmail;
        addPermission.key = $scope.userKey;
        addPermission.myemail = emailCookie;
        console.log(addPermission);

        $http.post('http://localhost:3000/addPerUser',JSON.stringify(addPermission)).then()
      }

      var deletePermission ={};
      $scope.deleteUser = function()
      {
        console.log("delete user");
        deletePermission.email = $scope.delEmail;
        deletePermission.myemail = emailCookie;
        console.log(deletePermission);

        $http.post('http://localhost:3000/deletePerUser',JSON.stringify(deletePermission)).then()
      }

       $http.post('http://localhost:3000/userInfo',JSON.stringify(user)).then(function(response){
          console.log(response.data);
          var userDetails = response.data;
           $scope.key = userDetails[0].key;
           $scope.username =userDetails[0].userName;  
       });
}]);

mymedical.controller('calCtrl',['$scope','$http','$cookies', function($scope,$http,$cookies){
  $http.get('http://localhost:3000/doctors').then(function(doctors) {
        var temp = [];
        angular.forEach(doctors.data, function(doctor) {
            $http.post('http://localhost:3000/calculateRanking', doctor)
                .then(function(res) {
                    doctor.Ranking = res.data;
                    temp.push(doctor);
                });
        });
        $scope.general = temp;
    });
}]);

mymedical.controller('viewPersonalCtrl',['$scope','$http','$cookies', function($scope,$http,$cookies){
    $scope.myinfo = get();
    console.log("trying to get");
    console.log($scope.myinfo);
}]);

    var savedData = {};
     function set(data) {
       savedData = data;
       console.log("in the set function");
     }
     function get() {
      console.log("in the get function")
      return savedData;
     }

/*
   mymedical.factory('myService', function() {
     


     return {
      set: set,
      get: get
     }
  });

*/