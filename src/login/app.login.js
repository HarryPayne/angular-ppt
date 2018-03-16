(function() {
  
	/**
	 * @module app.login 
	 * @desc  A module handling user login and logout. A request for login
	 *        opens a Bootstrap modal window for gathering a username and
	 *        password. User information comes back in a JSON web token.
	 *        The login form is protected against CSRF attacks.
	 */
	angular
		.module("app.login", [
			"ngAnimate",
			"ui.bootstrap",
			"ui.router.modal",
			"angular-storage",
			"angular-jwt"
			]);
  
}());