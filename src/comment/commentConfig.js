(function() {
  
	/**
	 * 	@name app.comment
	 * 	@desc A module to support the Comment tab functionality, which is
	 * 			concerned with the management and display of comments made on
	 * 			projects.
	 */
	
	"use strict";

	angular
		.module("app.comment")
		.config(commentConfig);

	commentConfig.$inject = ["$stateProvider"];

	function commentConfig($stateProvider) {
		$stateProvider
		.state("app.comment", {
			url: "comment",
			templateUrl: "/app/src/comment/comment.html",
			controller: "Comment",
			controllerAs: "comment",
			data: {
				requiresLogin: true
			}
		});
	}
  
}());
