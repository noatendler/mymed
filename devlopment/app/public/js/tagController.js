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
    var title_category = document.getElementById('categoryTitle');
    var category_input = document.getElementById('category');
    var button_Category = document.getElementById('buttonCategory');
    var sub_category = document.getElementById('subCategory');
    var TagsCat_input = document.getElementById('TagsCat');
    var title = document.getElementById('titleTag');
    var input = document.getElementById('Tags');
    var btn_save = document.getElementById('saveTag');
    var popUp = document.getElementById('myModal');
    
    popUp.style.display = "none";
    h1_element.style.display = "none";
    btn_save.style.display = "none";
    title.style.display = "none";
    input.style.display = "none";
    TagsCat_input.style.display = "none";
    sub_category.style.display = "none";
    button_Category.style.display = "none";
    category_input.style.display = "none";
    title_category.style.display = "none";
    h2_element.style.display = "none";

//get all tags by user
    $scope.allTags = function(){
    console.log("allTags");
    h1_element.style.display = "block";

    var x = {};
    x.email = emailCookie; 
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
            console.log("good");
            var data ={};
            data.email = emailCookie;
            data.tag = tagName;
            //console.log(data);
            $http.post('http://localhost:3000/removeTagMyTag',JSON.stringify(data)).then(function(res){
                    console.log("res  " + res);
                    window.location = "tagsManager.html";
            });
        }
    }

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

//create new category
    $scope.newCategory = function()
    {
        //console.log("newCategory");
        title_category.style.display = "block";
        category_input.style.display = "block";
        button_Category.style.display = "block";
        sub_category.style.display = "block";
        TagsCat_input.style.display = "block";

        document.getElementById("buttonCategory").onclick = function fun() {
            var newCategory = $scope.category;
            var newSubCat = $scope.TagsCat;
             //console.log(newCategory);
            createNewCat(newCategory,newSubCat);
        }
    }

    $scope.loadTags = function($query) {
        return $http.get('http://localhost:3000/getTags/'+emailCookie,{ cache: true}).then(function(response) {
            var tags = response.data;
            return tags.filter(function(tag) {
                return tag;
            });
        });
    };

    $scope.loadCategory = function($query){
        var data = {};
        data.email = emailCookie;
        return $http.post('http://localhost:3000/getPersonalTags',JSON.stringify(data)).then(function(response) {
            console.log(response.data);
            var tags = [];
            for(var i=0; i<response.data.length; i++)
            {
                //console.log(response.data[i].tags);
                for(var j=0; j<response.data[i].tags.length; j++)
                {
                    //console.log(response.data[i].tags[j].name);
                    tags.push(response.data[i].tags[j].name);
                }
            }
           // console.log(tags);
            //var tags = response.data;
            return tags.filter(function(tag) {
                return tag;
            });
        });  
    };



    function createNewCat(valCat,valTag)
    {
        //console.log(val);
        var data = {};
        data.email = emailCookie;
        data.tags = valTag;
        data.category = valCat;

        //console.log(data);
        $http.post('http://localhost:3000/addNewCategory',JSON.stringify(data)).then(function(res){
            console.log("res cat    " + res.data);
            ////create category on nav bar 
            // if(res.data == "saved" || res.data == "create")
            // {

            // }
        });

    }


}]);