(function() {

	/**
	 *  @name reportTableService
	 *  @desc A factory for the service that manages the data associated with the
	 *        projects DataTable under the Report tab. The service retrieves and
	 *        stores the data shown in the table as well as the options and column
	 *        definitions for the table. Key data in the "master" service
	 *        attribute are saved after being updated and restored from client
	 *        session storage when the factory is reactivated.
	 */

	"use strict";

	angular
		.module('app.report')
		.factory('reportTableService', ReportTableService);

	ReportTableService.$inject = ["$compile", "$http", "$rootScope",
		"DTColumnBuilder", 
		"DTOptionsBuilder", "projectListService"];

	function ReportTableService($compile, $http, $rootScope,
			DTColumnBuilder,
			DTOptionsBuilder, projectListService) {

		/** service to be returned by factory */
		var service = {
			createdRow: createdRow,
			dataTableRowCount: dataTableRowCount,
			getReportResults: getReportResults,
			getReportTableData: getReportTableData,
			hasReportResults: hasReportResults,
			projectIDColumn: {data: "projectID",
			title: "ID",
			render: jumpToProjectLink,
			defaultContent: ""},
			RestoreState: RestoreState,
			SaveState: SaveState,
			scope: $rootScope.$new(), // http://stackoverflow.com/questions/17600905/compile-directives-via-service-in-angularjs#comment41413717_17601350
			setReportResults: setReportResults,
			setReportTableData: setReportTableData,
			tableColumns: tableColumns,
			title: "View Project List as Table",
			master: {
				dtColumns: [
					{data: "projectID", title: "ID",
						render: jumpToProjectLink,
						defaultContent: ""},
					{data: "name", title: "Name"},
					{data: "abstract", title: "Abstract"},
					{data: "maturity", title: "Maturity"},
					{data: "drivers", title: "Drivers"},
					{data: "latest_dispositions", title: "Disposition"},
					{data: "flavor", title: "Portfolio catagory"},
					{data: "startedOn", title: "Started"},
					{data: "bogus", title:"Bogus"}
					],
				dtInstance: {},
				dtOptions: {
					destroy: true,
					lengthChange: false,
					pageLength: 25,
					paging: false,
					pagingType: "full_numbers",
					saveState: true,
					searching: false,
					serverSide: false
				}
			},
		};

		service.RestoreState();

		$rootScope.$on("savestate", service.SaveState);
		$rootScope.$on("restorestate", service.RestoreState);

		return service;

		/**
		 *  @name createdRow
		 *  @desc A jQuery/angular DataTable callback, called on a row after it is
		 *        created. We use it to $compile it, to activate angular directives
		 *        like sref-ui.
		 *  @param {Object} row - a DataTable row object
		 *  @param {Object} data - the data for the row columns, passed in via ajax
		 *  @param {number} dataIndex - the DataTable row number
		 */
		function createdRow(row, data, dataIndex) {
			$compile(angular.element(row).contents())(service.scope);
		}

		/**
		 *  @name getReportResults
		 *  @desc Send an http GET query string to the backend and retrieve
		 */
		function getReportResults(query_string) {
			if (!service.hasReportResults(query_string)) {
				var request = {
						method: "POST",
						url: "/getReportResults",
						headers: {
							"Content-Type": "application/json; charset=UTF-8",
							"X-CSRFToken": window.csrf_token
						},
						data: {query_string: encodeURIComponent(query_string),
							tableColumns: service.tableColumns()}
				};
				service.gettingResults = $http(request)
					.then(function(response) {
						service.setReportResults(response);
						return projectListService.getMasterList();
					});
			}
			return service.gettingResults;
		}

		/**
		 *  @name getReportTableData
		 *  @desc Send an array of projectIDs to the backend and retrieve
		 *  	data for populating the DataTable. It returns the same row
		 *  	data as getReportResults, along with a list of projectIDs
		 *  	extracted from the results, a rendering of the input query
		 *  	string used as the url for the table, and a string to describe
		 *  	the query in human-readable terms.
		 *  @param {string} query_string - an http GET query string
		 */
		function getReportTableData() {
			var request = {
				method: "POST",
				url: "/getReportTableJSON",
				headers: {
					"Content-Type": "application/json; charset=UTF-8",
					"X-CSRFToken": window.csrf_token
				},
				data: {
					projectID: projectListService.getSelectedIds(),
					tableColumns: service.tableColumns()
				}
			};
			$http(request)
				.then(service.setReportTableData);
		}

		/**
		 * @name	hasReportResults
		 * @desc	Have report results already been saved? Does the query 
		 * 			in the current projectListService master list match the
		 * 			query in the transition?
		 */
		function hasReportResults(query_string) {
			var saved_query = null;
			if (typeof sessionStorage.reportTableService != "undefined") {
				var saved_query = angular.fromJson(sessionStorage.reportTableService).sql;
			}
			if (saved_query == query_string) {
				return true;
			}
			return false;
		}

		/**
		 *  @name jumpToProjectLink
		 *  @desc a jQuery/angular DataTable column rendering function, used to
		 *        populate the projectID column with a link for changing state_query
		 *        to view the project on this table row (after being compiled by
		 *        function createdRow)
		 *  @param {number} data - projectID value for this cell
		 *  @param {string} type - DataTable flag for the type of rendering to do
		 *  @param {Object} full = a data object with values for all columns in row
		 *  @param {Object} meta = a data object with column and row indices for cell
		 */
		function jumpToProjectLink( data, type, full, meta ) {
			return '<a ui-sref="app.project.detail({projectID: ' + data + '})">' + data + '</a>';
		}

		/**
		 *  @name dataTableRowCount
		 *  @desc return the number of data rows in the DataTable
		 */
		function dataTableRowCount() {
			try {
				return service.master.dtOptions.data.length;
			}
			catch (e) {
				return 0;
			}
		}

		/**
		 *  @name RestoreState
		 *  @desc restore the service.master object from client session storage
		 *        Special care is taken to restore the functions lost in JSON
		 */
		function RestoreState() {
			if (typeof sessionStorage.reportTableService != "undefined") {
				var master = angular.fromJson(sessionStorage.reportTableService);

				// render function gets lost in conversion to JSON and needs to be replaced
				service.master.dtColumns = master.dtColumns;
				service.master.dtColumns[0] = service.projectIDColumn;

				// createdRow option function gets lost in converstion to JSON
				service.master.dtOptions = master.dtOptions;
				service.master.dtOptions.createdRow = service.createdRow;
			}
		}

		/**
		 *  @name SaveState
		 *  @desc save the service.master object in client session storage
		 *        Functions will be lost in the conversion to JSON.
		 */
		function SaveState() {
			sessionStorage.reportTableService = angular.toJson(service.master);
		}

		function setReportResults(response) {
			projectListService.setList(response.data.response.projectList);
			projectListService.setDescription(response.data.response.query_desc);
			projectListService.setSql(response.data.response.query_string);
			projectListService.SaveState();
			setReportTableData(response);
			//service.master.dtInstance.rerender();
			service.SaveState();
		}

		function setReportTableData(response) {
			service.master.sql = response.data.response.query_string;
			service.master.dtOptions = DTOptionsBuilder.newOptions().withBootstrap();

			/** initial data to be replaced when the promise is resolved */
			service.master.dtOptions.withOption("data", []);

			_.each(Object.keys(response.data.response.options), function(key) {
				service.master.dtOptions.withOption(key, response.data.response.options[key]);
			});
			service.master.dtOptions.withOption("createdRow", createdRow);
			service.master.dtColumns = [service.projectIDColumn].concat(response.data.response.columns);
			service.master.dtOptions.data = response.data.response.data;
			service.SaveState();
		}

		/**
		 *  @name tableColumns
		 *  @desc Return a list of column names by extracting the "data" attribute
		 *        from each item in the dtColumns list.
		 *  @return {string[]}
		 */
		function tableColumns() {
			return _.pluck(service.master.dtColumns, "data");
		}
	}

}());
