(function() {
  
  /**
   *  @name reportConfig
   *  @desc Configuration for app.report module
   */
  
  "use strict";
  
  angular
    .module("app.report")
    .config(reportConfig);
   
  reportConfig.$inject = ["$stateProvider"];
  
  function reportConfig($stateProvider) {
    $stateProvider
      .state("app.report", {
        /** virtual root state */
        url: "report",
        controller: "Report",
        controllerAs: "report",
        templateUrl: "/app/src/report/report.html",
        data: {
          requiresLogin: false
        },
		resolve: {
			masterList: ["projectListService",
				function(projectListService) {
					return projectListService.getMasterList();
			}]
		}
      })
      .state("report.columns", {
        /** state for the Select Other Columns view */
        url: "/columns/:query_string",
        templateUrl: "/app/src/report/templates/columns.html",
        controller: ["$transition$", function ($transition$) {
          console.log($transition$);
        }]
      })
      .state("app.report.table", {
        /** state for the View Project List as Table view */
        url: "/:query_string",
        templateUrl: "/app/src/report/templates/table.html",
        controller: ["$transition$", function ($transition$) {
          console.log($transition$);
        }],
		resolve: {
			reportResults:["$transition$", "reportTableService",
				function($transition$, reportTableService){
					return reportTableService.getReportResults(
						$transition$.params().query_string);
			}]
		}
     });
  }
  
}());
