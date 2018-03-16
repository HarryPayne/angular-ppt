(function() {
  
	/**
	 *  @name Report
	 *  @desc A controller for the states and views associated with the Report 
	 *  	tab.
	 */

	"use strict";

	angular
		.module("app.report")
		.controller("Report", Report);

	Report.$inject = ["$transition$", "projectListService", 
			"reportTableService"];

	function Report($transition$, projectListService, reportTableService) {

		var vm = this;
		vm.ls = projectListService;
		vm.masterList = vm.ls.getMasterList;	
		vm.jumpToProject = this.ls.jumpToProject;

		vm.ts = reportTableService;
		vm.state = $transition$.params();

	}
  
}());
