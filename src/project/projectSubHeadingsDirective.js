(function() {
  
  /**
   *  @name projectSubHeadings
   *  @desc Render project-specific subheading items
   */
  
  angular
    .module("app.project")
    .directive("projectSubHeadings", ProjectSubHeadings);
  
  function ProjectSubHeadings() {
    return {
      restrict: "EA",
      templateUrl: "/app/src/project/templates/subHeadings.html",
    };
  }
  
}());
