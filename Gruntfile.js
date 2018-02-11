module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
		    javascript: {
		        src: ["node_modules/jquery/dist/jquery.min.js",
		              "node_modules/datatables/media/js/jquery.dataTables.min.js",
		              "node_modules/api-check/dist/api-check.min.js",
		              "node_modules/angular/angular.js",
		              "node_modules/angular-animate/angular-animate.js",
		              "node_modules/angular-datatables/dist/angular-datatables.js",
		              "node_modules/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.min.js",
		              "node_modules/angular-resource/angular-resource.js",
		              "node_modules/angular-sanitize/angular-sanitize.js",
		              "node_modules/angular-touch/angular-touch.min.js",
		              "node_modules/angular-ui-date/dist/date.js",
		              "node_modules/@uirouter/angularjs/release/angular-ui-router.min.js",
		              "node_modules/bootstrap/dist/js/bootstrap.min.js",
		              "node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js",
		              "node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
		              "node_modules/angular-ui-router-uib-modal/angular-ui-router-uib-modal.js",
		              "node_modules/angular-storage/dist/angular-storage.min.js",
		              "node_modules/angular-jwt/dist/angular-jwt.min.js",
		              "node_modules/underscore/underscore.js",
		              "node_modules/angular-formly/dist/formly.js",
		              "node_modules/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js",
		              "node_modules/moment/moment.js",
		              "node_modules/moment-range/dist/moment-range.js",
		              "node_modules/angular-moment/angular-moment.min.js",
		              "src/app.js",
		              "src/app.config.js",
		              "src/app.controller.js",
		              "src/app.run.js",
		              "src/attributes/*.js",
		              "src/comment/*.js",
		              "src/common/*.js",
		              "src/common/*/*.js",
		              "src/common/*/*/*.js",
		              "src/curate/*.js",
		              "src/filter/*.js",
		              "src/header/*.js",
		              "src/login/*.js",
		              "src/loginInjector/*.js",
		              "src/manage/*.js",
		              "src/modalConfirm/*.js",
		              "src/project/*.js",
                      "src/report/*.js",
		              "src/select/*.js",
		              "src/stateLocation/*.js",
		              "src/title/*.js"
		              ],
		        dest: "dist/<%= pkg.name %>.concat.js"
		    },
		    css: {
		        src: [
		        	  "node_modules/angular-ui-router-uib-modal/sample/css/styles.css",
		              "node_modules/bootstrap/dist/css/bootstrap.min.css",
		              "node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css",
		              "node_modules/datatables/media/css/jquery.dataTables.min.css",
		              "node_modules/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css",
		              "src/*.css",
		              "src/attributes/*.css",
		              "src/comment/*.css",
		              "src/common/*/*.css",
		              "src/curate/*.css",
		              "src/filter/*.css",
		              "src/header/*.css",
		              "src/login/*.css",
		              "src/manage/*.css",
		              "src/modalConfirm/*.css",
		              "src/project/*.css",
		              "src/report/*.css",
		              "src/select/*.css",
		              "src/stateLocation/*.css",
		              "src/title/*.css"
		              ],
		        dest: "dist/<%= pkg.name %>.concat.css"
		    }
		},
		ngAnnotate: {
		    options: {
		        add: true,
		        remove: true,
		        singleQuotes: true
		    },
		    ppt: {
                files: {
                    'dist/<%= pkg.name %>.annotated.js':
                        ['<%= concat.javascript.dest %>']
                }
		    }
		},
		uglify: {
		    javascript: {
		        options: {
		            banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
		            //mangle: false
		        },
		        files: {
		            "dist/<%= pkg.name %>.min.js":
		                ['dist/<%= pkg.name %>.annotated.js']
		        }
		    }
		},
		cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    "dist/<%= pkg.name %>.min.css": [
  		        	    "node_modules/angular-ui-router-uib-modal/sample/css/styles.css",
		                "node_modules/bootstrap/dist/css/bootstrap.min.css",
		                "node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css",
		                "node_modules/datatables/media/css/jquery.dataTables.min.css",
		                "node_modules/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css",
                        "src/*.css",
                        "src/attributes/*.css",
                        "src/comment/*.css",
                        "src/curate/*.css",
                        "src/filter/*.css",
                        "src/header/*.css",
                        "src/login/*.css",
                        "src/manage/*.css",
                        "src/modalConfirm/*.css",
                        "src/project/*.css",
                        "src/report/*.css",
                        "src/select/*.css",
                        "src/stateLocation/*.css",
                        "src/title/*.css"
                    ]
                }
            }
		},
		ngtemplates: {
		  app: {
		    cwd: "src/",
		    src: [
                  "attributes/**.html",
                  "common/*/**.html",
                  "src/comment/**.html",
                  "src/curate/**.html",
                  "src/filter/**.html",
                  "src/header/**.html",
                  "src/login/**.html",
                  "src/manage/**.html",
                  "src/modalConfirm/**.html",
                  "src/project/**.html",
                  "src/report/**.html",
                  "src/select/**.html",
                  "src/stateLocation/**.html",
                  "src/title/**.html"
		          ],
		    dest: "dist/ppt.templates.js",
		    options: {
		      htmlmin: {
		        collapseBooleanAttributes:      true,
		        collapseWhitespace:             true,
		        removeAttributeQuotes:          true,
		        removeComments:                 true, // Only if you don't use comment directives! 
		        removeEmptyAttributes:          true,
		        removeRedundantAttributes:      true,
		        removeScriptTypeAttributes:     true,
		        removeStyleLinkTypeAttributes:  true
		      }
		    }
		  }
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-angular-templates');

	grunt.registerTask('default', ["concat", "ngAnnotate", "uglify", "cssmin", "ngtemplates"]);
};
