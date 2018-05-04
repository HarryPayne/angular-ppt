(function() {
  
	/**
	 *  @name PPTConfig
	 *  @desc Configuration for PPT app. 
	 */
	"use strict";

	angular
		.module("PPT")
		.config(PPTConfig);

	PPTConfig.$inject = ["$urlRouterProvider", "$stateProvider",
						 "$uiRouterProvider"];
	
	function PPTConfig($urlRouterProvider, $stateProvider, $uiRouterProvider) {
		/* Make "/select/home" the default ui.router state. */
		$urlRouterProvider.otherwise('/select/home');
		
		/* Register the StickyStatesPlugin */
		var StickyStates = window['@uirouter/sticky-states'];
		$uiRouterProvider.plugin(StickyStates.StickyStatesPlugin);

		$stateProvider
			.state("app", {
				url: "/",
				views: {
					app: {
						controller: "PPTCtrl",
						controllerAs: "app",
						template: "<ui-view></ui-view>"
// 						template: ""
					}
				},
				sticky: true,
				dsr: {
					default: {
						state: "select.home"
					}
				}
			})
			.state("modal", {
				url: "/modal",
				views: {
					popup: {
						controller: "PPTCtrl",
						controllerAs: "app",
						template: "<ui-view></ui-view>",
					}
				}
			})
	};

}());
