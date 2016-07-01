(function() {
  
  /**
   *  @name projectConfig
   *  @desc Configuration for app.project module:
   *          Declare ui-router states under the Project tab.
   *          Declare angular-formly configuration.
   */
  
  "use strict";
  
  angular
    .module("app.project")
    .config(projectConfig);
  
  projectConfig.$inject = ["$stateProvider", "formlyConfigProvider"];

  function projectConfig($stateProvider, formlyConfigProvider) {
    /* Declare states under the project tab. */
    $stateProvider
      .state('project', {
        /** virtual root state for Project tab view */
        url: '/project/:projectID',
        controller: "Project",
        controllerAs: "project",
        templateUrl:"/app/src/project/project.html",
        data: {
          requiresLogin: false,
          viewUrl: "/app/src/project/project.html"
        },
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
          ],
          projectDataPromise: ["projectDataService", "$stateParams",
            function(projectDataService, $stateParams) {
              return projectDataService.getModelObject($stateParams);
            }
          ]
        }
      }) 
      .state('project.detail', {
        /** default state for project display view */
        url: '/detail',
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
      .state('project.attach', {
        /** virtual root for project.attach views */
        url: '/attach',
        data: {
          requiresLogin: true
        }
      })
      .state('project.comment', {
        /** Virtual root for project.comment views. 
         *  The template contains a viewport for views under this tab.
         */
        url: '/comment',
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
    
    /* Declare angular-formly configuration. */
   
    /* Set up for Bootstrap horizontal form by changing the label wrapper and
     * the template. The templates are at the bottom of the project.html
     * template. */
    formlyConfigProvider.removeWrapperByName('bootstrapLabel');
    formlyConfigProvider.setWrapper({
      name: 'bootstrapLabel',
      templateUrl: 'label-wrapper.html'
    });
    
    /* New/overridden types */

    /* Replace formlyBootstrap input field type to implement read-only forms. */
    formlyConfigProvider.setType({
        name: 'input',
        templateUrl: 'input-template.html',
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        overwriteOk: true
      })
    formlyConfigProvider.setType({
        name: "display",
        templateUrl: "display-template.html",
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        overwriteOk: true
      })
    formlyConfigProvider.setType({
        name: "displayTextArea",
        templateUrl: "displayTextArea-template.html",
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        overwriteOk: true
      })
    formlyConfigProvider.setType({
        name: "textarea",
        templateUrl: "textarea-template.html",
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        overwriteOk: true
      })
    formlyConfigProvider.setType({
        name: "date",
        templateUrl: "displayDate-template.html",
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        overwriteOk: true
      });
    formlyConfigProvider.setType({
        name: "timestamp",
        templateUrl: "displayTimestamp-template.html",
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        overwriteOk: true
      });
    formlyConfigProvider.setType({
        name: "displayTimestamp",
        templateUrl: "displayTimestamp-template.html",
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        overwriteOk: true
      });
    formlyConfigProvider.setType({
        name: "daterange",
        templateUrl: "displayDaterange-template.html",
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        overwriteOk: true
      });

    /* Declare a datepicker type. */
    var attributes = [
      'date-disabled',
      'custom-class',
      'show-weeks',
      'starting-day',
      'init-date',
      'min-mode',
      'max-mode',
      'format-day',
      'format-month',
      'format-year',
      'format-day-header',
      'format-day-title',
      'format-month-title',
      'year-range',
      'shortcut-propagation',
      'datepicker-popup',
      'show-button-bar',
      'current-text',
      'clear-text',
      'close-text',
      'close-on-date-selection',
      'datepicker-append-to-body'
    ];
  
    var bindings = [
      'datepicker-mode',
      'min-date',
      'max-date'
    ];
  
    var ngModelAttrs = {};
  
    angular.forEach(attributes, function(attr) {
      ngModelAttrs[camelize(attr)] = {attribute: attr};
    });
  
    angular.forEach(bindings, function(binding) {
      ngModelAttrs[camelize(binding)] = {bound: binding};
    });
  
    //console.log(ngModelAttrs);
  
    formlyConfigProvider.setType({
      name: 'datepicker',
      templateUrl:  'datepicker.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      defaultOptions: {
        ngModelAttrs: ngModelAttrs,
        templateOptions: {
          datepickerOptions: {
            format: 'MM/dd/yyyy',
            initDate: new Date()
          }
        }
      },
      controller: ['$scope', function ($scope) {
        $scope.datepicker = {};
  
        $scope.datepicker.opened = false;
  
        $scope.datepicker.open = function ($event) {
          $scope.datepicker.opened = !$scope.datepicker.opened;
        };
      }]
    });

    function camelize(string) {
      string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
      // Ensure 1st char is always lowercase
      return string.replace(/^([A-Z])/, function(match, chr) {
        return chr ? chr.toLowerCase() : '';
      });
    }
  };

}());
