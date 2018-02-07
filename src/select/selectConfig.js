/**
 *  @name selectConfig
 *  @desc Declare ui.router states under the Select tab.
 */

"use strict";

angular
  .module("app.select")
  .config(selectConfig);

selectConfig.$inject = ["$stateProvider"];

function selectConfig($stateProvider) {
  $stateProvider
    .state("select", {
      /** "virtual" root of Select tab states, which does resolve promises for
       * all sub-states. */
      url: "/select",
      controller: "Select",
      controllerAs: "select",
      templateUrl: "/app/src/select/select.html",
      data: {
        requiresLogin: false
      },
      resolve: {
        /* Ensure that the services used by this controller have their data from
         * the back end.*/
        formlyFields: ["attributesService", 
          function(attributesService) {
            return attributesService.getFormlyFieldObj();
          }
        ],
        masterList: ["projectListService",
          function(projectListService) {
            return projectListService.getMasterList();
          }
        ],
        pristineProject: ["projectDataService",
          function(projectDataService) {
            return projectDataService.getNewPristineModel();
          }
        ]
      }
    })
    .state("select.home", {
      url: "/home",
      templateUrl: "/app/src/select/templates/home.html"
    })
    .state("select.addProject", {
      url: "/addProject",
      templateUrl: "/app/src/select/templates/addProject.html",
      data: {
        requiresLogin: true
      }
    });
};
