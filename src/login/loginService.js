(function() {

	/**
	 *  @name loginService
	 *  @desc A factory for a service that opens a Bootstrap modal that contains
	 *        the login form (getUserViaModal).
	 */
	"use strict";

	angular
	.module("app.login")
	.service("loginService", loginService);

	loginService.$inject = ["$http", "$uibModal", "$rootScope", "store", "jwtHelper"];

	function loginService($http, $uibModal, $rootScope, store, jwtHelper) {

		var service = {
			assignCurrentUser: assignCurrentUser,
			getLoginToken: getLoginToken,
			getUserViaModal: getUserViaModal,
		}
		
		return service;

		/**
		 * 	@name assignCurrentUser
		 *  @desc If the modal interaction returns a successful (status = 200)
		 *  	  request for a JWT from the back end, then save it, decode it
		 *  	  for a user identity and put it in $rootScope.currentUser.
		 *  @returns {Object} user object on success, original result for
		 *  				  more processing on error (failed authentication).
		 */
		function assignCurrentUser(result) {
			if (result && result.status == 200) {
				store.set("jwt", result.data.access_token);
				var user = jwtHelper
								.decodeToken(result.data.access_token)
								.identity;
				if (typeof user != "undefined") {
					$rootScope.currentUser = user;
					return user;
				}
			}
			return result;
		};
    
	    /**
		 * 	@name getLoginToken()
		 *  @desc Get a new CSRF token to submit with the login request by
		 *  	making a request to the back end (using the current token).
		 *  @returns {Promise} login_token, promise for csrf_token.
		 */
		function getLoginToken() {
		    var request = {
	    		method: "POST",
	    		url: "/getLoginToken",
	    		headers: {
	    			"Content-Type": "application/json; charset=UTF-8",
	    			"X-CSRFToken": window.csrf_token
	    		}
		    }
		    service.login_token = $http(request)
			    .then(function(response) {
			    	service.login_token = response.data.csrf_token;
			    	return service.login_token;
		    });
		    return service.login_token;
		}
		
		/**
		 * 	@name getUserViaModel
		 *  @desc Open a Bootstrap modal popup containing the login form.
		 *  	  A LoginController is activated to control the form.
		 *  @returns {Object} the result of the interaction with the modal.
		 */
		function getUserViaModal() {
			var instance = $uibModal.open({
				templateUrl: "/app/src/login/login.html",
				controller: "Login",
				controllerAs: "login"
			});

			return instance.result
		};
	};
  
}());