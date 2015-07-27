angular.module('omnibooks.profile', ['ui.bootstrap','ngFileUpload','xeditable'])
.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
})
.controller('ProfileController', ['$scope', '$stateParams', '$modal', '$state', 'auth', 'fireBase','Upload','$http',
  function($scope, $stateParams, $modal, $state, auth, fireBase, Upload,$http) {
    var currentOrg = auth.getOrg();
    var currentUser = auth.getUser();

    $scope.upload = function (files) {
      console.log('up load file!!!')
      console.log(files);
      var file = files[0];
      var uploadimage = function(file) {
      // return $http({
      //     method: 'POST',
      //     url: 'https://api.cloudinary.com/v1_1/daichuqi/image/upload',
      //     file:file,
      //     timestamp:'1315060510',
      //     api_key:'737382686617526',
      //     signature:'OG5SxPsH5MJiv1ZJUIm6xhxk1BU'
      //   })
      //   .then(function(res) {
      //     console.log(res)
      //   });
    };
    // uploadimage(file);

    };

    $scope.enterBook = function(title, url, author, isbn, price, files) {
      $scope.upload(files);
      if (title && url && author && isbn) {
        $scope.error = false;
      if (isbn.charAt(3) === '-') {
        isbn = isbn.slice(0, 3) + isbn.slice(4)
        console.log(isbn)
      }

      if (price.charAt(0) === '$') {
        price = price.slice(1);
        console.log(price)
      }

      fireBase.enterBook(currentOrg, currentUser.$id, title, url, author, isbn, price);
      console.log('successfully entered');
    } else {
      $scope.error = "*You must fill out all required fields";
    }
  };

  $scope.deleteBook = function(book) {
    console.log(book);
    fireBase.deleteBook($scope.org, $scope.username, book.$id);
  };
  $scope.username = auth.getUser().$id;
  $scope.org = auth.getOrg();
  $scope.noBooks = false;
  $scope.books = fireBase.getUserBookshelf($scope.org, $scope.username);

  if($scope.books.length === 0) {
    noBooks = true;
  }

  // modal methods
  $scope.animationsEnabled = true;
  $scope.modalShown = false;
  $scope.toggleUploadModal = function() {
    if(!$scope.error) {
      $scope.uploadModalShown = !$scope.uploadModalShown;
    }
  };
  $scope.toggleEditModal = function(book) {
    if(!$scope.error) {
      $scope.editModalShown = !$scope.editModalShown;
      $scope.bookEdit = book;
    }
  };
  $scope.toggleDeleteModal = function(book) {
    if(!$scope.error) {
      $scope.deleteModalShown = !$scope.deleteModalShown;
      $scope.bookDelete = book;
    }
  };

  $scope.updateBook = function() {
    var update = {
      title: $scope.bookEdit.title,
      author: $scope.bookEdit.author,
      img: $scope.bookEdit.img,
      isbn: $scope.bookEdit.isbn,
      askingPrice: $scope.bookEdit.askingPrice
    }
    fireBase.updateBook($scope.org, $scope.username, $scope.bookEdit.$id, update);
  }
}])
.directive('modal', function() {
  return {
    templateUrl: "../html/bookUpload.html",
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    }
  };
})

// .directive('noBooksMessage', function() {
//   return {
//     restrict: 'E',
//     scope: {
//       show: '='
//     },
//     transclude: true,
//     template: '<div ng-show="showme"> hello </div>',
//       link: function (scope, element, attrs) { //
//         scope.showme=true;
//       }
//   }
// })
