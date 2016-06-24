describe("stateLocationTestSuite", function() {
  
  var stateLocationService,
      $rootScope,
      $location,
      $state,
      $stateParams,
      stateHistoryService;
  
  function goTo(url) {
    $location.url(url);
    $rootScope.$digest();
  }
  
  function goFrom(url) {
    return {toState: function (state, params) {
      $location.replace().url(url); //Don't actually trigger a reload
      $state.go(state, params);
      $rootScope.$digest();
    }};
  }
  
  beforeEach(function() {
    module("PPT");
    inject(function(_$rootScope_, _$location_,
           stateLocationService_) {
      $rootScope = $rootScope;
      $location = $location;
      $state = $state;
      $stateParams = $stateParams;
      stateLocationService = _stateLocationService_;
    });
  });
  
  it("should get project.description.edit state from url", function() {
    $location.path = function() {
      return "/project/1/description/edit";
    };
    $state = stateLocationService.getStateFromLocation();
    expect($state.name).toBe("project.description.edit");
    expect($stateParams.projectID).toBe(1);
  });
})