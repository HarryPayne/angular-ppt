(function() {
  
  "use strict";
  
  angular
    .module("app.common")
    .directive("projectDataComment", ProjectDataComment);
  
  function ProjectDataComment() {
    
    return {
      restrict: "EA",
      templateUrl: "/app/src/common/projectDataFormatDirectives/projectDataComment.html"
    };
    
  }
  
}());
