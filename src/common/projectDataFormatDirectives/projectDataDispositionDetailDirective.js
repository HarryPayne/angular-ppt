(function() {
  
  "use strict";
  
  angular
    .module("app.common")
    .directive("projectDataDispositionDetail", ProjectDataDispositionDetail);
  
  function ProjectDataDispositionDetail() {
    
    return {
      replace: true,
      templateUrl: "/app/src/common/projectDataFormatDirectives/projectDataDispositionDetail.html"
    };
    
  }
  
}());
