(function() {
  
  /**
   *  @name PPTConfig
   *  @desc Configuration for PPT app. 
   */
  "use strict";
  
  angular
    .module("PPT")
    .config(PPTConfig);
  
  PPTConfig.$inject = ["$urlRouterProvider"];
  
  function PPTConfig($urlRouterProvider) {
    /* Make "/select/home" the default ui.router state. */
    $urlRouterProvider.otherwise('/select/home');
  };

}());
