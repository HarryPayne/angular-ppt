(function() {

	/**
	 *  @name projectDataService
	 *  @desc A factory for the primary service that manages the data associated
	 *        with the Project tab. That is a lot, and it gets help from a couple
	 *        of other services:
	 *
	 *          attributesService - for lower level data attribute management
	 *            (from the app.attributes module).
	 *          loginStateService - a service from the app.login module for
	 *            logging in and out and reporting user roles.
	 *          projectListService - for the data that support the Previous and
	 *            Next top-level tabs, and also remember just which projects were
	 *            selected by your last filter or breakdown by attribute.
	 */

	"use strict";

	angular
	    .module("app.project")
	    .factory("projectDataService", ProjectDataService);

	ProjectDataService.$inject = ["$rootScope", "$http",
			"$q", "$state", "$uiRouterGlobals", "$timeout", "$transitions", "moment",
			"attributesService", "loginStateService",
			"modalConfirmService", "projectListService"];

	function ProjectDataService($rootScope, $http,
			$q, $state, $uiRouterGlobals, $timeout, $transitions, moment,
			attributesService, loginStateService,
			modalConfirmService, projectListService) {

		/** service to be returned by this factory */
		var service = {
				addProject: addProject,
				attributes: attributesService.getAllAttributes,
				cancelAddProject: cancelAddProject,
				changeMode: changeMode,
				createProject: createProject,
				currentMode: currentMode,
				currentSubtab: currentSubtab,
				editMode: editMode,
				flatten: flatten,
				//getFieldDataFromResult: getFieldDataFromResult,
				getEnabledFields: getEnabledFields,
				getFormlyField: attributesService.getFormlyField,
				getFormlyFields: attributesService.getFormlyFields,
				getModelObject: getModelObject,
				getModelValue: getModelValue,
				getNewPristineModel: getNewPristineModel,
				getProjectData: getProjectData,
				getProjectDataValues: getProjectDataValues,
				getProjectAttributes: attributesService.getProjectAttributes,
				getSelectedDetail: getSelectedDetail,
				hasProjectModel: hasProjectModel,
				hideDetails: hideDetails,
				isSelected: isSelected,
				jsonToModel: jsonToModel,
				jumpToAddForm: jumpToAddForm,
				jumpToAtachFile: jumpToAtachFile,
				jumpToNewProject: jumpToNewProject,
				modelToJSON: modelToJSON,
				printValue: attributesService.printValue,
				RestoreState: RestoreState,
				rootScope: $rootScope,
				saveProject: saveProject,
				SaveState: SaveState,
				setProjectData: setProjectData,
				showDetails: showDetails,
				showEditSuccess: showEditSuccess,
				tableToJSON: tableToJSON,
				unsavedDataPopup: unsavedDataPopup,
				updatePristineProject: updatePristineProject,
				valueToJSON: valueToJSON
		};

		//initService();

		$rootScope.$on("savestate", service.SaveState);
//		$rootScope.$on("restorestate", service.RestoreState);

		$rootScope.$on("setProjectFormPristine", function() {
			if (typeof service.projectFormlyForm != "undefined") {
				service.projectFormlyForm.$setPristine(true);
			}
		});

		return service;

		/**
		 * @name addProject
		 * @desc Start the process of creating a new project by collecting the
		 *        attributes of the new project and making a call to the server
		 *        for a fresh csrf token.
		 */
		function addProject() {
			/** Gather all of the form data values by pulling them from the
			 *  attributes in memory that are marked as associated with the
			 *  description table. We don't look at the form -- we use it mostly
			 *  for validation (if there were any required fields) and the unsaved
			 *  data check.
			 *  */
			var formData = attributesService.getFormData("description", []);
			/* start with a fresh csrf token */
			var request = {
					method: "POST",
					url: "/getProjectAttributes/0",
					headers: {
						"Content-Type": "application/json; charset=UTF-8",
						"X-CSRFToken": window.csrf_token
					}
			};
			$http(request)
			.then(function(response) {
				createProject(response, formData);
			});
		}

		/**
		 *  @name cancelAddProject
		 *  @desc Cancel out of the Add a Project screen (under the Select tab) by
		 *        navigating back to the select state
		 */
		function cancelAddProject() {
			$state.go("select.home");
		}

		/**
		 *  @name changeMode
		 *  @desc a function for navigating between the views under the Project
		 *        tab for a specified project
		 *  @param {string} mode - the name of a state under the "project" virtual
		 *        state or "view" as an alias for "project.detail".
		 */
		function changeMode(mode) {
			if (!mode) {
				$state.go("project.detail", {projectID: service.projectID});
			}
			else {
				$state.go(mode, {projectID: service.projectID});
			}
		}

		/**
		 *  @name createProject
		 *  @desc Gather form data for creating a new project and send it to the 
		 *        back end to create a new project in the database. The response
		 *        from that server request is handed to a callback that navigates
		 *        to that new project. Only data saved in the description table
		 *        is shown on the add form. Data for other tables can be added
		 *        once the project has been created.
		 *  @callback jumpToNewProject
		 */
		function createProject(response, formData) {
			/** save the new csrf token */
			formData.csrf_token = response.data.csrf_token;

			delete formData.projectID;
			var request = {
					method: "POST",
					url: "/projectCreate",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
						"X-CSRFToken": formData.csrf_token
					},
					/** We use jQuery.param to serialize the data -- Python, or
					 *  at least Flask, has a problem with the angularjs serializer. */
					data: jQuery.param(formData, true)
			};
			var create_response;
			$http(request)
			.then(function(create_response) {
				service.setProjectData(create_response, 
						{projectID: create_response.data.projectID});
				var new_projectID = projectListService.updateAllProjects(
						create_response.data.projectID);
				return new_projectID;
			})
			.then(function(new_projectID) {
				service.jumpToNewProject(new_projectID);
			});
		}

		/**
		 *  @name currentMode
		 *  @desc return the current mode
		 *  @return {string} "view" if state name is "project.detail" else state
		 *        name
		 */
		function currentMode() {
			if ($state.current.name == "project.detail") {
				return "view";
			}
			var state_path = $state.current.name.split(".");
			state_path.shift();
			state_path.shift();
			return state_path.join(".");
		}

		/**
		 *  @name currentSubtab
		 *  @desc return the current project edit subtab
		 *  @return {string} "view" if state name is "project.detail" else state
		 *        name
		 */
		function currentSubtab() {
			var state_path = $state.current.name.split(".");
			state_path.shift();
			return state_path.shift();
		}

		/**
		 *  @name editMode
		 *  @desc return the truth of the statement "I am in edit mode."
		 *  @return {Boolean}
		 */    
		function editMode() {
			if ($state.current.name.indexOf("edit") > -1) {
				return true;
			}
			return false;
		}

		/**
		 * @name flatten
		 * @desc Flatten the data for one choice of sub-object by assigning those
		 *       values to service.projectModel. Parameters specify which list of
		 *       many-to-one items with respect to a project, and which item in
		 *       that list, by index is to be flattened.
		 * @param {string} list_name    The name of the attribute in datasource()
		 *                              chosen for flattening ("comments", or
		 *                              "dispositions").
		 * @param {number} index        The index of the selected item.
		 */
		function flatten(list_name, selected) {
			var fields = service.getFormlyFields(list_name);
			_.each(fields, function(field) {
				delete service.projectModel[field.key];
				service.projectModel[field.key] = this[field.key];
			}, selected);
			service.SaveState();
		}

		/**
		 * @name getEnabledFields
		 * @desc A method that returns only those formly fields for a table where
		 *       templateOptions.disabled is false.
		 * @param {String} table_name of the fields to be returned.
		 */
		function getEnabledFields(table_name) {
			return _.filter(service.getFormlyFields(table_name), function(field) {
				return field.templateOptions.disabled == false;
			});
		}

		/**
		 * @name getModelObject
		 * @desc A function that returns the entire data model for a project, if
		 *       there is one in hand. Otherwise, return a promise for one that
		 *       will be retrieved from the server. service.getProjectData returns
		 *       a promise.
		 *
		 * @param {Int} projectID
		 */
		function getModelObject(projectID) {
			if (!service.hasProjectModel(projectID) || projectID != service.projectID) {
				service.projectModel = service.getProjectData(projectID);
			}
			return service.projectModel;
		}

		/**
		 * @name getModelValue
		 * @desc A method that returns the value of the requested model attribute.
		 * @param {string} attr_name - name of the requested attribute.
		 */
		function getModelValue(attr_name) {
			return service.projectModel[attr_name];
		}

		/**
		 *  @name getNewPristineModel
		 *  @desc Return
		 */
		function getNewPristineModel() {
			return service.updatePristineProject();
		}

		/**
		 *  @name getProjectData
		 *  @desc Get all of the project attributes values from the server. In a
		 *        callback, these values are merged with attributes held by the
		 *        attributesService from the app.attributes module.
		 *  @param {Int} projectID
		 *  @callback setProjectData
		 *  @return {Object} - a promise that is resolved once the response
		 *        from the back end has been saved.
		 */
		function getProjectData(projectID) {
			if (projectID > -1) {
				var request = {
						method: "POST",
						url: "/getProjectAttributes/" + projectID,
						headers: {
							"Content-Type": "application/json; charset=UTF-8",
							"X-CSRFToken": window.csrf_token
						}
				};
				service.projectModel = $http(request)
				.then(function(response) {
					service.setProjectData(response);
					return service.projectModel;
				});
			}
			return service.projectModel;
		}

		/**
		 * @name getProjectDataValues
		 * @desc Get all data for a project as an object with attributes and
		 *       save them.
		 * @param {Object} params - a $stateParams object or a custom object
		 *       with the same attributes, passed to the callback function.
		 * @return {Object} - a promise that is resolved once the response 
		 *       from the back end has been saved.
		 */
		function getProjectDataValues(params) {
			var deferred = $q.defer();
			if (parseInt(params.projectID) > -1) {
				var request = {
						method: "POST",
						url: "/getProjectAttributes/" + params.projectID,
						headers: {
							"Content-Type": "application/json; charset=UTF-8",
							"X-CSRFToken": window.csrf_token
						}
				};
				$http(request)
				.then(function(response) {
					service.setProjectData(response, params);
					deferred.resolve(params);
				});
				return deferred.promise;
			}
		}

		/**
		 * @name getSelectedDetail
		 * @desc Given the name of a project model attribute that corresponds
		 *       to a list of objects, and an object with primary key attributes
		 *       and values, use the values to filter the list to find the
		 *       selected one, and return it.
		 * @param {String} name of the project attribute
		 * @param {Object} holding primary key values
		 */
		function getSelectedDetail(attribute_name, key_object) {
			var objects = angular.copy(service.getModelObject()[attribute_name]);
			var keys = Object.keys(key_object);
			var fields = new Object;
			_.each(keys, function(key) {
				fields[key] = service.getFormlyField(key);
			});
			objects = _.filter(objects, function(object) {
				var pass = true;
				_.each(keys, function(key) {
					if (key == "projectID") return;
					if (fields[key].type == "daterangepicker") {
						if (object[key].start.toString() !=
							  this[key].start.toString()) {
							pass = false;
						}
						if (object[key].end.toString() !=
							  this[key].end.toString()) {
							pass = false;
						}
					}
					else if (object[key].toString() != keys[key]) {
						pass = false;
					}
				}, key_object);
				return pass;
			}, this);
			if (objects.length == 1) {
				return objects[0];
			}
		}

		/**
		 *  @name hasProjectModel
		 *  @desc Has the project model been initialized?
		 */
		function hasProjectModel(projectID) {
			if (typeof service.projectModel == "undefined") {
				return false;
			}
			if (projectID != service.projectID) {
				return false;
			}
			return true;
		}

		/**
		 *  @name hideDetails
		 *  @desc a function for canceling out of Add a Comment or Add a
		 *        Disposition by navigating away to the project edit Comments
		 *        or Dispositions sub-tab, respectively. Add a Comment users
		 *        may not have a role that gives them access to the edit view,
		 *        in which case they are taken back to view mode/state
		 *        project.detail.
		 * @param {string} table_name - "comment" to Add a Comment, "disposition"
		 *        for Add a Disposition.
		 * @param {Object[]} keys -
		 */
		function hideDetails(table_name, keys) {
			var selected = attributesService
							.updateProjAttrsFromRawItem(table_name, keys);
			if (loginStateService.canEditProjects()) {
				$state.go("project." + table_name + ".edit",
						  {projectID: $state.params.projectID});
			}
			else {
				$state.go("project.detail", {projectID: $state.params.projectID});
			}
		}

		/**
		 * @name isSelected
		 * @desc Return the truth of the statement "this is the item you want to
		 *        work on." The primary key values of the item are compared with
		 *        the stateParam values for each key.
		 */
		function isSelected(table_name, index, keys) {
			if (typeof index == "undefined" ||
					typeof keys == "undefined" ||
					keys.length == 0 ||
					typeof service.projectModel[table_name] == "undefined" ||
					Object.keys(service.projectModel[table_name]).length == 0) {
				return false;
			}
			var selected = false;
			var item = service.projectModel[table_name][index];
			if (typeof item != "undefined") {
				_.each(keys, function(key){
					var state_value = service.stateParams[key];
					var item_value = item[key].toString();
					if ((typeof state_value != "undefined"
						&& typeof item_value != "undefined"
							&& state_value == item_value)) {
						selected =  true;
					}
					else {
						selected = false;
					}
				}, this);
			}
			// If this is the one, flatten the data source
			if (selected) {
				service.flatten(table_name, index);
			}
			return selected;
		}

		/**
		 *  @name jsonToModel
		 *  @desc Return a model that contains date objects built from a json
		 *        object with ISO 8601 strings. Original from:
		 *          http://aboutcode.net/2013/07/27/json-date-parsing-angularjs.html
		 *
		 *        Modified for date range, which is two date strings joined by "/". 
		 *
		 *        Requires moment and moment-range. We use moment because if we
		 *        instantiate an object with a date string (YYY-MM_DD), we need to
		 *        send a date string back to the server when we submit the model.
		 *  @param {Object} json object to be scanned.
		 *  @return {Object} - a fully copy of the input json, with date strings
		 *        turned into date, datetime, or date range objects.
		 */
		function jsonToModel(json) {
			// No processing for things that are not objects.
			if (typeof json !== "object") return json;

			var iso8601 = new RegExp("^\([\\+-]?\\d{4}\(?!\\d{2}\\b\)\)\(\(-?\)\(\(0[1-9]|1[0-2]\)\(\\3\([12]\\d|0[1-9]|3[01]\)\)?|W\([0-4]\\d|5[0-2]\)\(-?[1-7]\)?|\(00[1-9]|0[1-9]\\d|[12]\\d{2}|3\([0-5]\\d|6[1-6]\)\)\)\([T\\s]\(\(\([01]\\d|2[0-3]\)\(\(:?\)[0-5]\\d\)?|24\\:?00\)\([\\.,]\\d+\(?!:\)\)?\)?\(\\17[0-5]\\d\([\.,]\\d+\)?\)?\([zZ]|\([\\+-]\)\([01]\\d|2[0-3]\):?\([0-5]\\d\)?\)?\)?\)?$");

			var model = new Object;
			_.each(Object.keys(json), function(key) {

				if (!json.hasOwnProperty(key)) return;

				var json_value = json[key];
				var match;

				/* Check for daterange strings, which contain two date strings
				 * joined by "/". */
				if (typeof json_value === "string" &&
					json_value.split("/").length == 2) {
					/* Split on "/", send both to jsonToModel, and check that
					 * what we get back is a list of moment objects and/or 
					 * empty strings. */
					var values = json_value.split("/");
					_.map(values, function(val) {
						if (val == "") {return null;}
						else {return val;}
					});
					if (values[0] == "") values[0] = null;
					if (values[1] == "") values[1] = null;
					var range_model = jsonToModel(values);

					if ((range_model[0].hasOwnProperty("_isAMomentObject") || values[0] == null) &&
							(range_model[1].hasOwnProperty("_isAMomentObject") || values[1] == null)) {

						var range = moment.range(range_model[0], range_model[1]);
						// Attributes for daterangepicker field
						range.startDate = range.start
						range.endDate = range.end
						range.FY = range.start.year();
						if (range.duration("quarters") == 4) {
							range.Q = 0;
						}
						else {
							range.Q = range.start.quarter()
						}

						model[key] = range
					}
				}
				// Check for string value that looks like a single date.
				else if (typeof json_value === "string" &&
						(match = json_value.match(iso8601))) {
					/* Data from back end is UTC. Instantiating this way 
					 * converts to local time. */
					model[key] = moment(match[0]);
				} 

				else if (json_value !== null && typeof json_value === "object") {
					if (_.isArray(json_value)) {
						var array = [];
						_.each(json_value, function(item) {
							array.push(jsonToModel(item));
						});
						model[key] = array;
					}
					else {
						// Recurse into object's attributes
						model[key] = jsonToModel(json_value);
					}
				}
				else {
					model[key] = json_value;
				}
			});
			return model;
		}

		/**
		 *  @name jumpToAddForm
		 *  @desc Prepare for adding a comment or disposition by nulling out the
		 *        project attribute values for the corresponding table. To make
		 *        that work, the keys parameter values must have id=0, which
		 *        cannot be true for primary key columns. After clearing out the
		 *        data, 
		 */
		function jumpToAddForm(table_name, keys) {
			attributesService.updateProjAttrsFromRawItem(table_name, keys);
			if (_.contains(["comment", "disposition"], table_name)) {
				$state.go("project." + table_name + ".edit", 
						{projectID: $state.params.projectID});
			}
			$state.go("project." + table_name + ".add",
					  {projectID: $state.params.projectID});
		}

		function jumpToAtachFile() {
			$state.go("project.attach", {projectID: service.projectID});
		}

		/**
		 * @name jumpToNewProject
		 * @desc After a new project has been created, jump to the edit view of 
		 *        that project.
		 */
		function jumpToNewProject(projectID) {
			projectListService.updateAllProjects(projectID);
			$state.go("project.description.edit", {projectID: projectID});
		}

		/**
		 * @name modelToJSON
		 * @desc Convert the service's project model, which contains Javascript
		 *       date objects, into JSON suitable for saving and restoring.
		 */
		function modelToJSON(model) {
			if (typeof model == "undefined") return;
			var json = new Object;
			var keys = Object.keys(model);

			_.each(keys, function(key) {
				var value = model[key];
				json[key] = valueToJSON(key, value);
			});
			return json;
		}

		function RestoreState() {
			if (typeof sessionStorage.projectDataServiceAttributes != "undefined") {
				var data = angular.fromJson(sessionStorage.projectDataServiceAttributes);
				service.restoredParams = data.savedState.params;
				service.restoredState = data.savedState.name;
				service.projectID = data.savedState.params.projectID;
				service.csrf_token = data.csrf_token;
				service.projectModel = service.jsonToModel(data.projectModel);

				/* If current state is an "edit" state, and previous state was 
				 * "editDetail" or "add" under the same subtab, then restore success 
				 * or error messages that we did not see before changing state. 
				 * Otherwise, save a state with cleared out messages. */
				if ((_.last(service.restoredState.split(".")) == "editDetail" &&
						service.restoredState.replace("editDetail", "edit") == 
							$state.params.name)
							||
							(_.last(service.restoredState.split(".")) == "add" &&
									service.restoredState.replace("add", "edit") == 
										$state.params.name)) {
					service.success = data.messages.success;
					service.error = data.messages.error;
				}
				else {
					service.SaveState();
				}
			}
		}

		/**
		 * @name saveProject
		 * @desc Save edits made to the specified table by sending data back to the
		 *        server. Revised data for that table (and a fresh csrf token) are
		 *        returned, along with success or error messages. In the case of
		 *        data that is many-to-one with projects, the form sends a list
		 *        index object. It's "name" attribute give the top level name of
		 *        the attribute that contains the list, and an "index" value, which
		 *        gives the position in that list of the item to be saved.
		 * @param {string} table_name - the name of the table being updated.
		 * @param {Object[]} list_index - list of primary key values used to identify the
		 *        record of interest if the table is one-to-many with projectID.
		 */
		function saveProject(table_name, item) {
			var projectID = $state.params.projectID ? $state.params.projectID : "";
			var data;
			if (typeof item != "undefined") {
				data = tableToJSON(item.field_name, item.model);
			}
			else {
				data = tableToJSON(table_name, service.projectModel);
			}
			var request = {
					method: "POST",
					url: "/projectEdit/" + projectID + "/" + table_name,
					headers: {
						"Content-Type": "application/json; charset=UTF-8",
						"X-CSRFToken": service.csrf_token
					},
					data: data 
			};
			$http(request)
			.then(function (response) {
				if (response.status == 200) {
					service.setProjectData(response);
					service.noCheck = true;
					var stateName = table_name;
					if (table_name == "project") {
						stateName = "projectMan";
					}
					if (typeof service.success != "undefined" && service.success.length > 0) {
						$state.go("project." + stateName + ".edit", {projectID: $state.params.projectID, noCheck: true});
					}
				}
			});
		}

		function SaveState() {
			if (typeof service.projectModel == "undefined" ||
					Object.keys(service.projectModel).length == 0) return;

			var data = new Object;
//			data.savedState = $uiRouterGlobals.params;
			data.savedState = {projectID: service.projectID};
			data.csrf_token = service.csrf_token;
			data.projectModel = service.projectModel; 
			data.messages = {success: service.success, error: service.error}
			sessionStorage.projectDataServiceAttributes = angular.toJson(service.modelToJSON(data));
		}

		/**
		 * @name setProjectData
		 * @desc Save project data sent from the back end. Make the project sent 
		 *        back be the current project, update project attributes values,
		 *        and handle success/error messages.
		 */
		function setProjectData(result) {
			service.projectID = parseInt(result.data.projectID);
			service.csrf_token = result.data.csrf_token;
			service.success = result.data.success;
			service.error = result.data.errors;

			service.projectModel = jsonToModel(result.data.formData);
			service.SaveState();

			// Make the project sent back be the current project:
			projectListService.setProjectID(service.projectID);

			/** mark the form as $pristine. Only the controller can do that 
			 * so give it a ping. */
			$rootScope.$broadcast("setProjectFormPristine");
		}

		/**
		 * @name showDetails
		 * @desc The edit view for tables that are one-to-many with projectID 
		 *        consist of a list of all the rows in the table for the current
		 *        project. Each row has an Edit button to open a showDetails
		 *        state with an edit form for that row. This method is the action
		 *        linked to those edit buttons. The data for the selected item is
		 *        copied into the project attributes for this project and then
		 *        handled like a table that is one-to-one with projectID.
		 * @param {string} attribute_name
		 * @param {Object} keys
		 */
		function showDetails(attribute_name, keys) {
			//keys.projectID = service.projectID;
			//$state.go("project."+table_name+".editDetail", keys);

			//var selected = attributesService.updateProjAttrsFromRawItem(table_name, keys);
			var selected = service.getSelectedDetail(attribute_name, keys);
			if (attribute_name == 'comments') {
				$state.go("project.comment.editDetail", 
						{projectID: service.projectID, commentID: selected.commentID});
			}
			if (attribute_name == 'dispositions') {
				$state.go("project.disposition.editDetail", 
						{projectID: projectListService.getProjectID(), 
					disposedIn: selected.disposedIn});
			}

		}

		/**
		 * @name showEditSuccess
		 * @desc Return the truth of the statement "I have a success message that I
		 *        I should be showing right now." Returns true if there is a 
		 *        success message and the form is in its pristine state.
		 * @return {Boolean} 
		 */
		function showEditSuccess() {
			if (typeof projectForm != "undefined") {
				return Boolean(_.contains(projectForm.classList, "ng-pristine") && service.success);
			}
		}

		/**
		 *  @name tableToJSON
		 *  @desc Take a form model for a specified table (where dates are 
		 *        represented by javascript Date objects) and return pure JSON. We 
		 *        need this for sending form data to the back end. 
		 *        Companion to jsonToModel. 
		 *  @param {Object} model - model with Date objects.
		 *  @return {Object} JSON object
		 */
		function tableToJSON(table_name, model) {
			var fields = attributesService.getFormlyFields(table_name);
			var form_data = new Object;

			// Iterate over table fields
			_.each(fields, function (field) {
				var key = field.key;
				var value = model[field.key];
				var json = valueToJSON(key, value);
				if (typeof key == "undefined") {
					key;
				}

				// Last modified information is added on the back end.
				if (typeof key != "undefined" && key.search(/astModified$/) > -1) {
					return;
				}
				else if (key.search(/astModifiedBy$/) > -1) {
					return;
				}

				// My back end wants strings instead of numbers.
				else if (typeof json == "number") {
					json = json.toString();
				}
				else if (field.type == "select") {
					// Convert all integer values to strings
					var target = []
					_.map(value, function(item) {
						if (typeof item != "undefined") {
							target.push(item.toString());
						}
						else {
							return item;
						}
					});
					json = target;
				}

				// My back end wants dates without milliseconds
				else if (_.contains(["timestamp", "displayTimestamp"], field.type)) {
					// Take off the microseconds, to make the back end happy.
					if (typeof json != "undefined" && json != null && json.length > 0) {
						json = json.replace(/\.000Z$/, "Z");
					}
				}

				// My back end wants this date range format.
				else if (field.type == "daterange") {
					if (json !==null && typeof json != "undefined") {
						json = "["+ json +"]";      
					}
				}
				form_data[key] = json;
			});

			return form_data;
		}

		/**
		 *  @name unsavedDataPopup
		 *  @desc Open a popup and ask how to proceed in the case of attempting to 
		 *        navigate away from one of the project edit sub-tabs when there 
		 *        is unsaved data in the form. The  function is bound to the 
		 *        $transition.onBefore event, and the calling sequence is that of a 
		 *        handler for this event.
		 *  @param {Object} event
		 *  @param {Object} toState
		 *  @param {Object} toParams
		 *  @param {Object} fromState
		 *  @param {Object} fromParams
		 */
		function unsavedDataPopup(transition, controller, fromParams) {
			service.success = "";
			if (typeof service.noCheck != "undefined") {
				controller.projectFormlyForm.$setPristine(true);
				delete service.noCheck;
				//$state.go(toState, toParams);
			}

			/** if the "projectForm" project editing form has unsaved changes ... */
			if (typeof controller.projectFormlyForm != "undefined" &&
					controller.projectFormlyForm.$dirty) {

// 				event.preventDefault();

				var modalOptions = {
						closeText: "Cancel",
						actionText: "Continue",
						headerText: "Unsaved changes",
						bodyText: ["You have unsaved changes. Press Continue to ",
							"discard your changes and navigate away, or ",
							"press Cancel to stay on this page."].join("")
				};

				/* Open a modal window that asks the question shown above as 
				 * bodyText, and shows Continue and Cancel buttons for making 
				 * a response. The promised response is passed to a callback 
				 * function.
				 */
				controller.confirm = modalConfirmService.showModal({}, modalOptions)
					.then(
						function (response) {
							controller.projectFormlyOptions.resetModel();
//							controller.projectFormlyForm.$setPristine();
// 							service.confirm.resolve(true);
							return true;
	// 						$state.go(toState, toParams);
						},
						function (r) {
							return false;
// 							service.confirm.resolve(false);
						}
					);
				
// 				return controller.confirm;
			}
		}

		/**
		 *  @name updatePristineProject
		 *  @desc Ask the server for a pristine description table data model, 
		 *        used by the form for creating a new project. Obtained by asking 
		 *        the backend for project zero.
		 */
		function updatePristineProject() {
			var deferred = $q.defer();
			var request = {
					method: "POST",
					url: "/getProjectAttributes/0",
					headers: {
						"Content-Type": "application/json; charset=UTF-8",
						"X-CSRFToken": window.csrf_token
					}
			};
			$http(request)
				.then(function(response) {
					service.pristineModel = jsonToModel(response.data.formData);
					delete service.waitingForPristineModel;
					deferred.resolve(service.pristineModel);
				}
			);
			return deferred.promise;
		}

		/**
		 * @name valueToJSON
		 * @desc Convert a value in the project model to JSON. The primary use is
		 *       to convert Date objects back into JSON for storage on the back
		 *       end, in a format appropriate to a picky back end. Our back end
		 *       (SQLAlchemy) is picky, so the JSON for a Date column cannot have
		 *       a time in it. We use momentJS to get the control we need, and
		 *       moment-range for Daterange columns. Our back end also requires 
		 *       us to turn integers into strings. 
		 *       
		 *       This method is called iteratively to traverse all sub-objects
		 *       of the one passed in.
		 *  @param {Object} model - model with Date objects.
		 *  @return {Object} JSON object
		 */
		function valueToJSON(key, value) {
			// Ignore things that are not objects.
			if (typeof value != "object") return value;

			// Get the formly field for guidance. If there is no field then move on.
			var field = attributesService.getFormlyField(key);

			// Don't do anything fancy with null values.
			if (value === null) {
				return null;
			}

			else if (typeof value == "number") {
				return value.toString();
			}

			// Convert date-like objects.
			else if (field && (field.type == "date" || field.type =="datepicker")) { 
				// My back end does not like a time in the value for a date field.
				return value.format("YYYY-MM-DD");
			}
			else if (field && field.type == "timestamp") {
				return value.toISOString();
			}
			else if (field && field.type == "daterange") {
				// My backend wants 2 date strings separated by "/"
				return [value.start.utc().format("YYYY-MM-DD"),
					value.end.utc().format("YYYY-MM-DD")].join("/");
			}
			else if (value._isAMomentObject) {
				// My backend does not like milliseconds
				return value.toJSON();
			}

			// Dive into remaining objects.
			else if (typeof value == "object") {
				/* Should we keep going or not? That is the question. */
				if (key == "dispositions") {
					key;
				}

				// Is this the project model?
				if (key == "projectModel") {
					return modelToJSON(value);
				}

				// Is it one of the attributes we know about?
				//if (typeof field != "undefined") {
				//  return modelToJSON(value);
				//}

				// Is it one of the tables we know about?
				else if (_.filter(attributesService.getFormlyFormNames(), 
					function(name) {return name==this}, 'comment').length > 0) {
						return tableToJSON(key, value);
				}

				/* Is it a container for a list of tables we know about?
				 * By naming convention, items in this category will have a key that 
				 * is a table name with "s" appended to the end. So "comments" would
				 * contain a list of comment objects. Return a list of converted
				 * sub-objects. */
				else if (_.isArray(value)) {
					var table_name = key.replace(/s$/, "");
					var subitems = [];
					_.each(value, function(item) {
						subitems.push(modelToJSON(item));
					});
					return subitems;
				}
			}

			// No processing required.
			return value;
		}
	}
}());
