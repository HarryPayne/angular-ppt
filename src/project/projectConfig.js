(function() {

	/**
	 *  @name projectConfig
	 *  @desc Declare ui.router states under the Project tab.
	 */

	"use strict";

	angular
		.module("app.project")
		.config(projectConfig);

	projectConfig.$inject = ["$stateProvider"];

	function projectConfig($stateProvider, formlyConfigProvider) {
		/* Declare states under the project tab. */
		$stateProvider
			.state("app.project", {
				/** virtual-ish root state for Project tab view */
				url: "project/{projectID:int}",
				controller: "Project",
				controllerAs: "project",
				templateUrl:"/app/src/project/project.html",
				data: {
					requiresLogin: false,
					viewUrl: "/app/src/project/project.html"
				},
				resolve: {
					/* Ensure that the services used by this controller have 
					 * their data from the back end.*/
					formlyFields: ["attributesService", 
						function(attributesService) {
						// Make sure formlyFields available.
						return attributesService.getFormlyFieldObj();
					}
					],
					masterList: ["projectListService", "$transition$",
						function(projectListService, $transition$) {
							return projectListService
								.getMasterList($transition$.params().projectID);
					}
					],
					projectDataPromise: ["projectDataService", "$transition$",
						function(projectDataService, $transition$) {
							return projectDataService
								.getModelObject($transition$.params().projectID);
						}
					]
				}
			}) 
			.state("app.project.detail", {
				/* default state for project display view */
				url: "/detail",
				templateUrl: "/app/src/project/templates/detail.html",
				data: {
					requiresLogin: false
				}
			})
			.state("app.project.add",  {
				/** state for adding a project */
				url: "/add",
				templateUrl: "/app/src/project/templates/description.html",
				data: {
					requiresLogin: true
				}
			})
			.state("app.project.attach", {
				/** virtual root for project.attach views */
				url: "/attach",
				data: {
					requiresLogin: true
				}
			})
			.state("app.project.comment", {
				/** Virtual root for project.comment views. 
				 *  The template contains a viewport for views under this tab.
				 */
				url: "/comment",
				templateUrl: "/app/src/project/templates/detailView.html",
				data: {
					requiresLogin: true,
				}
			})
			.state("app.project.comment.add", {
				/** State for adding a comment to specified project. */
				url: "/add",
				templateUrl: "/app/src/project/templates/comment.html"
			})
			.state("app.project.comment.edit", {
				/** State for the project editing Comment sub-tab. */
				url: "/edit",
				templateUrl: "/app/src/project/templates/comment.html"
			})
			.state("app.project.comment.editDetail", {
				/** State for editing the specified comment. */
				url: "/editDetail/{commentID:int}",
				templateUrl: "/app/src/project/templates/comment.html"
			})
			.state("app.project.description", {
				/** virtual root for project.description views */
				url: "/description",
				templateUrl: "/app/src/project/templates/description.html",
				data: {
					requiresLogin: true
				}
			})
			.state("app.project.description.edit", {
				/** state for project editing Description sub-tab */
				url: "/edit",
				controller: function () {
					this.options.formState.readOnly = false;
				},
				data: {
					requiresLogin: true
				}
			})
			.state("app.project.disposition", {
				/** virtual root for project.disposition views */
				url: "/disposition",
				templateUrl: "/app/src/project/templates/detailView.html",
				data: {
					requiresLogin: true
				}
			})
			.state("app.project.disposition.add", {
				/** state for adding a disposition to the specified project */
				url: "/add",
				templateUrl: "/app/src/project/templates/disposition.html"
			})
			.state("app.project.disposition.edit", {
				/** state for project editing Disposition tab */
				url: "/edit",
				templateUrl: "/app/src/project/templates/disposition.html"
			})
			.state("app.project.disposition.editDetail", {
				/** state for editing the specified disposition */
				url: "/editDetail/:disposedIn",
				templateUrl: "/app/src/project/templates/disposition.html"
			})
			.state("app.project.portfolio", {
				/** virtual root for the project.portfolio views */
				url: "/portfolio",
				templateUrl: "/app/src/project/templates/portfolio.html",
				data: {
					requiresLogin: true
				}
			})
			.state("app.project.portfolio.edit", {
				/** state for project editing under the Portfolio sub-tab */
				url: "/edit",
				controller: ["$transition", function ($transition) {
					return $transition;
				}]
			})
			.state("app.project.projectMan", {
				/** virtual root for the project.projectMan views */
				url: "/projectMan",
				templateUrl: "/app/src/project/templates/projectMan.html",
				data: {
					requiresLogin: true
				}
			})
			.state("app.project.projectMan.edit", {
				/** state for project editing under the Project Management sub-tab */
				url: "/edit",
				controller: ["$transition", function ($transition) {
					return $transition;
				}]
			});

	}
}());
