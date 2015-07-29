angular.module('omnibooks.checkout', [])
  .controller('CheckoutController', ['$scope', '$stateParams', '$modal', 'fireBase', 'libServices','bookAPI', 'auth',
    function($scope, $stateParams, $modal, fireBase, libServices, bookAPI, auth) {
      var currentOrg = auth.getOrg();
      var currentUser = auth.getUser();

      var displayDetail = function(res) {
        $scope.prices = res.data.data;
      };

      $scope.itemId = $stateParams.itemId;
      $scope.book = fireBase.getUserBook(currentOrg, currentUser.$id, $scope.itemId, function(data) {
        bookAPI.getDetail(data.isbn, displayDetail);
      });

      $scope.modalShown = false;
      $scope.toggleModal = function() {
        if (!$scope.error) {
          $scope.modalShown = !$scope.modalShown;
        }
      };

      // response from query/getting user id
      $scope.findUser = function(book) {
        // console.log(book.createdBy);
        var ref = libServices.libGetUserId(currentOrg, book.createdBy);
        console.log(ref.key());
        // search user from book information

        // $stateParams.userId = user.$id;
        // $state.go("users", {
        //   userId: user.$id
        // });
      };

    }
  ])
  .factory('bookAPI', function($http) {
    var key = 'UTUJEB5A';
    var getDetail = function(isbn, callback) {
      return $http({
          method: 'GET',
          url: '/bookDetail',
          params: {
            'book_isbn': isbn
          }
        })
        .then(function(res) {
          callback(res);
        });
    };

    return {
      getDetail: getDetail
    };
  });
