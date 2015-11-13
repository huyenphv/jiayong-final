angular.module('jiaYongApp.controllers', [])
/* @screen: Logout of the app */
.controller('LogoutCtrl', function(
$scope, $http, $ionicModal, $ionicActionSheet, $ionicLoading, $rootScope, $window)
{
  $scope.tryLogout = function(){
    var config = { cache: false };
    
    $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Logging out..'
    });

      window.localStorage.removeItem('currentUser');
      window.location.href = 'index.html#/login';
      $ionicLoading.hide();
  
  };

  $scope.tryLogout();
})

.controller('MyTasksCtrl', function($rootScope, $filter, $scope,$window, $http, $state, $ionicPopup, $ionicLoading) {
  var config = { cache: false };
  if(!$rootScope.activeTab)
  {
    $rootScope.activeTab = 1;
  }
  var newSignIn = JSON.parse($window.localStorage['newSignIn']) ;
  if (newSignIn)
  {
    var alertPopup = $ionicPopup.alert({
       title: 'TASK 1 OF 1',
       template: '<center>Welcome to JiaYong web experiment. Thank you for your participant. Please proceed with "<b>TASK 1</b>".</center>'
     });
     alertPopup.then(function(res) {
          newSignIn = false;
          $window.localStorage['newSignIn'] = JSON.stringify(newSignIn);
          $state.go('menu.tab.my-tasks',{},{reload:true});
          // $ionicLoading.hide();
    });
       // $scope.$broadcast('scroll.refreshComplete');
  };
  
  $scope.refresh = function(){
   var alertPopup = $ionicPopup.alert({
     title: 'New Notification',
     template: '<center>A new change has been made! Refreshing the application...</center>'
   });
   alertPopup.then(function(res) {
      $http.get(
      "http://161.202.13.188:9000" + "/api/object/get/app/8/objecttype/34",config)
    .success(function(data, status) { 
        $window.localStorage['users'] = JSON.stringify(data);
        // $window.localStorage['daisy'] = JSON.stringify(data[1]);
        $window.localStorage['daisy'] = JSON.stringify($filter('filter')(data, {name:"Daisy"})[0]);
        console.log($window.localStorage['daisy'] );
        // $ionicLoading.hide();
        // $window.localStorage['currentUser'] = JSON.stringify(data);
        // $window.localStorage['avail'] = JSON.stringify(data[0].availabTasks);
        $window.localStorage['luke'] = JSON.stringify($filter('filter')(data, {name:"Luke"})[0]);
        console.log($window.localStorage['luke'] );
        $state.go('menu.tab.my-tasks',{},{reload:true});
        $ionicLoading.hide();
    }).error(function(data, status){
      $ionicLoading.hide();
      $scope.message = data;
    }); 
     $scope.$broadcast('scroll.refreshComplete');
   });
    
  }
  $scope.changeActiveTab = function(tab){
    if ($rootScope.activeTab == tab){
      $rootScope.activeTab = 0;
    }else{
      $rootScope.activeTab = tab; 
    }
     
  }
  $scope.currentUser = JSON.parse($window.localStorage.getItem("daisy"));
  
    //detail view
  $scope.detail = function(task){
      $state.go('menu.tab.manage-task',{'id' : task.id});
  };

  $scope.viewPendingApprovalForCompletedTask = function(task){
      $state.go('menu.tab.pending-approval-completed-task-view',{'id' : task.id});
  };

  $scope.viewApprovedTask = function (task){
    $state.go('menu.tab.view-completed-task',{'id':task.id});
  };

  $scope.viewRejectedTask = function (task){
    $state.go('menu.tab.view-completed-task',{'id':task.id});
  };

  $scope.viewInProgressTask = function (task){
    $state.go('menu.tab.view-completed-task',{'id':task.id});
  };

  $scope.viewProposedTask = function(task){
    $state.go('menu.tab.pending-approval-task-view',{'id' :task.id});
  }
})

// .controller('ViewMyTaskDetailCtrl', function($scope, $filter,$window, $state, $ionicLoading, $stateParams){
//   var config = { cache: false };
//   // get individual task according to ID
//   $scope.taskId = $stateParams.id;

//   $scope.allTasks = JSON.parse($window.localStorage['tasks']);

//   $scope.task = $filter('filter')($scope.allTasks, {id:$scope.taskId})[0];

// })

.controller('ViewCompletedTaskDetailCtrl', function($scope, $filter,$window, $state, $ionicLoading, $stateParams){
  var config = { cache: false };
  // get individual task according to ID
  $scope.taskId = $stateParams.id;

  $scope.allTasks = JSON.parse($window.localStorage['daisy']).completedTasks;
  console.log($scope.allTasks);
  $scope.task = $filter('filter')($scope.allTasks, {id:$scope.taskId})[0];
  if (typeof $scope.task === 'undefined'){
    $scope.allTasks = JSON.parse($window.localStorage['daisy']).rejectedTasks;
    console.log($scope.allTasks);
    $scope.task = $filter('filter')($scope.allTasks, {id:$scope.taskId})[0];
    if (typeof $scope.task === 'undefined'){
      $scope.allTasks = JSON.parse($window.localStorage['daisy']).inProgressTasks;
      console.log($scope.allTasks);
      $scope.task = $filter('filter')($scope.allTasks, {id:$scope.taskId})[0];    
    }    
  }
  $scope.showSink = true;
  $scope.switchImage = function()
  {
      $scope.showSink = !$scope.showSink;
  }

})

