(function() {

  /**
   * @module app.loginInjectorProvider
   * @desc  A module containing a factory for a service that is used as a
   *        $httpProvider interceptor. When the user attempts to view a page
   *        that requires the user to be authenticated, that change of state
   *        will be rejected. By injecting an instance of this service, the
   *        login process is injected into the process. A popup login screen
   *        is presented, and if the login is successful, the state change 
   *        proceed.
   */
  angular
    .module("app.loginInjectorProvider", []);
        
}());