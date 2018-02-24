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
                   "loginApiService", "loginService"];
  
  function Login($q, $state, $http, $scope, $uibModalInstance, loginApiService, loginService) {
    var vm = this;
    vm.ls = loginService;
    vm.ls.getLoginToken();

    vm.cancel = cancelLogin;
    vm.submit = submitLogin;
    vm.status = "";

    function cancelLogin() {
      $scope.$dismiss();
    }
    
    function submitLogin(username, password) {
      vm.login_error = 0;
      loginApiService.login(vm.ls.login_token, username, password)
        .then(
          function (response) {
            if (response.status == 401) {
              vm.login_error = 401;
            }
            else {
              vm.ls.assignCurrentUser(response);
              $uibModalInstance.close();
            }
          }
        );
    }
  };
  
}());