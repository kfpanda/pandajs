'use strict';

module.exports = function(grunt) {
	
	var pkg = grunt.file.readJSON('package.json');
	var template = require('grunt-cmd-transport').template.init(grunt);

	grunt.initConfig({
		// Metadata.
		pkg: pkg,
		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
		  '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
		  '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
		  '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
		  ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		
		concat: {
		  	register:{
				options: {
				  pkg: pkg,
				  separator: ';',
				  paths: ['assets']
				},
				files: {
					'dist/protocol.js' : ['src/urlparam.js', 'src/protocol.js'],
					'dist/plugins/ajaxprotocol.js': 'src/plugins/ajaxprotocol.js',
					'dist/plugins/clientprotocol.js': 'src/plugins/clientprotocol.js',
					'dist/plugins/imclientprotocol.js': 'src/plugins/imclientprotocol.js',
					'dist/plugins/sammycache.js': 'src/plugins/sammycache.js',
					'dist/plugins/sqlite.js': 'src/plugins/sqlite.js',
					'dist/plugins/wsprotocol.js': 'src/plugins/wsprotocol.js'
				}
			}
		},
		
		uglify: {
		  register: {
			  options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
							'<%= grunt.template.today("yyyy-mm-dd") %> */',
			  },
			  files: [{
			  	expand: true,
				cwd: 'dist/',
				src: '**/*.js',
				dest: 'dist/',
				ext: '-min.js'
			}]
		  }
		},
		
		cssmin: {
			options: { 
				keepSpecialComments: 0
			},
			css: {
				files: {} 
			}
		},
		
		copy: {
		  dist: {
			files: [{ 
				expand: true, 
				cwd: '.build/src',
				src: ['**/*-debug.js'], 
				dest: 'dist/'
			}]
		  },
		  main: {
			files: [
			  { expand: true, cwd: 'dist/',
				src: ['**'], 
				dest: 'assets/<%= pkg.family %>/<%= pkg.name %>/<%= pkg.version %>/'}, // includes files in path
			]
		  }
		},

		combo: {
			options: {
				sourceMap: {
					//sourceRoot: '/src/'
				}
			},
			build: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: '**/*.js',
					dest: 'dist/combo/',
					ext: '.combo.js'
				}]
			}
		},
		
		clean: {
			tests: ['dist', 'assets/<%= pkg.family %>/<%= pkg.name %>/<%= pkg.version %>/'],
			build: ['.build']
		},
		nodeunit: {
			files: ['tests/**/*_test.js']
		},
		jshint: {
		  options: {
			jshintrc: '.jshintrc'
		  },
		  gruntfile: {
			src: 'Gruntfile.js'
		  },
		  lib: {
			options: {
			  jshintrc: 'src/.jshintrc'
			},
			src: ['src/**/*.js']
		  },
		  test: {
			src: ['test/**/*.js']
		  },
		},
		watch: {
		  gruntfile: {
			files: '<%= jshint.gruntfile.src %>',
			tasks: ['jshint:gruntfile']
		  },
		  lib: {
			files: '<%= jshint.lib.src %>',
			tasks: ['jshint:lib', 'nodeunit']
		  },
		  test: {
			files: '<%= jshint.test.src %>',
			tasks: ['jshint:test', 'nodeunit']
		  },
		},
	});
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	
	grunt.registerTask('test', ['nodeunit']);

	grunt.registerTask('build', ['clean:tests', 'concat', 'uglify', 'copy', 'clean:build']);

	grunt.registerTask('combobuild', ['combo']);
	
};
