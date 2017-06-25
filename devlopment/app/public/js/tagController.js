var myTags = angular.module("mymed",['ngRoute','ngCookies','ngTagsInput']);

myTags.controller('tagsCtrl',['$scope','$http','$cookies',function($scope,$http,$cookies) {
  
  var emailCookie = $cookies.get('cookieEmail');
  var x= {};
  x.email = emailCookie;
  console.log(x);

$scope.hideme = function(){
console.log("in hide me");   
  document.getElementById('addNewTagId').style.display = "block";
  document.getElementById('allTagsId').style.display = "block";
  document.getElementById('createCategoryId').style.display = "block";
}

    var x = {};
    x.email = emailCookie; 
//http://localhost:3000/getPersonalTags
//https://mymed1.herokuapp.com/getPersonalTags
    $http.post("https://mymed2.herokuapp.com/getPersonalTags",JSON.stringify(x)).then(function(res){
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
       //$scope.personalTag = myPersonalTags;
      });
   


    var newTagVal = [];

//add new tags
        console.log("newTag");

        document.getElementById("saveTag").onclick = function fun() {
            var newTags = $scope.Tags;
             //console.log($scope.Tags);
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
//https://mymed1.herokuapp.com/addNewTag
        $http.post("https://mymed2.herokuapp.com/addNewTag",JSON.stringify(data)).then(function(docs){
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
            //https://mymed1.herokuapp.com/removeTagMyTag
            $http.post("https://mymed2.herokuapp.com/removeTagMyTag",JSON.stringify(data)).then(function(res){
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
        //https://mymed2.herokuapp.com/getAllDocs
        $http.post("http://localhost:3000/getAllDocs",JSON.stringify(dataT)).then(function(res1){
            console.log("all document");
            console.log(res1.data);
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
            console.log($scope.TagsCat);
            console.log($scope.category);
            createNewCat(newCategory,newSubCat);
        }

    $scope.loadTags = function($query) {
      //http://localhost:3000/getTags/
    return $http.get("https://mymed2.herokuapp.com/getTags/"+emailCookie,{ cache: true}).then(function(response) {
      var tags = response.data;
      return tags.filter(function(tag) {
        //return tag.toLowerCase();
        return tag.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    });
  };

    $scope.loadCategory = function($query){
        var data = {};
        data.email = emailCookie;
        //http://localhost:3000/getPersonalTags
        //https://mymed1.herokuapp.com/getPersonalTags
        return $http.post("https://mymed2.herokuapp.com/getPersonalTags",JSON.stringify(data)).then(function(response) {
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
        console.log(data);
       //http://localhost:3000/addNewCategory
       //https://mymed2.herokuapp.com/addNewCategory
        $http.post("http://localhost:3000/addNewCategory",JSON.stringify(data)).then(function(res){
            window.location = "tagsManager.html";
        });

    }

    
    //get navbar
    var getCat = {};
    getCat.email = emailCookie;
    var categoryAndSub = [];
    var myCategories = [];
    var myTags = [];
    var subCategory = [];
    var subCatNum = [];
    var tagsNoSub = [];
    var finalTags = [];
    //http://localhost:3000/getSubCateygoryEmail

     $http.post("https://mymed2.herokuapp.com/getSubCateygoryEmail",JSON.stringify(getCat)).then(function(result){
        for(var i=0; i<result.data.length; i++){
           // console.log(result.data[i]);
           categoryAndSub.push(result.data[i]);
        }
    
    //http://localhost:3000/getCategory
    //https://mymed1.herokuapp.com/getCategory
        $http.post("https://mymed2.herokuapp.com/getCategoryByUser",JSON.stringify(getCat)).then(function(result){
           for(var i=0; i<result.data.length; i++)
           {
             myCategories.push(result.data[i].Category);
             
             for(var j=0; j<result.data[i].tags.length; j++)
             {
                myTags.push({name:result.data[i].tags[j].name, number:result.data[i].tags[j].number});
             }
           }
                    for(var j=0; j<myTags.length; j++)
                    {
                        var isSet=0;
                        //console.log("this is the name (all tags) "+ myTags[j].name);
                        for(var k=0; k<categoryAndSub.length; k++)
                        {
                           for(var t=0; t<categoryAndSub[k].tags.length; t++)
                           {
                            // console.log("sub   "+categoryAndSub[k].tags[t].name);
                            // console.log("**********************************");
                            // console.log("this is the name (all tags) "+ myTags[j].name);
                             if(categoryAndSub[k].tags[t].name === myTags[j].name)
                             {
                                isSet=1;
                                //console.log(categoryAndSub[k].category);
                                //console.log('belongs to '+ myTags[j].name);
                                subCatNum.push({category:categoryAndSub[k].category,name:myTags[j].name,number:myTags[j].number});
                             }
                             else
                             {
                                finalTags.push({name:myTags[j].name,number:myTags[j].number});
                             }
                           }
                        }
                        if(isSet==0)
                        {
                            console.log("************************");
                            tagsNoSub.push({name: myTags[j].name, number: myTags[j].number});       
                        }
                    }
                    // console.log("tagsNoSub   " + subCatNum);
                    $scope.tagF = tagsNoSub;
                    $scope.sub = subCatNum;
                    $scope.tag = tagsNoSub;

                    // for(var i=0; i<subCatNum.length; i++){
                    // console.log("subCatNum  "  + subCatNum[i].name);
                    // }
                    // for(var j=0; j<tagsNoSub.length; j++){
                    // console.log("tagsNoSub   " + tagsNoSub[j].name);
                    // }
        });    
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
        //https://mymed1.herokuapp.com/getSubCategory
        $http.post("https://mymed2.herokuapp.com/getSubCategory",JSON.stringify(sub)).then(function(result){
            
            var subCat = [];
            for(var i=0; i<result.data.length; i++)
            {
               
               for(var j=0; j<result.data[i].tags.length; j++)
               {
                    
                    subCat.push(result.data[i].tags[j].text);
               }
            }

        });
    }
                var indexedTeams = [];
    
    $scope.tagsToFilter = function() {
        indexedTeams = [];
        return $scope.sub;
    }
    
    $scope.filterTags = function(tag) {
        var teamIsNew = indexedTeams.indexOf(tag.category) == -1;
        if (teamIsNew) {
            indexedTeams.push(tag.category);
        }
        return teamIsNew;
    }
}]);
