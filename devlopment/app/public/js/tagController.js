var myTags = angular.module("mymed",['ngRoute','ngCookies','ngTagsInput']);

myTags.controller('tagsCtrl',['$scope','$http','$cookies',function($scope,$http,$cookies) {
  
  var emailCookie = $cookies.get('cookieEmail');
  var x= {};
  x.email = emailCookie;
  console.log(x);

$scope.hideme = function(){

  var categorySub = document.getElementById('categorySub');
  categorySub.style.display = "none";    
        document.getElementById('addNewTagId').style.display = "block";
        document.getElementById('allTagsId').style.display = "block";
        document.getElementById('createCategoryId').style.display = "block";
}

    var x = {};
    x.email = emailCookie; 
//http://localhost:3000/getPersonalTags
    $http.post("https://mymed1.herokuapp.com/getPersonalTags",JSON.stringify(x)).then(function(res){
     console.log(res);

       var temp = res.data;
       
       var myPersonalTags = [];
       for(var i=0; i<temp.length ; i++)
       {
         for(var j=0; j<temp[i].tags.length; j++)
         {
       
            myPersonalTags.push(temp[i].tags[j]);
         }
       }
       $scope.personalTag = myPersonalTags;
      });
   


    var newTagVal = [];

//add new tags
        console.log("newTag");

        document.getElementById("saveTag").onclick = function fun() {
            var newTags = $scope.Tags;
             saveTagFunc(newTags);
        }

//save tags in db
    function saveTagFunc(val)
    {
        console.log("saveTagFunc    " + val);
        var data = {};
        data.email = emailCookie;
        data.Tags = val;
//http://localhost:3000/addNewTag
        $http.post("https://mymed1.herokuapp.com/addNewTag",JSON.stringify(data)).then(function(docs){
            window.location = "tagsManager.html";
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
            //http://localhost:3000/removeTagMyTag
            $http.post("https://mymed1.herokuapp.com/removeTagMyTag",JSON.stringify(data)).then(function(res){
                    console.log("res  " + res);
                    window.location = "tagsManager.html";
            });
        }
    }
document.getElementById('clickTitle').style.display = "none";
document.getElementById('spanClick').style.display ="none";
document.getElementById('itemInfoM').style.display = "none";
    $scope.getDocument = function(tag)
    {
        document.getElementById('spanClick').style.display = "block";
        document.getElementById('clickTitle').style.display = "block";
        console.log("getDocument");
        //console.log(tag);
        var dataT = {};
        dataT.email = emailCookie;
        dataT.Tags = tag;
        //console.log(dataT);
        //get all docs from db by tag name
        //http://localhost:3000/getAllDocs
        //https://mymed1.herokuapp.com/getAllDocs
        //http://localhost:3000/getAllDocs
        $http.post("https://mymed1.herokuapp.com/getAllDocs",JSON.stringify(dataT)).then(function(res1){
            console.log("all document");
            console.log(res1);
            $scope.linkDataName = res1.data;
        });
    }
   
//document.getElementById('linkTitle').style.display = "none";
    $scope.createPopUp = function(title,Info,myDate,file)
    {


            $scope.title = title;
            $scope.info = Info;
            $scope.date = myDate;
            $scope.file = file;

            console.log(" $scope.title  " +  $scope.title);
            document.getElementById('itemInfoM').style.display = "block";
           //  var modal = document.getElementById("myModal");
           //  modal.style.display = "block";
           // // document.getElementById('linkTitle').style.display = "block";
 
           //  // Get the <span> element that closes the modal
           //  var span = document.getElementsByClassName("close")[0];
         
           //  // When the user clicks on <span> (x), close the modal
           //  span.onclick = function() {
           //      modal.style.display = "none";
           //  }

            // When the user clicks anywhere outside of the modal, close it
            // window.onclick = function(event) {
            //     if (event.target == modal) {
            //         modal.style.display = "none";
            //     }
            // }            
    }

//create new category
        document.getElementById("buttonCategory").onclick = function fun() {
            var newCategory = $scope.category;
            var newSubCat = $scope.TagsCat;
            createNewCat(newCategory,newSubCat);
        }

    $scope.loadTags = function($query) {
        //http://localhost:3000/getTagsSeclect/
        return $http.get("https://mymed1.herokuapp.com/getTagsSeclect/"+emailCookie,{ cache: true}).then(function(response) {
            var tags = response.data;
            return tags.filter(function(tag) {
                return tag;
            });
        });
    };

    $scope.loadCategory = function($query){
        var data = {};
        data.email = emailCookie;
        //http://localhost:3000/getPersonalTags
        return $http.post("https://mymed1.herokuapp.com/getPersonalTags",JSON.stringify(data)).then(function(response) {
            console.log(response.data);
            var tags = [];
            for(var i=0; i<response.data.length; i++)
            {
    
                for(var j=0; j<response.data[i].tags.length; j++)
                {
                  
                    tags.push(response.data[i].tags[j].name);
                }
            }
            return tags.filter(function(tag) {
                return tag;
            });
        });  
    };



    function createNewCat(valCat,valTag)
    {
      
        var data = {};
        data.email = emailCookie;
        data.tags = valTag;
        data.category = valCat;
       //http://localhost:3000/addNewCategory
        $http.post("https://mymed1.herokuapp.com/addNewCategory",JSON.stringify(data)).then(function(res){
            window.location = "tagsManager.html";
        });

    }

    
    //get navbar
    var getCat = {};
    getCat.email = emailCookie;
    //http://localhost:3000/getCategory
    $http.post("https://mymed1.herokuapp.com/getCategory",JSON.stringify(getCat)).then(function(result){
        var categoryNav = [];
        for(var i=0;i<result.data.length;i++)
        {
            categoryNav.push(result.data[i].category);
        }
        
        //add elements to navbar
        $scope.nav = categoryNav;
    });   

    $scope.getSubCat = function(catName)
    {
        var categorySub = document.getElementById('categorySub');
        categorySub.style.display = "block";   
        
        document.getElementById('addNewTagId').style.display = "none";
        document.getElementById('allTagsId').style.display = "none";
        document.getElementById('createCategoryId').style.display = "none";
        
        var sub = {};
        sub.email = emailCookie;
        sub.category = catName;
        //http://localhost:3000/getSubCategory
        $http.post("https://mymed1.herokuapp.com/getSubCategory",JSON.stringify(sub)).then(function(result){
            
            var subCat = [];
            for(var i=0; i<result.data.length; i++)
            {
               
               for(var j=0; j<result.data[i].tags.length; j++)
               {
                    
                    subCat.push(result.data[i].tags[j].text);
               }
            }
           
            $scope.sub = subCat;
        });
    }
}]);