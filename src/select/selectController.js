(function() {
  
  /**
   *  @name Select
   *  @desc Controller for the Select tab states
   * @requires ui-router
   * @requires attributesService
   * @requires loginStateService
   * @requires modalConfirmService
   * @requires projectDataService
   * @requires projectListService
   * @requires selectStateService
   */

  "use strict";
  
  angular
    .module("app.select")
    .controller("Select", Select);
  
  Select.$inject = ["$scope", "$state", "$transitions", "attributesService", "formlyFields", 
                    "loginStateService", "masterList", "modalConfirmService", 
                    "pristineProject", "projectDataService", 
                    "projectListService", "selectStateService"];
  
  function Select($scope, $state, $transitions, attributesService, formlyFields, 
                  loginStateService, masterList, modalConfirmService, 
                  pristineProject, projectDataService, projectListService, 
                  selectStateService) {
    
    var vm = this;
    vm.state = $state;
    
    vm.as = attributesService;
    vm.ds = projectDataService;
    vm.logss = loginStateService;

	var form = new Object;
	form.formlyFields = formlyFields;
	form.projectModel = pristineProject;
	form.projectFormlyOptions = vm.ds.projectFormlyOptions;
	vm.form = form;

	vm.masterList = masterList;
    vm.pristineProject = pristineProject;
	vm.briefDescriptions = masterList;
	
    vm.ls = projectListService;
    //vm.masterList = vm.ls.getMasterList;
    vm.jumpToProject = projectListService.jumpToProject;
    vm.getSql = projectListService.getSql;
    
    vm.ss = selectStateService;
    vm.selectState = selectStateService.getMasterList;
    
	$transitions.onBefore({from: 'app.select.add'}, function(transition) {
		var confirmPromise = vm.ds.unsavedDataPopup(transition, vm.form)}
	);
//    $scope.$on("$stateChangeStart", checkForDirtyAddProjectForm);

//    /**
//     *  @name checkForDirtyAddProjectForm
//     *  @desc A listener for $stateChangeStart to prompt for unsaved changes on
//     *        the add project form. Parameters are standard for listeners to
//     *        this event.
//     */
//    function checkForDirtyAddProjectForm(event, toState, toParams, fromState, fromParams) {
//      projectDataService.success = "";
//
//      if (fromState.name == "select.addProject" &&
//          typeof $scope.selectForm != "undefined" &&
//          $scope.selectForm.$dirty) {
//
//    	event.preventDefault();
//
//        var modalOptions = {
//            closeText: "Cancel",
//            actionText: "Continue",
//            headerText: "Unsaved changes",
//            bodyText: "You have unsaved changes. Press Continue to discard your changes and" 
//                      + " navigate away, or press Cancel to stay on this page."
//        };
//
//        modalConfirmService.showModal({}, modalOptions)
//          .then(function (result) {
//            $scope.addProject.$setPristine();
//            $state.go(toState, toParams);
//          }
//        );
//      }
//    }
  };
  
}());
