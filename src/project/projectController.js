(function() {

	/**
	 *  @name Project
	 *  @desc A controller for the states and views associated with the Project 
	 *        tab. 
	 */

	"use strict";

	angular
		.module("app.project")
		.controller("Project", Project);

	Project.$inject = ["$transitions", "projectDataService",
		"projectListService", "attributesService",
		"modalConfirmService", "loginStateService", "formlyFields",
		"masterList", "projectDataPromise"];

	function Project($transitions, projectDataService,
			projectListService, attributesService,
			modalConfirmService, loginStateService,
			formlyFields, masterList, projectDataPromise){

		var vm = this;
		vm.as = attributesService;
		vm.ds = projectDataService;
		vm.ls = projectListService;
		vm.log_s = loginStateService;
		vm.masterList = masterList;

		var form = new Object;
		form.formlyFields = formlyFields;
		form.projectModel = projectDataPromise;
		form.projectFormlyOptions = vm.ds.projectFormlyOptions;
		vm.form = form;

		vm.changeMode = vm.ds.changeMode;
		vm.currentMode = projectDataService.currentMode;
		vm.dateOptions = {changeYear: true, changeMonth: true};
		vm.error = vm.ds.server;
		vm.formlyOptions = vm.as.formlyOptions;
		vm.getFormlyOptions = vm.as.getFormlyOptions;
		vm.jumpToAtachFile = projectDataService.jumpToAtachFile;
		vm.jumpToAddForm = projectDataService.jumpToAddForm;
		//vm.masterList = vm.ls.getMasterList;
		vm.showDetails = vm.ds.showDetails;
		vm.success = vm.ds.success;

		$transitions.onBefore({from: 'project.**'}, function(transition) {
			var confirmPromise = vm.ds.unsavedDataPopup(transition, vm.form)}
		);

	};
}());
