(function() {
  
  "use strict";
  
  angular
    .module("app.manage")
    .config(manageConfig);
  
  manageConfig.$inject = ["$stateProvider"];
  
  function manageConfig($stateProvider) {
    $stateProvider
      .state("app.manage", {
        url: "manage",
        templateUrl: "/app/src/manage/manage.html",
        controller: "Manage",
        controllerAs: "manage",
        data: {
          requiresLogin: true
        }
      });
  };
  
}());