/**
 *  @name Project
 *  @desc A controller for the states and views associated with the Project 
 *        tab. 
 */

"use strict";

angular
  .module("app.project")
  .controller("Project", Project);

Project.$inject = ["$rootScope", "$scope", "$state", "projectDataService",
				   "projectListService", "attributesService",
				   "modalConfirmService", "loginStateService", "formlyFields",
				   "masterList", "projectDataPromise"];

function Project($rootScope, $scope, $state, projectDataService,
		         projectListService, attributesService,
		         modalConfirmService, loginStateService,
		         formlyFields, masterList, projectDataPromise){
  
  var vm = this;
  this.as = attributesService;
  this.ds = projectDataService;
  this.ls = projectListService;
  this.log_s = loginStateService;
  this.masterList = masterList;
  this.formlyFields = formlyFields;
  this.projectModel = projectDataPromise;

  this.changeMode = this.ds.changeMode;
  this.currentMode = projectDataService.currentMode;
  this.dateOptions = {changeYear: true, changeMonth: true};
  this.error = this.ds.server;
  this.formlyOptions = this.as.formlyOptions;
  this.getFormlyOptions = this.as.getFormlyOptions;
  this.jumpToAtachFile = projectDataService.jumpToAtachFile;
  this.jumpToAddForm = projectDataService.jumpToAddForm;
  //this.masterList = this.ls.getMasterList;
  this.showDetails = this.ds.showDetails;
  this.success = this.ds.success;

  $scope.$on(["$stateChangeStart"], this.ds.unsavedDataPopup);
  
};