.controller('CreateTaskCtrl', function($rootScope, $scope, $state, $window, $http,$ionicLoading, $rootScope) {
  var config = { cache: false };
  var self = this;
  $scope.currentUser = JSON.parse($window.localStorage.getItem("daisy"));
  $scope.luke = JSON.parse($window.localStorage.getItem("luke"));
  console.log($scope.luke);
  $scope.task =
  {
    country: "Singapore",
    region: "",
    city: "Singapore",
    name: "",
    objectTypeId: 35,
    userId: 7,
    appId: 8,
    name: "",
    startDate: "",
    startTime: "",
    description: "",
    Average: 0,
    Good: 0,
    Excellent: 0,
    assignTo: 0
    
  };


    // if ($scope.currentUser.name == "Daisy")
    // {
    //   $scope.contacts = 
    //   [ {name : "Luke",
    //       id : 871
    //     },
    //     {name : "Ben",
    //       id : 872
    //     }

    //   ];
    // };
    
    $scope.tryCreate = function(){
      $ionicLoading.show({
          template: '<i class="icon ion-loading-c"></i> Creating task..'
      });
      $scope.newTask =
      {
        country: "Singapore",
        region: "Singapore",
        city: "Singapore",
        name: $scope.task.name,
        objectTypeId: 35,
        userId: 7,
        appId: 8,
        properties: [
            {name: $scope.task.name},
            {startDate: $scope.task.startDate},
            {startTime: $scope.task.startTime},
            {description: $scope.task.description},
            {Average: $scope.task.averageAmount},
            {Good: $scope.task.goodAmount},
            {Excellent: $scope.task.excellentAmount},
            {isAvailable: "true"},
            {isCompleted: "false"},
            {isProposed: "false"},
            {isApproved: "false"},
            {isPending: "false"},
            {isApprovedProposed: "false"},
            {isRejected: "false"},
            {rejectedMessage: ""},
            {reward: 0},
            {photos: []},
            {assignTo: "Luke"},
        ]
      };
    $scope.daisy = JSON.parse($window.localStorage.getItem("daisy"));
    $scope.luke = JSON.parse($window.localStorage.getItem("luke"));
    $http.post("http://161.202.13.188:9000/api/object/create",JSON.stringify($scope.newTask),config)
    .success(function(data, status) {
       $scope.daisy.availableTasks.push(data);
       $scope.luke.availableTasks.push(data);
       $window.localStorage['daisy'] = JSON.stringify($scope.daisy);
       $window.localStorage['luke'] = JSON.stringify($scope.luke);
       $http.post("http://161.202.13.188:9000/api/object/871/relationship/add/"+data.id,
        {
          
          "appId": 8,
          "propertyName": "availableTasks"

        },config)
      .success(function(response, status) {
        $http.post("http://161.202.13.188:9000/api/object/873/relationship/add/"+ data.id,
          {
            "appId": 8,
            "propertyName": "availableTasks"        
          
        },config)
        .success(function(data, status) {
           
        }).error(function(data, status){
          console.log(data);
        })
      }).error(function(data, status){
        console.log(data);
      });
      $state.go('menu.tab.available-tasks',{},{reload:true});
       // window.location.href = 'jiaYong.html#/my-tasks';
    }).error(function(data, status){
      console.log(data);
    }).finally(function(){
          $ionicLoading.hide();
    });
  };
})

