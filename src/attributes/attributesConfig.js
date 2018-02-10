/**
 *  @name attributesConfig
 *  @desc Configuration for app.attributes module:
 *
 *      Declare angular-formly configuration. 
 */

"use strict";

angular
  .module("app.attributes")
  .config(attributesConfig);

attributesConfig.$inject = ["formlyConfigProvider"]

function attributesConfig(formlyConfigProvider) {
  /* Declare angular-formly configuration. */
  
  /* Set up for Bootstrap horizontal form by changing the label wrapper and
   * the template. The templates are at the bottom of the project.html
   * template. */
  formlyConfigProvider.extras.removeChromeAutoComplete = true;
  formlyConfigProvider.extras.explicitAsync = true;
  formlyConfigProvider.removeWrapperByName('bootstrapLabel');
  formlyConfigProvider.setWrapper({
    name: 'bootstrapLabel',
    template:  [
      '<label for="{{::id}}" class="col-sm-2 control-label">',
        '{{to.label}} {{to.required ? "*" : ""}}',
      '</label>',
      '<div class="col-sm-10">',
        '<formly-transclude></formly-transclude>',
      '</div>'
    ].join(' ')
  });
  
  /* New/overridden types */

  /* Replace formlyBootstrap input field type to implement read-only forms. */
  formlyConfigProvider.setType({
      name: 'input',
      templateUrl: 'input-template.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    })
  formlyConfigProvider.setType({
      name: "display",
      templateUrl: "display-template.html",
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    })
  formlyConfigProvider.setType({
      name: "displayTextArea",
      templateUrl: "displayTextArea-template.html",
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    })
  formlyConfigProvider.setType({
      name: "textarea",
      templateUrl: "textarea-template.html",
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    })
  formlyConfigProvider.setType({
      name: "date",
      templateUrl: "displayDate-template.html",
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });
  formlyConfigProvider.setType({
      name: "timestamp",
      templateUrl: "displayTimestamp-template.html",
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });
  formlyConfigProvider.setType({
      name: "displayTimestamp",
      templateUrl: "displayTimestamp-template.html",
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });
  formlyConfigProvider.setType({
      name: "daterange",
      templateUrl: "displayDaterange-template.html",
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });

  /* Declare a datepicker type. */
  var attributes = [
    'date-disabled',
    'custom-class',
    'show-weeks',
    'starting-day',
    'init-date',
    'min-mode',
    'max-mode',
    'format-day',
    'format-month',
    'format-year',
    'format-day-header',
    'format-day-title',
    'format-month-title',
    'year-range',
    'shortcut-propagation',
    'datepicker-popup',
    'show-button-bar',
    'current-text',
    'clear-text',
    'close-text',
    'close-on-date-selection',
    'datepicker-append-to-body'
  ];

  var bindings = [
    'datepicker-mode',
    'min-date',
    'max-date'
  ];

  var ngModelAttrs = {};

  angular.forEach(attributes, function(attr) {
    ngModelAttrs[camelize(attr)] = {attribute: attr};
  });

  angular.forEach(bindings, function(binding) {
    ngModelAttrs[camelize(binding)] = {bound: binding};
  });

  //console.log(ngModelAttrs);

  formlyConfigProvider.setType({
    name: 'datepicker',
    templateUrl:  'datepicker.html',
    wrapper: ['bootstrapLabel', 'bootstrapHasError'],
    defaultOptions: {
      ngModelAttrs: ngModelAttrs,
      templateOptions: {
        datepickerOptions: {
          format: 'MM/dd/yyyy',
          initDate: new Date()
        }
      }
    },
    controller: ['$scope', function ($scope) {
      $scope.datepicker = {};

      $scope.datepicker.opened = false;

      $scope.datepicker.open = function ($event) {
        $scope.datepicker.opened = !$scope.datepicker.opened;
      };
    }]
  });

  function camelize(string) {
    string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
    // Ensure 1st char is always lowercase
    return string.replace(/^([A-Z])/, function(match, chr) {
      return chr ? chr.toLowerCase() : '';
    });
  }
}

