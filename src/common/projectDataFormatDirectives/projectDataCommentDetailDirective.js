(function() {
  
  "use strict";
  
  angular
    .module("app.common")
    .directive("projectDataCommentDetail", ProjectDataCommentDetail);
  
  function ProjectDataCommentDetail() {
    
    return {
      replace: true,
      templateUrl: "/app/src/common/projectDataFormatDirectives/projectDataCommentDetail.html",
      link: function(scope, element, attributes, ctrl) {
        console.log(scope);
      },
    };
    
  }
  
}());
