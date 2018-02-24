(function() {
  
    /**
     * 	@name	app.select
     * 	@desc	A module to support the Select tab functionality, which is
     * 			devoted to finding a project, or group of projects, to look
     * 			at/generate a report on.
     * 
     * 			The Select tab is the home tab for the application, and is
     * 			also home to the Add Project page.
     */
	angular
    	.module("app.select", [
	        "ui.router",
			"ui.router.state.events",
	        // 'readMore'
	    ]);
  
}());
