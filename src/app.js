(function() {
  
	/**
	 *  @module PPT
	 *  @desc   The parent module for the PPT application, a tool for project
	 *  			portfolio management. It is used to manage and provide access
	 *  			to a database of potential projects, and to support a process
	 *  			for maturing project ideas until they are ready to be 
	 *  			scheduled for execution. Rudimentary tools for tracking
	 *  			projects during execution are also present.
	 *  
	 *  			This application was intended to reproduce the functionality
	 *  			of a legacy application in Zope, build with a relational
	 *  			database (mysql), and user authentication and authorization
	 *  			in LDAP.
	 */

	angular
		.module("PPT", [
			"app.attributes",
			"app.comment",
			"app.common",
			"app.curate",
			"app.filter", 
			"app.header", 
			"app.login",
			"app.loginInjectorProvider",
			"app.manage",
			"app.modalConfirm",
			"app.project", 
			"app.report",
			"app.select", 
			"app.stateLocation",
			"app.title"
			]);

}());
