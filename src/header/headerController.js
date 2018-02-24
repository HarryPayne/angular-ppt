(function() {
  
  "use strict";
  
  angular
    .module("app.header")
    .controller("Header", Header);
  
  Header.$inject = ["$rootScope", "$state", "projectListService", 
                    "loginApiService", "loginStateService", "loginService"];
  
  function Header($rootScope, $state, projectListService, loginApiService,
                  loginStateService, loginService) {
    var vm = this;
    vm.csrf_token = $rootScope.csrf_token;
    
    vm.currentUser = $rootScope.currentUser;
    vm.masterList = projectListService.getMasterList;
    vm.getSql = projectListService.getSql;
    vm.getNextID = projectListService.getNextID;
    vm.getPreviousID = projectListService.getPreviousID;
    vm.getProjectID = projectListService.getProjectID;
    vm.hasNextID = projectListService.hasNextID;
    vm.hasPreviousID = projectListService.hasPreviousID;

    vm.loggedIn = loginStateService.loggedIn; 
    vm.login = loginService.getUserViaModal;
    vm.logout = loginApiService.logout;

    //vm.jumpToNextProject = jumpToNextProject;
    //vm.jumpToPreviousProject = jumpToPreviousProject;

    vm.setCsrfToken = function(token) {
      $rootScope.csrf_token = token;
    }
    
    $rootScope.$on("$stateChangeSuccess", function(e, toState){
      vm.isActive = isActive;
      vm.hasNext = hasNext;
      vm.hasPrevious = hasPrevious;

      function isActive(name) {
        return toState.name.split(".")[0] === name;
      }; 
  
      function hasNext() {
        return (vm.isActive("project") && vm.masterList().next > -1);
      };
  
      function hasPrevious() {
        return (vm.isActive("project") && vm.masterList().previous > -1);
      };
    });
    
    function jumpToNextProject() {
      if (vm.masterList().next > -1) {
         projectListService.jumpToProject(vm.masterList().next);
      }
    };

    function jumpToPreviousProject () {
      if (vm.masterList().previous > -1) {
         projectListService.jumpToProject(vm.masterList().previous);
      }
    };
  }

  
}());
