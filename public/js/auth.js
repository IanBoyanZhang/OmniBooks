angular.module('omnibooks.auth', ['firebase', 'ui.bootstrap'])
.factory('auth', function(fireBase) {
  var loggedInUser = null; // updated when user logs in
  var loggedInOrg  = null;
  var authInfo = {};

  var signup = function (authInfo, success) {
    try {
      if(!fireBase.getUserInfo(authInfo.org, authInfo.name)){
        console.log('Already exists');
        throw 'The username is already registered. Try another name.';
      }
      console.log('SIGNUP!');
      fireBase.createUser(authInfo, setLoggedInInfo);
    } catch (err) {
      throw err;
    }
  };

  var login = function (authInfo, success, error) {
    var existingUser = fireBase.getUserInfo(authInfo.org, authInfo.name);
    existingUser.$loaded().then(function () {
      try {
        if(!existingUser.userDetail) {
          console.log('User not exists');
          throw 'incorrect user name.';
        }
        authInfo.email = existingUser.userDetail.email;
        fireBase.authWithPassword(authInfo, function (authInfo) {
          setLoggedInInfo(authInfo);
          success();
        });
      } catch (err) {
        console.error('LOGIN ERROR!!');
        error(err);
      }
    });
  };

  var setLoggedInInfo = function (authInfo) {
    loggedInUser = fireBase.getUserInfo(authInfo.org, authInfo.name);
    loggedInOrg  = authInfo.org;
  };

  var logOut = function () {
    loggedInUser = null;
  };

  var isLoggedIn = function () {
    return !!loggedInUser;
  };

  return {
    signup: signup,
    login: login,
    loggedInUser: loggedInUser,
    loggedInOrg: loggedInOrg,
    isLoggedIn: isLoggedIn,
    logOut: logOut,
  };
})
.controller('authController', ['$scope', '$state', 'auth', 'fireBase','$rootScope', function ($scope, $state, auth, fireBase,$rootScope) {
  $scope.authInfo = {org: 'purdue', name: '', email: '', password: ''};
  $scope.clickSignup = function () {
    showSignupForm();
  };
  $scope.clickLogin = function () {
    if(auth.isLoggedIn()){
      logOut();
      return;
    }
    showLoginForm();
  };
  $scope.login = function () {
    hideError();
    auth.login($scope.authInfo, function () {
      $rootScope.authInfo = $scope.authInfo;

      $scope.closeAuthForm();
      $('#logintop').text('Log out');
      $state.go("market");
    }, showError);
  };
  $scope.signup = function () {
    hideError();
    if(!fireBase.getUserInfo($scope.authInfo.org, $scope.authInfo.name)){
      showError('The username is already registered. Try another name.');
      console.log('Already exists');
      return;
    }
    console.log('SIGNUP!');
    try {
      auth.signup($scope.authInfo);
      $state.go("market");
    } catch (err) {
      console.error(err);
      showError(err);
    }
  };
  $scope.closeAuthForm = function () {
    $('#login_form').css({visibility: 'hidden'});
    $('.login_box').css({visibility : 'hidden'});
    $('#signup_form').css({visibility: 'hidden'});
    $('.signup_box').css({visibility : 'hidden'});
    hideError();
    resetUserInfo();
  };

  var logOut = function () {
    auth.logOut();
    $('#logintop').text('Login');
    $state.go("home");
  };

  function showError(message) {
    $scope.erroMessage = message;
    $('.error').css({visibility: 'visible'});
  }
  function hideError() {
    $scope.erroMessage = '';
    $('.error').css({visibility: 'hidden'});
  }

  function showLoginForm() {
    $('#login_form').css({visibility: 'visible'});
    $('.login_box').css({visibility : 'visible'});
  }
  function showSignupForm() {
    $('#signup_form').css({visibility: 'visible'});
    $('.signup_box').css({visibility : 'visible'});
  }
  function resetUserInfo() {
    $scope.authInfo = {org: 'purdue', name: '', email: '', password: ''};
  }

}])
.run(['$rootScope', '$state', 'auth', function ($rootScope, $state, auth) {
  $rootScope.$on('$stateChangeStart', function (event, toState) {
    if(toState.name === "home"){
      return;
    }
    if(!auth.isLoggedIn()){
      event.preventDefault();
      $state.go("home");
    }
  });
}]);
