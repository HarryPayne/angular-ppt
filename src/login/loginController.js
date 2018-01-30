(function() {
  
  /**
   *  @name Login
   *  @desc A controller for handling the results of user action of the login
   *        page. Either 
   *          * submit the login information and then close the Bootstrap modal 
   *            in the current scope, or
   *          * just dismiss the Bootstrap modal. 
   */
  
  "use strict";
  
  angular
    .module("app.login")
    .controller("Login", Login);
  
  Login.$inject = ["$q", "$state", "$http", "$scope", "$uibModalInstance", 
                   "loginApiService"];
  
  function Login($q, $state, $http, $scope, $uibModalInstance, loginApiService) {
    var vm = this;
    var request = {
      method: "POST",
      url: "/getLoginToken",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "X-CSRFToken": window.csrf_token
      }
    }
    $http(request)
      .then(function(response) {
        vm.login_token = response.data.csrf_token;
      });

    this.cancel = cancelLogin;
    this.submit = submitLogin;
    this.status = "";
  
    function submitLogin(username, password) {
      vm.login_error = 0;
      loginApiService.login(vm.login_token, username, password)
        .then(
          function (user) {
            $uibModalInstance.close(user);
          },
          function ($scope) {
            if ($scope.status == 401) {
              vm.login_error = 401;
            };
          }
        );
    }

    function cancelLogin() {
      $scope.$dismiss();
    }
    
  };
  
}());