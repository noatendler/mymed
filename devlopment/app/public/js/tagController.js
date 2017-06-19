var myTags = angular.module("mymed",['ngRoute','ngCookies','ngTagsInput']);

myTags.controller('tagsCtrl',['$scope','$http','$cookies',function($scope,$http,$cookies) {
  
  var emailCookie = $cookies.get('cookieEmail');
  var x= {};
  x.email = emailCookie;
console.log(x);

//get all tags 
    var h1_element = document.getElementById('seeTag');
    var continerLink = document.getElementById('linkDocs');
    var h2_element = document.createElement('h2');

    h2_element.style.display = "none";

    $scope.allTags = function(){
        console.log("allTags");
    h1_element.style.display = "block";
    $http.post('http://localhost:3000/getPersonalTags',JSON.stringify(x)).then(function(res){
     console.log(res);

       var temp = res.data;
       //console.log(temp.length);
       var myPersonalTags = [];
       for(var i=0; i<temp.length ; i++)
       {
         for(var j=0; j<temp[i].tags.length; j++)
         {
            //console.log(temp[i].tags[j]);
            myPersonalTags.push(temp[i].tags[j]);
         }
       }
       $scope.personalTag = myPersonalTags;
      });
    }

    var title = document.getElementById('titleTag');
    var input = document.getElementById('Tags');
    var btn_save = document.getElementById('saveTag');
    h1_element.style.display = "none";
    btn_save.style.display = "none";
    title.style.display = "none";
    input.style.display = "none";
    var newTagVal = [];

//add new tags
    $scope.newTag = function()
    {
        h1_element.innerHTML = '';
        console.log("newTag");
    
        // tagC.style.display = "none";
        title.style.display = "block";
        input.style.display = "block";
        btn_save.style.display = "block";

        document.getElementById("saveTag").onclick = function fun() {
            var newTags = $scope.Tags;
             saveTagFunc(newTags);
        }
    }

//save tags in db
    function saveTagFunc(val)
    {
        console.log("saveTagFunc    " + val);
        var data = {};
        data.email = emailCookie;
        data.Tags = val;

        $http.post('http://localhost:3000/addNewTag',JSON.stringify(data)).then(function(docs){
                console.log(docs);
        });
    }

//remove tag from personal tag
    $scope.removeTag = function(tagName,tagNumber)
    {
        console.log(tagName + tagNumber);
        if(tagNumber == 0)
        {
            var data ={};
            data.email = emailCookie;
            data.tag = tagName;
            //console.log(data);
            $http.post('http://localhost:3000/removeTagMyTag',JSON.stringify(data)).then(function(res){
                    console.log(res);
            });
        }
    }

    var popUp = document.getElementById('myModal');
    popUp.style.display = "none";

    $scope.getDocument = function(tag)
    {
        console.log(tag);
        var dataT = {};
        dataT.email = emailCookie;
        dataT.Tags = tag;
        console.log(dataT);
        //get all docs from db by tag name
        $http.post('http://localhost:3000/getAllDocs',JSON.stringify(dataT)).then(function(res1){
            console.log("all document");
            console.log(res1);
            $scope.linkDataName = res1.data;
        });
    }

    $scope.createPopUp = function(title,Info,myDate,file)
    {
        console.log('mmfmmfmfmmfm');
            popUp.style.display = "block";
            $scope.title = title;
            $scope.info = Info;
            $scope.date = myDate;
            $scope.file = file;

            h2_element.style.display = "block";
            h2_element.id = "linkTitle";
            h2_element.innerHTML = "choose file from list and click on the link";
            //continerLink.appendChild(h2_element);
            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];
         
            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                popUp.style.display = "none";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == popUp) {
                    popUp.style.display = "none";
                }
            }            
    }

}]);