  /**
   *   @name loginApiService
   *   @desc A factory for a service that sends login information to the server
   *         and returns the result. If successful, the result is a jwt that
   *         includes information about the current user, including roles for
   *         authorization.
   */
  
  "use strict";
  
  angular
    .module("app.login")
    .factory("loginApiService", LoginApiService);
  
  LoginApiService.$inject = ["$rootScope", "$http", "$state", "store"];
  
  function LoginApiService($rootScope, $http, $state, store) {

    var service = {
      deleteAndGo: deleteAndGo,
      login: login,
      logout: logout,
      logoutRequest: logoutRequest
    };

    return service;    

    /**
     * 	@name deleteAndGo
     *  @desc Remove the currentUser object and the JWT. Transition to the
     *  	  current state. If the current state requires login, then the
     *  	  user will be redirected to a safe landing elsewhere.
     */
    function deleteAndGo() {
      store.remove('jwt');
      delete $rootScope.currentUser;
      $state.go(service.currentState.name, service.currentParams);
    }
  
    /**
     *  @name login
     *  @desc Make an authorization request
     *  @param {string} login_token, CSRF token from server on a previous
     *                  request, and saved on the window.
     *  @param {string} username from form input
     *  @param {string} passwork from form input
     */
    function login(login_token, username, password) {
      return $http({
        url: "/auth",
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "X-CSRFToken": login_token
        },
        data: {
          username: username, 
          password: password
        }
      });
    };

    /**
     *  @name logout
     *  @desc Log out, and remove JSON Web Token. If the current state is a
     *        view that requires authentication, change state to the home
     *        page (Select tab).
     */
    function logout() {
      service.currentState = $state.current;
      service.currentParams = $state.params;
      service.logoutRequest()
        .then(service.deleteAndGo);
    };

    /**
     * 	@name logoutRequest
     * 	@desc Logout on the back end.
     */
    function logoutRequest() {
      var request = {
          url: "/logout",
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "X-CSRFToken": window.csrf_token
          }
        }
      return $http(request)
    }
  };
