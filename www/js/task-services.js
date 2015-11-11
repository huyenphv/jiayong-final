angular.module('jiaYongApp.services', [])

.factory('TasksCrud', ['$window', function($window, $rootScope, $http) {
  return {
    createTask: function(task, type, parent, child) {
      var relationship = "";
      if (type = "proposed"){
        relationship = "proposedTasks";
      } else {
        relationship = "availableTasks";
      }
      $http.post("http://161.202.13.188:9000/api/object/create",JSON.stringify(task),config)
      .success(function(data, status) {
       $http.post("http://161.202.13.188:9000/api/object/"+ child.id +"/relationship/add/"+data.id,
        {
          
          "appId": 8,
          "propertyName": relationship

        },config)
      .success(function(response, status) {
        $http.post("http://161.202.13.188:9000/api/object/" + parent.id +"/relationship/add/"+ data.id,
          {
            "appId": 8,
            "propertyName": relationship        
          
          },config)
          .success(function(response, status) {
             return data;
          }).error(function(response, status){
            console.log(response);
          });
        }).error(function(response, status){
          console.log(response);
        });
         // window.location.href = 'jiaYong.html#/my-tasks';
      }).error(function(response, status){
        console.log(response);
      });
    },
    updateTask: function(task, request, parent, child) {
        $http.put("http://161.202.13.188:9000/api/object/" + task.id + "/update/properties",request,config)
      .success(function(data, status) {
          parent.appId = 8;
          child.appId = 8;
          $http.put("http://161.202.13.188:9000/api/object/update/" + parent.id,JSON.stringify(parent),config)
          .success(function(response, status) {
              $http.put("http://161.202.13.188:9000/api/object/update/" + child.id,JSON.stringify(child),config)
              .success(function(response, status) {
                 // $state.go('menu.tab.my-tasks',null,{reload:true});
                 return data;
              }).error(function(data, status){
                console.log(data);
              })     
      }).error(function(response, status){
        console.log(response);
      })
     }).error(function(response, status){
        console.log(reponse);
      });
    },
    changeTaskStatus: function(task, request) {
      $http.put("http://161.202.13.188:9000/api/object/" + task.id + "/update/properties",request,config)
    .success(function(data, status) {
        $http.get(
          "http://161.202.13.188:9000/api/object/get/app/8/objecttype/34",config)
        .success(function(data, status) { 
            return data;
        }).error(function(data, status){
            return data;
        });
     }).error(function(data, status){
        console.log(data);
      });
     
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);

