(function() {
  
  "use strict";
  
  angular
    .module("app.common")
    .directive("projectDataDateRangeSelect", ProjectDataDateRangeSelect);
  
  function ProjectDataDateRangeSelect() {
    
    return {
      restrict: "EA",
      templateUrl: "/app/src/common/projectDataFormatDirectives/projectDataDateRangeSelect.html" 
    };
    
  }
  
}());