.controller('ManageTaskCtrl', function($rootScope, $scope, $state, $filter, $stateParams, $window, $http,$ionicLoading, $rootScope) {
  var config = { cache: false };
  $scope.users = JSON.parse($window.localStorage.getItem("users"));
  $scope.currentUser = JSON.parse($window.localStorage.getItem("daisy"));
  $scope.luke = JSON.parse($window.localStorage.getItem("luke"));
    // get individual task according to ID
  $scope.taskId = $stateParams.id;

  $scope.allAvailableTasks = $scope.currentUser.availableTasks;

  $scope.task = $filter('filter')($scope.allAvailableTasks, {id:$scope.taskId})[0];
  $scope.assignToUser = $filter('filter')($scope.users, {id:$scope.task.assignTo})[0];
  
  $scope.tryUpdate = function(){
      $ionicLoading.show({
          template: '<i class="icon ion-loading-c"></i> Modifying task..'
      });
      $scope.newTask =
      {
        country: "Singapore",
        region: "Singapore",
        city: "Singapore",
        name: $scope.task.name,
        objectTypeId: 35,
        userId: 7,
        appId: 8,
        properties: [
            {name: $scope.task.name},
            {startDate: $scope.task.startDate},
            {startTime: $scope.task.startTime},
            {description: $scope.task.description},
            {Average: $scope.task.Average},
            {Good: $scope.task.Good},
            {Excellent: $scope.task.Excellent},
            {isAvailable: "true"},
            {isCompleted: "false"},
            {isProposed: "false"},
            {isApproved: "false"},
            {isApprovedProposed: "false"},
            {isRejected: "false"},
            {rejectedMessage: ""},
            {reward: 0},
            {isPending: "false"},
            {photos: []},
            {assignTo: $scope.task.assignTo}
        ]
      };
    $scope.daisy = JSON.parse($window.localStorage.getItem("daisy"));
    $scope.luke = JSON.parse($window.localStorage.getItem("luke"));
    $http.put("http://161.202.13.188:9000/api/object/update/" + $scope.taskId,JSON.stringify($scope.newTask),config)
    .success(function(data, status) {
       // // $scope.allAvailableTasks.push(data);
       // $scope.luke.availableTasks.push(data);
       // $window.localStorage['daisy'] = JSON.stringify($scope.daisy);
       // $window.localStorage['luke'] = JSON.stringify($scope.luke);
       // window.location.href = 'jiaYong.html#/my-tasks';
       $http.get(
          "http://161.202.13.188:9000/api/object/get/app/8/objecttype/34",config)
        .success(function(data, status) { 
            $window.localStorage['users'] = JSON.stringify(data);
            $window.localStorage['daisy'] = JSON.stringify($filter('filter')(data, {name:"Daisy"})[0]);
            console.log($window.localStorage['daisy']);
            // $window.localStorage['avail'] = JSON.stringify(data[0].availabTasks);
            $window.localStorage['luke'] = JSON.stringify($filter('filter')(data, {name:"Luke"})[0]);
            $ionicLoading.hide();
            $state.go('menu.tab.available-tasks',{},{reload:true});
        }).error(function(data, status){
          $ionicLoading.hide();
          $scope.message = data;
        });
    }).error(function(data, status){
      console.log(data);
    }).finally(function(){
        $ionicLoading.hide();
    });
    
  };
})
.controller('ViewCompletedPendingApprovalTaskDetailCtrl', function($rootScope, $filter, TasksCrud, $ionicPopup, $scope, $stateParams, $ionicLoading, $window, $http, $filter, $rootScope, $state) {
   var config = { cache: false };
    // get individual task according to ID
    $scope.taskId = $stateParams.id;
    $scope.currentUser = JSON.parse($window.localStorage.getItem("currentUser"));
    $scope.luke = JSON.parse($window.localStorage.getItem("luke"));
    $scope.daisy = JSON.parse($window.localStorage.getItem("daisy"));
    $scope.allPendingTasks = JSON.parse($window.localStorage['daisy']).pendingEvaluateTasks;
    $scope.task = $filter('filter')($scope.allPendingTasks, {id:$scope.taskId})[0];
    if (typeof $scope.task === "undefined")
    {
      $scope.allAvailableTasks = JSON.parse($window.localStorage['daisy']).availableTasks;
      $scope.task = $filter('filter')($scope.allAvailableTasks, {id:$scope.taskId})[0];
    }
    $scope.showSink = true;
    $scope.switchImage = function()
    {
        $scope.showSink = !$scope.showSink;
    }
    $scope.data = {
    rewardOptions: [
      {amount: $scope.task.Average, type: 'Average : $'+ $scope.task.Average},
      {amount: $scope.task.Good, type: 'Good : $'+ $scope.task.Good},
      {amount: $scope.task.Excellent, type: 'Excellent : $'+ $scope.task.Excellent}
    ],
    selectedOption: {amount: $scope.task.Excellent, type: 'Excellent'} //This sets the default value of the select in the ui
    };

    $scope.approveTask = function (){
     $scope.task.reward = $scope.data.selectedOption.amount;
     var alertPopup = $ionicPopup.alert({
       title: 'New Notification',
       template: '<center>Task is completed! Transfering money now...</center>'
     });
     alertPopup.then(function(res) {
       $ionicLoading.show({
        template: '<i class="icon ion-loading-c"></i> Approving task..'
      });
      var request = {
          appId: 8,
          properties: [
              {isApproved: "true"},
              {isPending: "false"},
              {reward : $scope.task.reward},
              {photos : JSON.stringify($scope.task.photos)}
          ]
      };
    $http.put("http://161.202.13.188:9000/api/object/" + $scope.task.id + "/update/properties",JSON.stringify(request),config)
    .success(function(data, status) {
       // $scope.allAvailableTasks.push(data);
        $scope.luke = JSON.parse($window.localStorage.getItem("luke"));
        $scope.daisy = JSON.parse($window.localStorage.getItem("daisy"));
        var taskToFindDaisy = $filter('filter')($scope.daisy.pendingEvaluateTasks, {id:$scope.task.id})[0];
        var taskToFindLuke = $filter('filter')($scope.luke.pendingEvaluateTasks, {id:$scope.task.id})[0];
        $scope.lukeListIndex = $scope.luke.pendingEvaluateTasks.indexOf(taskToFindLuke);
        $scope.daisyListIndex = $scope.daisy.pendingEvaluateTasks.indexOf(taskToFindDaisy);
        // alert($scope.lukeListIndex);
        // alert($scope.daisyListIndex);
        // $scope.luke.completedTasks.splice($scope.lukeListIndex,1);
        taskToFindLuke.isApproved = "true";
        taskToFindDaisy.isApproved = "true";
        $scope.luke.completedTasks.push(taskToFindLuke);
        $scope.luke.pendingEvaluateTasks.splice($scope.lukeListIndex,1);        
        $scope.daisy.completedTasks.push(taskToFindDaisy);
        $scope.daisy.pendingEvaluateTasks.splice($scope.daisyListIndex,1);
        alert($scope.task.reward);
        $window.localStorage['daisy'] = JSON.stringify($scope.daisy);
        $window.localStorage['luke'] = JSON.stringify($scope.luke);
        $http.put("http://161.202.13.188:9000/api/object/update/873",
          {
            "country": "Singapore",
            "region": "Singapore",
            "city": "Singapore",
            "name": "Daisy",
            "objectTypeId": 34,
            "userId": 7,
            "appId": 8,
            "id": 873,
            "properties":
            [
              {"name": "Daisy"},
              {"isParent": true},
              {"availableTasks": $scope.daisy.availableTasks},
              {"inProgressTasks": $scope.daisy.inProgressTasks},
              {"completedTasks": $scope.daisy.completedTasks},
              {"pendingEvaluateTasks": $scope.daisy.pendingEvaluateTasks},
              {"rejectedTasks": $scope.daisy.rejectedTasks},
              {"proposedTasks": $scope.daisy.proposedTasks},
              {"approvedProposedTasks": $scope.daisy.approvedProposedTasks},
              {"balance": $scope.daisy.balance}
            ]
          }
          ,config)
        .success(function(response, status) {
          $http.put("http://161.202.13.188:9000/api/object/update/871",          
          {
            "country": "Singapore",
            "region": "Singapore",
            "city": "Singapore",
            "name": "Luke",
            "objectTypeId": 34,
            "userId": 7,
            "appId": 8,
            "id": 871,
            "balance": ($scope.luke.balance + $scope.task.reward),
            "properties":
            [
              {"name": "Luke"},
              {"isParent": false},
              {"availableTasks": $scope.luke.availableTasks},
              {"inProgressTasks": $scope.luke.inProgressTasks},
              {"completedTasks": $scope.luke.completedTasks},
              {"pendingEvaluateTasks": $scope.luke.pendingEvaluateTasks},
              {"rejectedTasks": $scope.luke.rejectedTasks},
              {"proposedTasks": $scope.luke.proposedTasks},
              {"approvedProposedTasks": $scope.luke.approvedProposedTasks},
              {"balance": parseInt($scope.luke.balance + $scope.task.reward)}
            ]
          }
          ,config)
        .success(function(data, status) {
           $rootScope.activeTab = 4;
           $state.go('menu.tab.my-tasks',{},{reload:true});
        }).error(function(data, status){
          console.log(data);
        }).finally(function(){
          $ionicLoading.hide();
        });      
    }).error(function(data, status){
      console.log(data);
    }).finally(function(){
        $ionicLoading.hide();
    });
   }).error(function(data, status){
      console.log(data);
    }).finally(function(){
        $ionicLoading.hide();
    });
  })
  };
    //   $http.put("http://161.202.13.188:9000/api/object/" + $scope.task.id + "/update/properties",JSON.stringify(request),config)
    //   .success(function(data, status) {
    //    $http.get(
    //         "http://161.202.13.188:9000/api/object/get/app/8/objecttype/34",config)
    //       .success(function(data, status) { 
    //           $window.localStorage['users'] = JSON.stringify(data);
    //           $window.localStorage['daisy'] = JSON.stringify($filter('filter')(data, {name:"Daisy"})[0]);
    
    //         $http.put("http://161.202.13.188:9000/api/object/update/871",          
    //         {
    //           "country": "Singapore",
    //           "region": "Singapore",
    //           "city": "Singapore",
    //           "name": "Luke",
    //           "objectTypeId": 34,
    //           "userId": 7,
    //           "appId": 8,
    //           "id": 871,
    //           "balance": (data[2].balance + $scope.task.reward),
    //           "properties":
    //           [
    //             {"name": "Luke"},
    //             {"isParent": false},
    //             {"availableTasks": $scope.luke.availableTasks},
    //             {"inProgressTasks": $scope.luke.inProgressTasks},
    //             {"completedTasks": $scope.luke.completedTasks},
    //             {"pendingEvaluateTasks": $scope.luke.pendingEvaluateTasks},
    //             {"rejectedTasks": $scope.luke.rejectedTasks},
    //             {"proposedTasks": $scope.luke.proposedTasks},
    //             {"approvedProposedTasks": $scope.luke.approvedProposedTasks},
    //             {"balance": parseInt(data[2].balance + $scope.task.reward)}
    //           ]
    //         }
    //         ,config)
    //         .success(function(data, status) {
    //           $window.localStorage['luke'] = JSON.stringify(data);
    //           $state.go('menu.tab.my-tasks',{},{reload:true});
    //         }).error(function(data, status){
    //           console.log(data);
    //         }) 
    //  }).error(function(data, status){
    //     console.log(data);
    //   })
    // }).error(function(data, status){
    //   console.log(data);
    // }).finally(function(){
    //     $ionicLoading.hide();
    // });
  
    //  });
      
// };

    $scope.rejectTask = function()
  {
      $ionicLoading.show({
        template: '<i class="icon ion-loading-c"></i> Rejecting task..'
      });
      var request = {
        appId: 8,
        properties: [
            {isAvailable: "true"},
            {isRejected: "true"},
            // {isCompleted: "false"},
            {rejectedMessage: $scope.task.rejectedMessage}
        ]
      };
    $http.put("http://161.202.13.188:9000/api/object/" + $scope.task.id + "/update/properties",JSON.stringify(request),config)
    .success(function(data, status) {
       // $scope.allAvailableTasks.push(data);
        $scope.luke = JSON.parse($window.localStorage.getItem("luke"));
        $scope.daisy = JSON.parse($window.localStorage.getItem("daisy"));
        var taskToFindDaisy = $filter('filter')($scope.daisy.pendingEvaluateTasks, {id:$scope.task.id})[0];
        var taskToFindLuke = $filter('filter')($scope.luke.pendingEvaluateTasks, {id:$scope.task.id})[0];
        $scope.lukeListIndex = $scope.luke.pendingEvaluateTasks.indexOf(taskToFindLuke);
        $scope.daisyListIndex = $scope.daisy.pendingEvaluateTasks.indexOf(taskToFindDaisy);
        // alert($scope.lukeListIndex);
        // alert($scope.daisyListIndex);
        $scope.luke.pendingEvaluateTasks.splice($scope.lukeListIndex,1);
        taskToFindLuke.isAvailable = "true";
        taskToFindLuke.isRejected = "true";
        taskToFindLuke.rejectedMessage = $scope.task.rejectedMessage;
        taskToFindDaisy.isAvailable = "true";
        taskToFindDaisy.isRejected = "true";
        taskToFindDaisy.rejectedMessage = $scope.task.rejectedMessage;
        $scope.luke.rejectedTasks.push(taskToFindLuke);
        $scope.daisy.pendingEvaluateTasks.splice($scope.daisyListIndex,1);
        $scope.daisy.rejectedTasks.push(taskToFindDaisy);
        $window.localStorage['daisy'] = JSON.stringify($scope.daisy);
        $window.localStorage['luke'] = JSON.stringify($scope.luke);
        $http.put("http://161.202.13.188:9000/api/object/update/873",
          {
            "country": "Singapore",
            "region": "Singapore",
            "city": "Singapore",
            "name": "Daisy",
            "objectTypeId": 34,
            "userId": 7,
            "appId": 8,
            "id": 873,
            "properties":
            [
              {"name": "Daisy"},
              {"isParent": true},
              {"availableTasks": $scope.daisy.availableTasks},
              {"inProgressTasks": $scope.daisy.inProgressTasks},
              {"completedTasks": $scope.daisy.completedTasks},
              {"pendingEvaluateTasks": $scope.daisy.pendingEvaluateTasks},
              {"rejectedTasks": $scope.daisy.rejectedTasks},
              {"proposedTasks": $scope.daisy.proposedTasks},
              {"approvedProposedTasks": $scope.daisy.approvedProposedTasks},
              {"balance": $scope.daisy.balance}
            ]
          }
          ,config)
        .success(function(response, status) {
            $http.put("http://161.202.13.188:9000/api/object/update/871",
          {
            "country": "Singapore",
            "region": "Singapore",
            "city": "Singapore",
            "name": "Luke",
            "objectTypeId": 34,
            "userId": 7,
            "appId": 8,
            "id": 871,
            "properties":
            [
              {"name": "Luke"},
              {"isParent": false},
              {"availableTasks": $scope.luke.availableTasks},
              {"inProgressTasks": $scope.luke.inProgressTasks},
              {"completedTasks": $scope.luke.completedTasks},
              {"pendingEvaluateTasks": $scope.luke.pendingEvaluateTasks},
              {"rejectedTasks": $scope.luke.rejectedTasks},
              {"proposedTasks": $scope.luke.proposedTasks},
              {"approvedProposedTasks": $scope.luke.approvedProposedTasks},
              {"balance": $scope.luke.balance}
            ]
          }
              ,config)
            .success(function(data, status) {
               $rootScope.activeTab = 4;
               $state.go('menu.tab.my-tasks',{},{reload:true});
            }).error(function(data, status){
              console.log(data);
            }).finally(function(){
              $ionicLoading.hide();
            });      
    }).error(function(data, status){
      console.log(data);
    }).finally(function(){
        $ionicLoading.hide();
    });
   }).error(function(data, status){
      console.log(data);
    }).finally(function(){
        $ionicLoading.hide();
    });
  };
     

})
.controller('BrowseTasksCtrl', function($filter, $scope, $window, $state, $http, $ionicPopup, $ionicLoading ) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  var config = { cache: false };
  $scope.activeTab = 1;
  $scope.refresh = function(){
   var alertPopup = $ionicPopup.alert({
     title: 'New Notification',
     template: '<center>A new change has been made! Refreshing the application...</center>'
   });
   alertPopup.then(function(res) {
      $http.get(
      "http://161.202.13.188:9000" + "/api/object/get/app/8/objecttype/34",config)
    .success(function(data, status) { 
        $window.localStorage['users'] = JSON.stringify(data);
        $window.localStorage['daisy'] = JSON.stringify($filter('filter')(JSON.parse($window.localStorage['users']), {name:"Daisy"})[0]);
        console.log($window.localStorage['daisy']);
        // $ionicLoading.hide();
        // $window.localStorage['currentUser'] = JSON.stringify(data);
        // $window.localStorage['avail'] = JSON.stringify(data[0].availabTasks);
        $window.localStorage['luke'] = JSON.stringify($filter('filter')(JSON.parse($window.localStorage['users']), {name:"Luke"})[0]);
        console.log($window.localStorage['luke']);
        $state.go('menu.tab.available-tasks',{},{reload:true});
        $ionicLoading.hide();
    }).error(function(data, status){
      $ionicLoading.hide();
      $scope.message = data;
    }); 
     $scope.$broadcast('scroll.refreshComplete');
   });
    
  }
  $scope.changeActiveTab = function(tab){
    if ($rootScope.activeTab == tab){
      $rootScope.activeTab = 0;
    }else{
      $rootScope.activeTab = tab; 
    }
     
  }
  $scope.currentUser = JSON.parse($window.localStorage.getItem("daisy"));
  $scope.detail = function(task){
      $state.go('menu.tab.manage-task',{'id' : task.id});
  };
  // $scope.viewApproved = function(task){
  //   $state.go('menu.tab.pending-approval-task-view',{'id' : task.id});
  // }

})

