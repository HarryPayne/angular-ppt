(function() {

	/**
	 * 	@name	app.title
	 * 	@desc	Controller for the page title in the HTML header.
	 */
	
	"use strict";

	angular
		.module("app.title")
		.controller("Title", Title);

	Title.$inject = ["$transitions", "projectListService"];

	function Title($transitions, projectListService){
		var vm = this;

		vm.masterList = projectListService.getMasterList;
		vm.pageTitle = "PPT: Select";
		
		/**
		 * 	@name 	updateTitle
		 * 	@desc	Keep the page title in sync with the tab you are on.
		 */
		function updateTitle(transition) {
	    	var state = transition.to();
			var tab = _.first(state.name.split("."));

			if (tab == "home") {
				vm.pageTitle = "PPT: Home";
			}
			else if (tab == "select") {
				vm.pageTitle = "PPT: Select";
			}
			else if (tab == "filter") {
				vm.pageTitle = "PPT: Filter Builder";
			}
			else if (tab == "report") {
				vm.pageTitle = "PPT: Report";
			}
			else if (tab == "project") {
				var projectID = trans.params().projectID;
				vm.pageTitle = projectID + ". " + vm.masterList().projectName;
			}  
			else if (tab == "comment") {
				vm.pageTitle = "PPT: Comments";
			}
			else if (tab == "curate") {
				vm.pageTitle = "PPT: Curate";
			}
			else if (tab == "manage") {
				vm.pageTitle = "PPT: Manage";
			}
			else {
				vm.pageTitle = "PPT: Select";
			}      
		}
		
		$transitions.onSuccess({}, function(trans){
			updateTitle(trans);
		});
	}

}());
