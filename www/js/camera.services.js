// angular.module('gurillaApp.services')

// .factory('Camera', ['$q', function($q) {
//   return {
//     getPicture: function(options) {
//       var q = $q.defer();
//       navigator.camera.getPicture(function(result) {
//         q.resolve(result);
//       }, function(err) {
//         q.reject(err);
//       }, options);

//       return q.promise;
//     }
//   }
// }])

// .factory('Photo', ['$q', '$http', 'LocalData', 'GURILLA_PHOTO_URL', function ($q, $http, LocalData, GURILLA_PHOTO_URL) {
//   return {
//     upload: function(imageData, params, success, error) {
//       var config = { cache: false };
//       params.m = 'upload';
//       params.token = LocalData.getToken();
//       params.photo = imageData;

//       $http.post(GURILLA_PHOTO_URL, params, config)
//       .success(function(data, status) {
//         success(data, status);
//       }).error(function(data, status){
//         error(data, status);
//       }).finally(function(){
//         $ionicLoading.hide();
//       });
//     }
//   }
// }])

// ;
