angular.module('jiaYongAuth', ['ionic', 'jiaYongAuth.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

   

    if ((typeof window.localStorage['token'] != 'undefined')
    && (typeof window.localStorage['account'] != 'undefined')) {
      /* We already have some token saved before, go to the app directly */
      window.location.href = 'jiaYong.html';
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('welcome', {
      url: '/welcome',
      templateUrl: 'templates/welcome.html',
      controller: 'WelcomeCtrl'
    })

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'SignupCtrl'
    })
    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');

});

