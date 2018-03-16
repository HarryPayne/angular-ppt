(function() {
  
	/**
	 *  @name PPTConfig
	 *  @desc Configuration for PPT app. 
	 */
	"use strict";

	angular
		.module("PPT")
		.config(PPTConfig);

	PPTConfig.$inject = ["$urlRouterProvider", "$stateProvider"];

	function PPTConfig($urlRouterProvider, $stateProvider) {
		/* Make "/select/home" the default ui.router state. */
		$urlRouterProvider.otherwise('/select/home');

		$stateProvider
			.state("app", {
				url: "/",
				views: {
					app: {
						controller: "PPTCtrl",
						controllerAs: "app",
						template: "<ui-view></ui-view>"
					}
				},
				sticky: true,
				resolve: {
					"csrf_token": ["loginService", 
						function(loginService) {
						window.login_token = loginService.getLoginToken();
					}]
				}
			})
	};

}());
