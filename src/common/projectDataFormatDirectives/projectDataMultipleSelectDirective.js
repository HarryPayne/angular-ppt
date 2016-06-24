(function() {
  
  "use strict";
  
  angular
    .module("app.common")
    .directive("projectDataMultipleSelect", ProjectDataMultipleSelect);
  
  function ProjectDataMultipleSelect() {
    
    return {
      restrict: "EA",
      templateUrl: "/app/src/common/projectDataFormatDirectives/projectDataMultipleSelect.html" 
    };
    
  }
  
}());
