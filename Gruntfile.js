'use strict';

var testacular = require('testacular');

module.exports = function(grunt) {

	// Project configuration.
	grunt
			.initConfig({
				distdir : 'dist',
				srcdir : 'src/js',
				targetdir : 'target',
				pkg : grunt.file.readJSON('package.json'),
                banner : '/**\n' + ' * <%= pkg.description %>\n'
                    + ' * @version v<%= pkg.version %> - '
                    + '<%= grunt.template.today("yyyy-mm-dd") %>\n'
                    + ' * @link <%= pkg.homepage %>\n' +
                    ' * @license MIT License, http://www.opensource.org/licenses/MIT\n'
                    + ' */\n' ,
				src : {
					js : [ 'src/**/*.js' ],
				},
				clean : [ '<%= targetdir %>/*', '<%= distdir %>/*' ],
				copyRootdirs : {
					dest : '<%= targetdir %>',
					rootdirs : [ 'vendor', 'config', 'src', 'test' ],
					noProcess : [ 'vendor' ]
				},
				uglify : {
					options : {
						mangle : false,
						banner : '<%= banner %>'
					},
					dist : {
						src : '<%= srcdir %>/<%= pkg.name %>.js',
						dest : '<%= srcdir %>/<%= pkg.name %>.min.js'
					}
				},
                concat : {
					options : {
						banner : '<%= banner %>'
					},
					dist : {
                        src : '<%= targetdir %>/<%= srcdir %>/<%= pkg.name %>.js',
                        dest : '<%= distdir %>/<%= pkg.name %>-<%= pkg.version %>.js'
					}
				},
				watch : {
					files : [ '<%= src.js %>', '<%= test.unit %>' ],
					tasks : 'build'
				},
				test : {
					unit : [ 'test/unit/**/*Spec.js' ],
					e2e : [ 'test/e2e/**/*scenarios.js' ],
					buildDir : '<%= targetdir %>'
				},
				dist : {
					file2 : {
						src : '<%= targetdir %>/<%= srcdir %>/<%= pkg.name %>.min.js',
						dest : '<%= distdir %>/<%= pkg.name %>-<%= pkg.version %>.min.js'
					}
				}
			});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadTasks('build');

	grunt.registerMultiTask('dist', 'Copy files to distdir', function() {
		grunt.log.write('Dist file copy from "' + this.data.src + '" to "'
				+ this.data.dest + '"');
		grunt.file.copy(this.data.src, this.data.dest);
		grunt.log.ok();
	});

	// Default task(s).
	grunt.registerTask('default', [ 'build' ]);

	grunt.registerTask('build', [ 'clean', 'uglify', 'copyRootdirs',
			'testBuild', 'testBuildMin', 'e2e', 'concat', 'dist' ]);

	grunt.registerTask('release', [ 'checkForChangedFiles', 'build', 'tag',
			'bump' ]);
};