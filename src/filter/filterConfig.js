(function() {

	/**
	 *  @name filterConfig
	 *  @desc Configuration for app.filter module.
	 */

	"use strict";

	angular
	.module("app.filter")
	.config(filterConfig);

	filterConfig.$inject = ["$stateProvider"];

	function filterConfig($stateProvider) {
		$stateProvider
		.state("app.filter", {
			/** virtual root state */
			url: "filter",
			controller: "Filter",
			controllerAs: "filter",
			templateUrl: "/app/src/filter/filter.html",
			data: {
				requiresLogin: false
			}
		})
		.state("app.filter.builder", {
			/** state for filter builder to change query string */
			url: "/builder/:query_string",
			templateUrl: "/app/src/filter/templates/builder.html",
			resolve: {
				query_string: ["$transition$", function($transition$) {
					return $transition$.params().query_string;
				}]
			},
// 			/** service initialization */
// 			onEnter: ["reportTableService", 
// 				function(reportTableService) {
// 				reportTableService.initService();
// 			}
// 			]

		})
		.state("app.filter.builder.attributes", {
			url: "/attributes/:attribute_list",
			templateUrl: "/app/src/filter/templates/attributes.html",
			controller: function ($transition$, query_string) {
				$transition$.query_string = query_string;
				//console.log($stateParams, query_string);
			}
		});
	};

}());
