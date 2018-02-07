/**
 *  @name projectConfig
 *  @desc Declare ui.router states under the Project tab.
 */

"use strict";

angular
  .module("app.project")
  .config(projectConfig);

projectConfig.$inject = ["$stateProvider", "formlyConfigProvider"];

function projectConfig($stateProvider, formlyConfigProvider) {
  /* Declare states under the project tab. */
  $stateProvider
    .state("project", {
      /** virtual root state for Project tab view */
      url: "/project/{projectID:int}",
      controller: "Project",
      controllerAs: "project",
      templateUrl:"/app/src/project/project.html",
      data: {
        requiresLogin: false,
        viewUrl: "/app/src/project/project.html"
      },
      resolve: {
        /* Ensure that the services used by this controller have their data from
         * the back end.*/
        formlyFields: ["attributesService", 
          function(attributesService) {
            // Make sure formlyFields and project list are available for init.
            return attributesService.getFormlyFieldObj();
          }
        ],
        masterList: ["projectListService",
          function(projectListService) {
            return projectListService.getMasterList();
          }
        ],
        projectDataPromise: ["projectDataService", "$stateParams",
          function(projectDataService, $stateParams) {
            return projectDataService.getModelObject($stateParams);
          }
        ]
      }
    }) 
    .state("project.detail", {
      /** default state for project display view */
      url: "/detail",
      controller: function ($stateParams, projectDataPromise) {
        this.projectModel=projectDataPromise;
      },
      templateUrl: "/app/src/project/templates/detail.html",
      data: {
        requiresLogin: false
      }
    })
    .state("project.add",  {
      /** state for adding a project */
      url: "/add",
      templateUrl: "/app/src/project/templates/description.html",
      data: {
        requiresLogin: true
      }
    })
    .state("project.attach", {
      /** virtual root for project.attach views */
      url: "/attach",
      data: {
        requiresLogin: true
      }
    })
    .state("project.comment", {
      /** Virtual root for project.comment views. 
       *  The template contains a viewport for views under this tab.
       */
      url: "/comment",
      templateUrl: "/app/src/project/templates/detailView.html",
      data: {
        requiresLogin: true,
      }
    })
    .state("project.comment.add", {
      /** State for adding a comment to specified project. */
      url: "/add",
      templateUrl: "/app/src/project/templates/comment.html"
    })
    .state("project.comment.edit", {
      /** State for the project editing Comment sub-tab. */
      url: "/edit",
      templateUrl: "/app/src/project/templates/comment.html"
    })
    .state("project.comment.editDetail", {
      /** State for editing the specified comment. */
      url: "/editDetail/:commentID",
      templateUrl: "/app/src/project/templates/comment.html"
    })
    .state("project.description", {
      /** virtual root for project.description views */
      url: "/description",
      templateUrl: "/app/src/project/templates/description.html",
      data: {
        requiresLogin: true
      }
    })
    .state("project.description.edit", {
      /** state for project editing Description sub-tab */
      url: "/edit",
      controller: function ($stateParams) {
        return $stateParams;
        this.options.formState.readOnly = false;
      },
      data: {
        requiresLogin: true
      }
    })
    .state("project.disposition", {
      /** virtual root for project.disposition views */
      url: "/disposition",
      templateUrl: "/app/src/project/templates/detailView.html",
      data: {
        requiresLogin: true
      }
    })
    .state("project.disposition.add", {
      /** state for adding a disposition to the specified project */
      url: "/add",
      templateUrl: "/app/src/project/templates/disposition.html"
    })
    .state("project.disposition.edit", {
      /** state for project editing Disposition tab */
      url: "/edit",
      templateUrl: "/app/src/project/templates/disposition.html"
    })
    .state("project.disposition.editDetail", {
      /** state for editing the specified disposition */
      url: "/editDetail/:disposedIn",
      templateUrl: "/app/src/project/templates/disposition.html"
    })
    .state("project.portfolio", {
      /** virtual root for the project.portfolio views */
      url: "/portfolio",
      templateUrl: "/app/src/project/templates/portfolio.html",
      data: {
        requiresLogin: true
      }
    })
    .state("project.portfolio.edit", {
      /** state for project editing under the Portfolio sub-tab */
      url: "/edit",
      controller: function ($stateParams) {
        return $stateParams;
      }
    })
    .state("project.projectMan", {
      /** virtual root for the project.projectMan views */
      url: "/projectMan",
      templateUrl: "/app/src/project/templates/projectMan.html",
      data: {
        requiresLogin: true
      }
    })
    .state("project.projectMan.edit", {
      /** state for project editing under the Project Management sub-tab */
      url: "/edit",
      controller: function ($stateParams) {
        return $stateParams;
      }
    });

}