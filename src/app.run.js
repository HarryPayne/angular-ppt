(function() {
  
	/**
	 * 	@name 	initializeApp
	 * 	@desc	Application level run file.
	 */
	"use strict";

	angular
		.module("PPT")
		.run(initializeApp);

	initializeApp.$inject = ["$rootScope"];

	/* Save state before navigating away from the application. */
	function initializeApp($rootScope) {
		window.onbeforeunload = function (event) {
			$rootScope.$broadcast('savestate');
		};
	}
  
}());