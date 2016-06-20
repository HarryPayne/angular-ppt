(function() {
  
  "use strict";
  
  angular
    .module("app.select")
    .config(selectConfig);
  
  selectConfig.$inject = ["$stateProvider"];
  
  function selectConfig($stateProvider) {
    $stateProvider
      .state("select", {
        /** virtual root of Select tab states */
        url: "/select",
        controller: "Select",
        controllerAs: "select",
        templateUrl: "/app/select/select.html",
        data: {
          requiresLogin: false
        },
        onEnter: ["selectStateService", 
          function(selectStateService) {
            selectStateService.initService();
          }
        ],
        resolve: {
          attributesPromise: ["attributesService", 
            function(attributesService) {
              // Make sure formlyFields and project list are available for init.
              return attributesService.getFormlyFieldObj();
            }
          ],
          projectListPromise: ["projectListService",
            function(projectListService) {
              return projectListService.getMasterList()
            }
          ]
        }

      })
      .state("select.home", {
        url: "/home",
        templateUrl: "/app/select/templates/home.html"
      })
      .state("select.addProject", {
        url: "/addProject",
        templateUrl: "/app/select/templates/addProject.html",
        data: {
          requiresLogin: true
        }      });
  };
  
}());
