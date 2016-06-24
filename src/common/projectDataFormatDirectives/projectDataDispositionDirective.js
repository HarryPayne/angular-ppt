(function() {
  
  "use strict";
  
  angular
    .module("app.common")
    .directive("projectDataDisposition", ProjectDataDisposition);
  
  function ProjectDataDisposition() {
    
    return {
      restrict: "EA",
      templateUrl: "/app/src/common/projectDataFormatDirectives/projectDataDisposition.html"
    };
    
  }
  
}());
