(function() {
  
  "use strict";
  
  angular
    .module("app.manage")
    .config(manageConfig);
  
  manageConfig.$inject = ["$stateProvider"];
  
  function manageConfig($stateProvider) {
    $stateProvider
      .state("manage", {
        url: "/manage",
        templateUrl: "/app/manage/manage.html",
        controller: "Manage",
        controllerAs: "manage",
        data: {
          requiresLogin: true
        }
      });
  };
  
}());