.controller('ViewPendingApprovalTaskDetailCtrl', function($rootScope, $filter, TasksCrud, $scope, $stateParams, $window, $ionicLoading, $http, $filter, $rootScope, $state) {
   var config = { cache: false };
    // get individual task according to ID
    $scope.taskId = $stateParams.id;
    $scope.currentUser = JSON.parse($window.localStorage.getItem("currentUser"));
    $scope.luke = JSON.parse($window.localStorage.getItem("luke"));
    $scope.daisy = JSON.parse($window.localStorage.getItem("daisy"));
    $scope.allProposedTasks = JSON.parse($window.localStorage['daisy']).proposedTasks;
    $scope.task = $filter('filter')($scope.allProposedTasks, {id:$scope.taskId})[0];
    if (typeof $scope.task === "undefined")
    {
      $scope.allAvailableTasks = JSON.parse($window.localStorage['daisy']).availableTasks;
      $scope.task = $filter('filter')($scope.allAvailableTasks, {id:$scope.taskId})[0];
    }
    console.log($scope.task);
    $scope.approveTask = function (){
      $ionicLoading.show({
        template: '<i class="icon ion-loading-c"></i> Approving task..'
      });
      var request = {
          appId: 8,
          properties: [
              {isApprovedProposed: "true"},
              {isAvailable: "true"},
              {isRejected: "false"},
              {isPending: "false"}
          ]
      };

    $http.put("http://161.202.13.188:9000/api/object/" + $scope.task.id + "/update/properties",JSON.stringify(request),config)
    .success(function(data, status) {
       // $scope.allAvailableTasks.push(data);
       // var index = $scope.luke.proposedTasks.indexOf(data);

        $scope.luke = JSON.parse($window.localStorage.getItem("luke"));
        $scope.daisy = JSON.parse($window.localStorage.getItem("daisy"));
        var taskToFindDaisy = $filter('filter')($scope.daisy.proposedTasks, {id:$scope.task.id})[0];
        var taskToFindLuke = $filter('filter')($scope.luke.proposedTasks, {id:$scope.task.id})[0];
        $scope.lukeListIndex = $scope.luke.proposedTasks.indexOf(taskToFindLuke);
        $scope.daisyListIndex = $scope.daisy.proposedTasks.indexOf(taskToFindDaisy);
        // alert($scope.lukeListIndex);
        // alert($scope.daisyListIndex);
        taskToFindLuke.isAvailable = "true";
        taskToFindLuke.isRejected = "false";
        taskToFindLuke.isPending = "false";
        taskToFindLuke.isApprovedProposed = "true";
        taskToFindDaisy.isAvailable = "true";
        taskToFindDaisy.isPending = "false";
        taskToFindDaisy.isRejected = "false";
        taskToFindDaisy.isApprovedProposed = "true";
        $scope.luke.proposedTasks.splice($scope.lukeListIndex,1);
        $scope.luke.availableTasks.push(taskToFindLuke);
        $scope.luke.approvedProposedTasks.push(taskToFindLuke);
        $scope.daisy.proposedTasks.splice($scope.daisyListIndex,1);
        $scope.daisy.availableTasks.push(taskToFindDaisy);
        $scope.daisy.approvedProposedTasks.push(taskToFindDaisy);
        $window.localStorage['daisy'] = JSON.stringify($scope.daisy);
        $window.localStorage['luke'] = JSON.stringify($scope.luke);
        $http.put("http://161.202.13.188:9000/api/object/update/873",
          
          {
            "country": "Singapore",
            "region": "Singapore",
            "city": "Singapore",
            "name": "Daisy",
            "objectTypeId": 34,
            "userId": 7,
            "appId": 8,
            "id": 873,
            "properties":
            [
              {"name": "Daisy"},
              {"isParent": true},
              {"availableTasks": $scope.daisy.availableTasks},
              {"inProgressTasks": $scope.daisy.inProgressTasks},
              {"completedTasks": $scope.daisy.completedTasks},
              {"pendingEvaluateTasks": $scope.daisy.pendingEvaluateTasks},
              {"rejectedTasks": $scope.daisy.rejectedTasks},
              {"proposedTasks": $scope.daisy.proposedTasks},
              {"approvedProposedTasks": $scope.daisy.approvedProposedTasks},
              {"balance": $scope.daisy.balance}
            ]
          }

            ,config)
        .success(function(response, status) {
            $http.put("http://161.202.13.188:9000/api/object/update/871",          
            {
            "country": "Singapore",
            "region": "Singapore",
            "city": "Singapore",
            "name": "Luke",
            "objectTypeId": 34,
            "userId": 7,
            "appId": 8,
            "id": 871,
            "properties":
            [
              {"name": "Luke"},
              {"isParent": false},
              {"availableTasks": $scope.luke.availableTasks},
              {"inProgressTasks": $scope.luke.inProgressTasks},
              {"completedTasks": $scope.luke.completedTasks},
              {"pendingEvaluateTasks": $scope.luke.pendingEvaluateTasks},
              {"rejectedTasks": $scope.luke.rejectedTasks},
              {"proposedTasks": $scope.luke.proposedTasks},
              {"approvedProposedTasks": $scope.luke.approvedProposedTasks},
              {"balance": $scope.luke.balance}
            ]
          }
            ,config)
            .success(function(data, status) {
               $state.go('menu.tab.available-tasks',{},{reload : true});
            }).error(function(data, status){
              console.log(data);
            })      
    }).error(function(data, status){
      console.log(data);
    })
   }).error(function(data, status){
      console.log(data);
    }).finally(function(){
        $ionicLoading.hide();
    });
  };
  $scope.updateTask = function(task)
  {
      $state.go('menu.tab.edit-proposed-task',{'id' : task.id});
  };

  $scope.rejectTask = function()
  {
      $ionicLoading.show({
          template: '<i class="icon ion-loading-c"></i> Rejecting task..'
      });
      var request = {
          appId: 8,
          properties: [
              {isRejected: "true"},
              {rejectedMessage: $scope.task.rejectedMessage},
              {isPending: "false"}
          ]
      };

    $http.put("http://161.202.13.188:9000/api/object/" + $scope.task.id + "/update/properties",JSON.stringify(request),config)
    .success(function(data, status) {
       // $scope.allAvailableTasks.push(data);
       // var index = $scope.luke.proposedTasks.indexOf(data);

        $scope.luke = JSON.parse($window.localStorage.getItem("luke"));
        $scope.daisy = JSON.parse($window.localStorage.getItem("daisy"));
        var taskToFindDaisy = $filter('filter')($scope.daisy.proposedTasks, {id:$scope.task.id})[0];
        var taskToFindLuke = $filter('filter')($scope.luke.proposedTasks, {id:$scope.task.id})[0];
        $scope.lukeListIndex = $scope.luke.proposedTasks.indexOf(taskToFindLuke);
        $scope.daisyListIndex = $scope.daisy.proposedTasks.indexOf(taskToFindDaisy);
        // alert($scope.lukeListIndex);
        // alert($scope.daisyListIndex);
        taskToFindLuke.isRejected = "true";
        taskToFindLuke.isPending = "false";
        taskToFindLuke.rejectedMessage = $scope.task.rejectedMessage;
        // taskToFindDaisy.isAvailable = "true";
        // taskToFindDaisy.isPending = "false";
        // taskToFindDaisy.isApprovedProposed = "true";
        $scope.luke.rejectedTasks.push(taskToFindLuke);
        $scope.daisy.rejectedTasks.push(taskToFindDaisy);
        $scope.daisy.proposedTasks.splice($scope.daisyListIndex,1);
        $scope.luke.proposedTasks.splice($scope.lukeListIndex,1);
        // $scope.daisy.availableTasks.push(taskToFindDaisy);
        $window.localStorage['daisy'] = JSON.stringify($scope.daisy);
        $window.localStorage['luke'] = JSON.stringify($scope.luke);
        $http.put("http://161.202.13.188:9000/api/object/update/873",
          
          {
            "country": "Singapore",
            "region": "Singapore",
            "city": "Singapore",
            "name": "Daisy",
            "objectTypeId": 34,
            "userId": 7,
            "appId": 8,
            "id": 873,
            "properties":
            [
              {"name": "Daisy"},
              {"isParent": true},
              {"availableTasks": $scope.daisy.availableTasks},
              {"inProgressTasks": $scope.daisy.inProgressTasks},
              {"completedTasks": $scope.daisy.completedTasks},
              {"pendingEvaluateTasks": $scope.daisy.pendingEvaluateTasks},
              {"rejectedTasks": $scope.daisy.rejectedTasks},
              {"proposedTasks": $scope.daisy.proposedTasks},
              {"approvedProposedTasks": $scope.daisy.approvedProposedTasks},
              {"balance": $scope.daisy.balance}
            ]
          }

            ,config)
        .success(function(response, status) {
            $http.put("http://161.202.13.188:9000/api/object/update/871",          
            {
            "country": "Singapore",
            "region": "Singapore",
            "city": "Singapore",
            "name": "Luke",
            "objectTypeId": 34,
            "userId": 7,
            "appId": 8,
            "id": 871,
            "properties":
            [
              {"name": "Luke"},
              {"isParent": false},
              {"availableTasks": $scope.luke.availableTasks},
              {"inProgressTasks": $scope.luke.inProgressTasks},
              {"completedTasks": $scope.luke.completedTasks},
              {"pendingEvaluateTasks": $scope.luke.pendingEvaluateTasks},
              {"rejectedTasks": $scope.luke.rejectedTasks},
              {"proposedTasks": $scope.luke.proposedTasks},
              {"approvedProposedTasks": $scope.luke.approvedProposedTasks},
              {"balance": $scope.luke.balance}
            ]
          }
            ,config)
            .success(function(data, status) {
               $rootScope.activeTab = 2;
               $state.go('menu.tab.my-tasks',{},{reload : true});
            }).error(function(data, status){
              console.log(data);
            })      
    }).error(function(data, status){
      console.log(data);
    })
   }).error(function(data, status){
      console.log(data);
    }).finally(function(){
        $ionicLoading.hide();
    });
  }

})
.controller('EditProposalCtrl', function($rootScope, $scope, $ionicPopup, $window, $stateParams, $http, $state, $filter, $ionicLoading) {
  var config = { cache: false };
  // get individual task according to ID
  $scope.taskId = $stateParams.id;
  console.log($scope.taskId);
  $scope.currentUser = JSON.parse($window.localStorage.getItem("currentUser"));
  $scope.luke = JSON.parse($window.localStorage.getItem("luke"));
  $scope.daisy = JSON.parse($window.localStorage.getItem("daisy"));
  $scope.allTasks = JSON.parse($window.localStorage['luke']).proposedTasks;
  console.log($scope.allTasks);
  $scope.task = $filter('filter')($scope.allTasks, {id:$scope.taskId})[0];
  console.log($scope.task);
  // take photo and submit task

  //take photo
   $scope.counterPropose = function(){
     $ionicLoading.show({
          template: '<i class="icon ion-loading-c"></i> Counter-proposing task..'
      });
      $scope.newTask =
      {
        country: "Singapore",
        region: "Singapore",
        city: "Singapore",
        name: $scope.task.name,
        objectTypeId: 35,
        userId: 7,
        appId: 8,
        properties: [
            {name: $scope.task.name},
            {startDate: $scope.task.startDate},
            {startTime: $scope.task.startTime},
            {description: $scope.task.description},
            {Average: $scope.task.Average},
            {Good: $scope.task.Good},
            {Excellent: $scope.task.Excellent},
            {isAvailable: "false"},
            {isCompleted: "false"},
            {isProposed: "true"},
            {isApproved: "false"},
            {isPending: "true"},
            {isRejected: "true"},
            {reward: 0},
            {isApprovedProposed: "false"},
            {rejectedMessage: $scope.task.rejectedMessage},
            {photos: []},
            {assignTo: $scope.task.assignTo}
        ]
      };
    $http.put("http://161.202.13.188:9000/api/object/update/" + $scope.task.id,JSON.stringify($scope.newTask),config)
    .success(function(data, status) {
        $http.get(
          "http://161.202.13.188:9000/api/object/get/app/8/objecttype/34",config)
        .success(function(data, status) { 
            $window.localStorage['users'] = JSON.stringify(data);
            $window.localStorage['daisy'] = JSON.stringify($filter('filter')(JSON.parse($window.localStorage['users']), {name:"Daisy"})[0]);
            // $window.localStorage['avail'] = JSON.stringify(data[0].availabTasks);
            $window.localStorage['luke'] = JSON.stringify($filter('filter')(JSON.parse($window.localStorage['users']), {name:"Luke"})[0]);
            $ionicLoading.hide();
            $rootScope.activeTab = 2;
            $state.go('menu.tab.my-tasks',{},{reload:true});
        }).error(function(data, status){
          $ionicLoading.hide();
          $scope.message = data;
        });
       // window.location.href = 'jiaYong.html#/my-tasks';
    }).error(function(data, status){
      console.log(data);
    }).finally(function(){
      $ionicLoading.hide();
    });
   };
  

})
  

