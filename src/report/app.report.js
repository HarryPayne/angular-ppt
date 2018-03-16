(function() {

	/**
	 *  @module app.report
	 *  @desc   A module for the Report tab of the application. This tab
	 *  		allows users to filter the list of projects by searching
	 *  		by attribute values, text field searches, and date ranges.
	 */  

	angular
		.module("app.report", [
			"ui.router",
			"datatables",
			"datatables.bootstrap"
			]);
  
}());
