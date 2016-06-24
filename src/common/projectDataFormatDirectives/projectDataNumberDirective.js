(function() {
  
  "use strict";
  
  angular
    .module("app.common")
    .directive("projectDataNumber", ProjectDataNumber);
  
  function ProjectDataNumber() {
    
    return {
      restrict: "EA",
      templateUrl: "/app/src/common/projectDataFormatDirectives/projectDataNumber.html" 
    };
    
  }
  
}());
