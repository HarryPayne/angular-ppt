(function() {
  
  "use strict";
  
  angular
    .module("app.curate")
    .config(curateConfig);
  
  curateConfig.$inject = ["$stateProvider"];
  
  function curateConfig($stateProvider) {
    $stateProvider
      .state("app.curate", {
        url: "curate",
        templateUrl: "/app/src/curate/curate.html",
        controller: "Curate",
        controllerAs: "curate",
        data: {
          requiresLogin: true
        }
      });
  }
  
}());
