angular.module('jiaYongAuth.controllers', [])

.controller('WelcomeCtrl', function($scope) {
  $scope.title = 'Welcome to JiaYong';
  setTimeout(function() {
    window.location.href = 'index.html#/login';
  }, 2000);
})
.controller('LoginCtrl', function($scope, $state, $window, $filter, $ionicLoading, $http) {
  var address = "http://161.202.13.188:9000";
  // var address = "http://localhost:9000";
  $scope.tryLogin = function(account) {
    var config = { cache: false };

    var loading = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Logging in..'
    });

    $http.get(
      address + "/api/object/get/app/8/objecttype/34",config)
    .success(function(data, status) { 
        $window.localStorage['users'] = JSON.stringify(data);
          $http.post(
          address + "/user/login",
          { 
            'email': account.email,
            'password': account.password 
          },
          config)
        .success(function(data, status) { 
            $window.localStorage['currentUser'] = JSON.stringify(data);
            if(account.email == "daisy@gmail.com")
            {
                $window.localStorage['currentUser'] = JSON.stringify($filter('filter')(JSON.parse($window.localStorage['users']), {name:"Daisy"})[0]);
                $window.localStorage['daisy'] = JSON.stringify($filter('filter')(JSON.parse($window.localStorage['users']), {name:"Daisy"})[0]);
                $window.localStorage['luke'] = JSON.stringify($filter('filter')(JSON.parse($window.localStorage['users']), {name:"Luke"})[0]);
                $window.location.href = 'jiaYong.html';
                console.log($window.localStorage['daisy']);
            }else{
                $window.localStorage['currentUser'] = JSON.stringify($filter('filter')(JSON.parse($window.localStorage['users']), {name:"Luke"})[0]);
                $window.location.href = 'jiaYong-child.html';
                $window.localStorage['luke'] = JSON.stringify($filter('filter')(JSON.parse($window.localStorage['users']), {name:"Luke"})[0]);
                $window.localStorage['daisy'] = JSON.stringify($filter('filter')(JSON.parse($window.localStorage['users']), {name:"Daisy"})[0]);
                console.log($window.localStorage['luke']);
            }
          
        }).error(function(data, status){
          $ionicLoading.hide();
          $scope.message = data;
        });
        // $window.localStorage['daisy'] = JSON.stringify(data[1]);
        // $ionicLoading.hide();
        // $window.localStorage['currentUser'] = JSON.stringify(data);
        // $window.localStorage['avail'] = JSON.stringify(data[0].availabTasks);
        // $window.localStorage['luke'] = JSON.stringify(data[2]);
        $ionicLoading.hide();
    }).error(function(data, status){
      $ionicLoading.hide();
      $scope.message = data;
    });

    // $http.get(
    //   address + "/api/object/get/app/8/objecttype/35",config)
    // .success(function(data, status) { 
    //     $window.localStorage['tasks'] = JSON.stringify(data);
    //     $scope.tasks = JSON.parse(JSON.stringify(data));
    //     console.log($scope.tasks);
    //     // $window.localStorage['availableTasks'] = 
    //     // $window.location.href = 'jiaYong.html';
    // }).error(function(data, status){
    //   $ionicLoading.hide();
    //   $scope.message = data;
    // });

    // if (account.email == "jiayong-master@gmail.com" && account.password == "password"){

    
    //   $window.localStorage['account'] = JSON.stringify($scope.masterAccount);
    //   $window.location.href = 'jiaYong.html';
    // } else {
    //   $scope.message = "Wrong username/password.";
    // }
    // $ionicLoading.hide();
   
  };

})

.controller('SignupCtrl', function($scope, $state, $window, $http, $ionicLoading, $ionicModal,$ionicPlatform) {

  $scope.signupData = {};
  // var address = "http://localhost:9000";
  var address = "http://161.202.13.188:9000";
  $scope.trySignup = function() {
    var config = { cache: false };
    var loading = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Creating account..'
    });
    
    $http.post(
      address + "/user/create",
      { 
        'email': $scope.signupData.email,
        'name': $scope.signupData.firstname,
        'password': $scope.signupData.password 
      },
      config)
    .success(function(data, status) { 
      $http.post(
          address + "/user/create",
          { 
            'email': $scope.signupData.email,
            'name': $scope.signupData.firstname,
            'password': $scope.signupData.password 
          },
          config)
        .success(function(data, status) { 
            $window.localStorage['account'] = JSON.stringify(data);
            $window.location.href = 'jiaYong.html';
            $ionicLoading.hide();
          
        }).error(function(data, status){
          $ionicLoading.hide();
          $scope.message = data;
        });
        $window.localStorage['account'] = JSON.stringify(data);
        $window.location.href = 'jiaYong.html';
        $ionicLoading.hide();
      
    }).error(function(data, status){
      $ionicLoading.hide();
      $scope.message = data;
    });

  };
});