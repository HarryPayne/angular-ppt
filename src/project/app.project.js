(function() {
  
	/**
	 *  @module app.project
	 *  @desc   A module for handling the Project tab states of the application.
	 */
	angular
		.module("app.project", [
			"ui.date", 
			"ui.router",
			"ui.router.state.events",
			"ngSanitize",
			"angularMoment"
			]);
  
}());
