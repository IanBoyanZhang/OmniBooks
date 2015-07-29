angular.module('omnibooks.user', [])
  .run(function(editableOptions) {
    // editableOptions.theme = 'bs3';
    editableOptions.theme = 'bs2'; // bootstrap3 theme. Can be also 'bs2', 'default'
  })
  .controller('UserController', ['$scope', '$stateParams', '$modal', 'fireBase', 'auth',
    function($scope, $stateParams, $modal, fireBase, auth) {
      console.log("Redirect to User rating");
      console.log("My current stateParams is ", $stateParams);
    }
  ])
  .factory('', function($http) {
    
    return {
    
    };
  });
