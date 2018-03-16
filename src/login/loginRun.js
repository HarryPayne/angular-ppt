(function() {

	/**
	 * 	@name loginRun
	 *  @desc Watch for stateChangeStart events, and check whether the user
	 *  		is authenticated before changing to a state that requires
	 *  		authentication. If not, open a modal window and let them
	 *  		log in. If they log in take them where they want to go.
	 *  		Otherwise, leave them where they are.
	 */
	"use strict";

	angular
		.module("app.login")
		.run(loginRun);

	loginRun.$inject = ["$rootScope", "$state", "$transitions", "store", "jwtHelper", 
						"loginService"];

	function loginRun($rootScope, $state, $transitions, store, jwtHelper, loginService) {

		/* The user is logged in if they have a saved, unexpired JWT. */
		if (store.get("jwt") && !jwtHelper.isTokenExpired(store.get("jwt"))) {
			$rootScope.currentUser = jwtHelper
										.decodeToken(store.get("jwt"))
										.identity;
		}

		$transitions.onBefore({}, loginIfRequiredByToState);

		/**
		 * 	@loginIfRequiredByToState
		 * 	@desc If you are trying to change to a state that requires
		 * 		 	authentication, and you are not already logged in,
		 * 			then a modal login window should appear. If you log
		 * 			in successfully you will reach the desired state.
		 * 			Failure or cancelling leaves you where you were.
		 *			Error codes are set on the controller. The actual
		 *			error messages are in the template.
		 */
		function loginIfRequiredByToState(transition) {
			var requiresLogin = transition.to().data && transition.to().data.requiresLogin;
			var noActiveToken = !store.get("jwt") ||
								jwtHelper.isTokenExpired(store.get("jwt"));
			if (requiresLogin && noActiveToken) {

				var instance = loginService.getUserViaModal()
					.then(
						function (response) {
							if (response && response.status == 401) {
								// no go.
								vm.login_error = 401;
								// 		$state.transitionTo("select");
								instance.reject();
							}
							else if (response && response.status == 200) {
								// login, close modal, go.
								vm.ls.assignCurrentUser(response);
								$uibModalInstance.close();
								$state.go(toState.name, toParams);
								instance.resolve();
							}
							else if (response) {
								vm.login_error = 500;
								instance.reject();
							}
							else {
								instance.reject();
							}
						}
					);
				return instance;
			}
		};
	};

}());