.controller('ProfileCtrl', function($scope, $ionicPopup, $window, $http, $ionicLoading) {
  var config = { cache: false };
  $scope.refresh = function(){
   var alertPopup = $ionicPopup.alert({
     title: 'New Notification',
     template: '<center>A new change has been made! Refreshing the application...</center>'
   });
   alertPopup.then(function(res) {
      $http.get(
      "http://161.202.13.188:9000" + "/api/object/get/app/8/objecttype/34",config)
    .success(function(data, status) { 
        $window.localStorage['users'] = JSON.stringify(data);
        $window.localStorage['daisy'] = JSON.stringify($filter('filter')(JSON.parse($window.localStorage['users']), {name:"Daisy"})[0]);
        // $ionicLoading.hide();
        // $window.localStorage['currentUser'] = JSON.stringify(data);
        // $window.localStorage['avail'] = JSON.stringify(data[0].availabTasks);
        $window.localStorage['luke'] = JSON.stringify($filter('filter')(JSON.parse($window.localStorage['users']), {name:"Luke"})[0]);
        $state.go('menu.tab.profile',{},{reload:true});
        $ionicLoading.hide();
    }).error(function(data, status){
      $ionicLoading.hide();
      $scope.message = data;
    }); 
     $scope.$broadcast('scroll.refreshComplete');
   });
    
  }
  $scope.currentUser = JSON.parse($window.localStorage.getItem("daisy"));
});
