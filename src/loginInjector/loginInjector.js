(function() {

  /**
   *  @name loginInjector
   *  @desc A factory for a service that injects an opportunity for the user
   *        to authenticate in the middle of a request for a state change to
   *        a view that requires authentication. 
   */
  
  "use strict";

  angular
    .module("app.loginInjectorProvider")
    .factory("loginInjector", LoginInjector);

  LoginInjector.$inject = ["$q", "$injector", "$timeout"];

  function LoginInjector($q, $injector, $timeout) {

    /* Avoid `Uncaught Error: [$injector:cdep] Circular dependency found` */
    /* http://brewhouse.io/blog/2014/12/09/authentication-made-simple-in-single-page-angularjs-applications.html */ 
    $timeout(function () { 
      service.loginService = $injector.get("loginService");
      service.http = $injector.get("$http");
      //var $state = $injector.get("$state");
    }); 

    var service = {
      responseError: responseError
    };

    return service;

    function responseError(rejection) {
      return rejection;
      /* Only handle 401 errors */
      if (rejection.status !== 401) {
        return rejection;
      }

      var deferred = $q.defer();

      if (typeof service.loginService != "undefined") {
        deferred = service.loginService.getUserViaModal()
          .then(
            function () {
              deferred.resolve( service.http(rejection.config) );
            },
            function () {
              deferred.reject(rejection);
            }
          );
      }
      else {
        deferred.reject(rejection);
      }

      return deferred.promise;
    };
  }
        
}());