(function() {
  
  "use strict";
  
  angular
    .module("app.common")
    .directive("projectDataCommentDetail", ProjectDataCommentDetail);
  
  function ProjectDataCommentDetail() {
    
    return {
      replace: true,
      scope: {
        comment: "=",
        ctrl: "=",
        index: "@"
      },
      templateUrl: "/app/src/common/projectDataFormatDirectives/projectDataCommentDetail.html",
      link: function(scope, element, attributes) {
        console.log(scope);
      },
    };
    
  }
  
}());
