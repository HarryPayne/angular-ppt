(function() {
	/**
	 *  @name projectListService
	 *  @desc A factory for the service that maintains a list of project short
	 *        descriptions. Each description consists of the values for project
	 *        attributes projectID, name, description, and finalID.
	 *
	 *  The projectListService has a number of uses:
	 *
	 *    project navigation
	 *      The service keeps track of the last project you looked at, and if you
	 *      navigate away from the Project tab and come back you will see the 
	 *      same project, without going back to the server again. So there is
	 *      the concept of a "current project." At the start of the session the
	 *      current project will be the one with the lowest projectID.
	 *
	 *      The (ordered) list of projects allows for stepping through the list
	 *      and the concept of previous and next projects. At the start of a 
	 *      session the next project will be the one with the second lowest
	 *      projectID, and there will not be a previous project. This functionality
	 *      is revealed by the Previous and Next tabs, and their appearance 
	 *      changes according to whether there are prevous and next projects.
	 *
	 *    project selection
	 *      Other services provide the ability for you to select a subset of all
	 *      available projects. This service holds a list of selected projectIDs
	 *      along with a human-readable description of the selection criteria
	 *      and a http GET query string that records the actual metadata values.
	 *
	 *      This service allows other services to show you a report of all 
	 *      selected services, work on selected projects one at a time, and to
	 *      navigate through selected projects using the Previous and Next tabs,
	 *      which will skip over projects not selected.
	 *
	 *      The Select tab functionality for selecting a project from a dropdown
	 *      menu is built on the short description data. The search functionality
	 *      there uses a filter on the same data. Final state is one of the
	 *      attributes sent out from the backend just for this purpose.
	 *
	 *      The Filter Builder and Report tabs use the descriptions of the project
	 *      selection criteria for restoring state, providing a basis for 
	 *      modifying the criteria.
	 */

	"use strict";

	angular
		.module("app.project")
		.factory("projectListService", ProjectListService);

	ProjectListService.$inject = ["$rootScope", "$http", "$state", "$stateParams", 
		"$location", "$q"];

	function ProjectListService($rootScope, $http, $state, $stateParams, 
			$location, $q) {

		/** service to be returned by this factory */
		var service = {
			allProjectsCount: allProjectsCount,
			getDescription: getDescription,
			getIDListFromAllProjects: getIDListFromAllProjects,
			getMasterList: getMasterList,
			getNextID: getNextID,
			getPreviousID: getPreviousID,
			getProjectID: getProjectID,
			getSelectedIds: getSelectedIds,
			getSelectedProjects: getSelectedProjects,
			getSql: getSql,
			hasMasterList: hasMasterList,
			hasNextID: hasNextID,
			hasPreviousID: hasPreviousID,
			hasProjects: hasProjects,
			initModel: initModel,
			jumpToProject: jumpToProject,
			jumpToProjectInList: jumpToProjectInList,
			resetList: resetList,
			RestoreState: RestoreState,
			SaveState: SaveState,
			selectedIdsCount: selectedIdsCount,
			setAllProjectResults: setAllProjectResults,
			setDescription: setDescription,
			setList: setList,
			setProjectID: setProjectID,
			setSql: setSql,
			updateAllProjects: updateAllProjects
		};

		service.RestoreState();
//		service.masterList = masterList;
		if (typeof(service.masterList) == "undefined") {
			service.updateAllProjects();
		} 

		$rootScope.$on("savestate", service.SaveState);
		$rootScope.$on("restorestate", service.RestoreState);

		return service;    

		/**
		 *  @name allProjectsCount
		 *  @desc Return the total number of available projects
		 *  @return {Number}
		 */
		function allProjectsCount() {
			return service.masterList.allProjects.length;
		}

		/**
		 * 	@name	getDescription
		 * 	@desc	Return masterList.description, the readable version
		 * 			of the filter that goes with selectedProjects.
		 */
		function getDescription() {
			if (typeof service.masterList.description == "undefined") {
				return "none";
			}
			return service.masterList.description;
		}
		/**
		 *  @name getIDListFromAllProjects
		 *  @desc Return the list of projectIDs for all available projects
		 *  @return {Number[]}
		 */
		function getIDListFromAllProjects(masterList) {
			return _.map(masterList.allProjects, function(item) {
				return item.projectID;});
		};

		/**
		 *  @name getMasterList
		 *  @desc Getter for service.masterList
		 *  @return {Object}
		 */
		function getMasterList(projectID) {
			/*  Did we already retrieve the brief descriptions? */
			if (!service.hasMasterList()) {
				service.masterList = service.updateAllProjects(projectID);
			}
			return service.masterList;
		};

		/**
		 *  @name getNextID
		 *  @desc Getter for service.masterList.next
		 *  @return {Number} projectID
		 */
		function getNextID() {
			return service.masterList.next;
		}

		/**
		 *  @name getPreviousID
		 *  @desc Getter for service.masterList.previous
		 *  @return {Number} projectID
		 */
		function getPreviousID() {
			return service.masterList.previous;
		}

		/**
		 *  @name getProjectID
		 *  @desc Getter for service.masterList.projectID
		 *  @return {Number}
		 */
		function getProjectID() {
			return service.masterList.projectID;
		}

		/**
		 *  @name getSelectedIds
		 *  @desc Getter for service.masterList.selectedIds
		 *  @return {Number[]}
		 */
		function getSelectedIds() {
			return service.masterList.selectedIds;
		}

		/**
		 *  @name getSelectedProjects
		 *  @desc Return the brief descriptions for all of the selected projects
		 *  @return {Object[]}
		 */
		function getSelectedProjects() {
			return service.masterList.selectedProjects;
		}

		/**
		 *  @name getSql
		 *  @desc Getter for service.masterList.sql
		 *  @return {string}
		 */
		function getSql() {
			if (typeof service.masterList.sql == "undefined") {
				return "";
			}
			return service.masterList.sql;
		}

		/**
		 *  @name gotMasterList
		 *  @desc Has the masterList been initialized?
		 *  @return {Boolean}
		 */
		function hasMasterList() {
			if (typeof service.masterList == "undefined") {
				return false;
			}
			return true;
		}

		function hasNextID() {
			return service.masterList.next != -1;
		}

		function hasPreviousID() {
			return service.masterList.previous != -1;
		}

		/**
		 *  @name hasProjects
		 *  @desc Return the validity of the statement "there are available 
		 *        projects in service.masterList.allProjects"
		 *  @return {Boolean}
		 */
		function hasProjects() {
			return Boolean(service.allProjectsCount() > 0);
		}

		/**
		 *  @name initModel
		 *  @desc Initialize the masterList object to make it ready for receiving
		 *        data. The masterList holds the service state data, which gets
		 *        saved as JSON to local storage when updated and restored when
		 *        necessary.
		 */
		function initModel() {
			service.masterList = {
					allProjects: [],
					description: "none",
					index: -1,
					next: -1,
					previous: -1,
					projectID: -1,
					projectName: "",
					selectedIds: [],
					selectedProjects: [],
					sql: ""
			};
		};

		/**
		 *  @name jumpToProject
		 *  @desc Go to the app.project.detail state for the given projectID. There
		 *        must be a project to match the given projectID. Otherwise an 
		 *        is raised.
		 *  @param {Number|string} projectID - project identifier
		 */
		function jumpToProject(projectID) {
			projectID = parseInt(projectID);
			var index = service.masterList.selectedIds.indexOf(projectID);
			/** if in selectedIds, make it the current project */
			if (service.masterList.selectedIds.indexOf(projectID) > -1) {
				service.jumpToProjectInList(projectID, service.masterList.selectedIds);
				return;
			}
			/** otherwise just go, if it exists */
			var projectIDlist = service.getIDListFromAllProjects();
			if (projectIDlist.indexOf(projectID) > -1) {
				service.jumpToProjectInList(projectID, projectIDlist);
				return;
			}
			alert("Can't find a project to display.");
		};


		/**
		 *  @name jumpToProjectInList
		 *  @desc Go to the app.project.detail state for the specified project and make
		 *        it the current project
		 */
		function jumpToProjectInList(projectID) {
			service.masterList = service.setProjectID(projectID);
			$state.go('app.project.detail', {projectID: projectID});
		};

		/**
		 *  @name resetList
		 *  @desc Reset the project list to the state where all projects are selected
		 *        without forgetting which is the current project.
		 */
		function resetList() {
			service.masterList = service.updateAllProjects(service.getProjectID())
				.then(function(projectID) {
					service.setDescription("none");
					service.setSql("");
					service.masterList.selectedProjects = service.masterList.allProjects;
					service.masterList.selectedIds = _.map(service.masterList.allProjects, function(project) {
						return project.projectID;
					});
					return service.masterList;
				});
			return service.masterList;
		}

		/**
		 *  @name RestoreState
		 *  @desc Restore the service.masterList object from client session storage
		 */
		function RestoreState() {
			if (typeof sessionStorage.projectListService != "undefined" &&
					sessionStorage.projectListService != "undefined" &&
					sessionStorage.projectListService != "{}") {
				service.masterList = angular.fromJson(sessionStorage.projectListService);
			}
		};

		/**
		 *  @name SaveState
		 *  @desc Save the service.masterList object in client session storage
		 */
		function SaveState() {
			sessionStorage.projectListService = angular.toJson(service.masterList);
		};

		/**
		 *  @name selectedIdsCount
		 *  @desc Return the number of selected projects
		 */
		function selectedIdsCount() {
			return service.masterList.selectedIds.length;
		}

		/**
		 *  @name setAllProjectResults
		 *  @desc Callback to save the response to a backend request for a complete
		 *        list of project brief descriptions sent by updateAllProjects().
		 *  @param {Object} response - JSON response containing a list of project
		 *        brief descriptions.
		 *  @param {Number} [projectID=service.masterList.selectIds[0] || -1] - the 
		 *        projectID to be configured as the current project.
		 *
		 *  The idea is that the list of available projects be loaded at the start 
		 *  of a session and then re-used. But you, or some other user, might have
		 *  added a new project that you want to work on. So you need to be able to
		 *  update the list with out disrupting your workflow, which means not 
		 *  changing the list of selected projects or the current project.
		 */
		function setAllProjectResults(response, projectID) {
			var masterList = new Object;
			masterList.allProjects = response.data.descriptions;
			masterList.selectedIds = service.getIDListFromAllProjects(masterList);
			if (typeof projectID == "undefined" || projectID < 0) {
				projectID = masterList.selectedIds[0];
			}
			return service.setProjectID(projectID, masterList);
		};

		/**
		 *  @name setDescription
		 *  @desc Setter for service.masterList.description
		 *  @param {string} description - human readable description of the query
		 *        used to select the current list of projects that is stored in 
		 *        service.master.selectedIds
		 */
		function setDescription(description) {
			service.masterList.description = description;
		};

		/**
		 *  @name setList
		 *  @desc Setter for service.masterList.selectedIds
		 *  @param {Number[]} selectIds - a list of projectIDs to be saved as the
		 *        list of selected projects.
		 */
		function setList(selectedIds) {
			service.masterList.selectedIds = selectedIds;
			if (typeof selectedIds == "undefined") {
				var what_the_;
			}

			var index = selectedIds.indexOf(service.masterList.projectID);
			if (index < 0) {
				var projectID = selectedIds[0];
				service.setProjectID(projectID, service.masterList, selectedIds);
			}

			service.masterList.selectedProjects =  
				_.filter(service.masterList.allProjects, function(project) {
					return _.contains(service.masterList.selectedIds, project.projectID);
				});
		}

		/**
		 *  @name setProjectID
		 *  @desc Setter for service.masterList.projectID and
		 *        service.masterList.selectedIds
		 *  @param {Number} projectID - the projectID to be configured as the 
		 *        current project.
		 *  @param {Object[]} masterList - list of project brief descriptions
		 *  @param {Number[]} [selectedIds=service.masterList.selectedIds] - a list 
		 *        of projectIDs to be saved as the list of selected projects.
		 */
		function setProjectID(projectID, masterList, selectedIds) {
			if (typeof masterList == "undefined") {
				if (typeof service.masterList != "undefined") {
					masterList = service.masterList;
				}
			}
			if (typeof selectedIds == "undefined") {
				if (typeof masterList.selectedIds == "object") {
					selectedIds = masterList.selectedIds;
				}
				else return masterList; 
			}
			if (projectID) {
				masterList.projectID = projectID;

				/** do we recognize this project? */
				/* TODO: This next bit, for handling new projects, is not tested */
				var index = selectedIds.indexOf(projectID);
				if (projectID > 0 && index == -1) {

					/** then maybe this projectID is a mistake, but maybe we just added a 
					 *  new project. Better check. */
					service.updateAllProjects(projectID)
					.then(function(projectID) {
						if (typeof selectedIds != "undefined") {
							masterList.selectedIds = selectedIds;
						}
						index = masterList.selectedIds.indexOf(projectID);
					}); 
				}

				if (index > -1) {
					masterList.index = index;
					if (index > 0) {
						masterList.previous = selectedIds[index-1];
					} 
					else {
						masterList.previous = -1;
					}
					if (index < selectedIds.length) {
						masterList.next = selectedIds[index+1];
					}
					else {
						masterList.next = -1;
					}
				}

				masterList.selectedProjects = _.filter(masterList.allProjects, 
						function(project) {
					return _.contains(selectedIds, project.projectID);
				});
				if (index > -1) {
					masterList.projectName = masterList.selectedProjects[index].name;
				}

			}
			return masterList;
		};

		/**
		 *  @name setSql
		 *  @desc Setter for service.masterList.sql
		 *  @param {string} query_string - an http GET query_string to represent
		 *        the actual SQL used to filter from all projects down to the
		 *        selected projects.
		 */
		function setSql(query_string) {
			service.masterList.sql = query_string;
		}
      
    /**
     *  @name updateAllProjects
     *  @desc Obtain the complete list of project brief descriptions from the
     *        back end and promise sending them to the setAllProjectResults
     *        callback function. Each brief description contains values for
     *        project attributes projectID, name, description, and finalID.
     *  @param {Number} [projectID] - projectID passed to the callback, which
     *        needs to be aware that it might be absent.
     */
    function updateAllProjects(projectID) {
    	var request = {
    			method: "POST",
    			url: "/getBriefDescriptions",
    			headers: {
    				"Content-Type": "application/json; charset=UTF-8",
    				"X-CSRFToken": window.csrf_token
    			}
    	};
    	service.masterList = $http(request)
    	.then(function(response) {
    		service.masterList = service.setAllProjectResults(response, projectID);
    		service.SaveState();
    		return service.masterList;
    	});
    	return service.masterList;
    };

  }
}());
