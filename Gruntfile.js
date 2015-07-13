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
			hexin: {
				src: ['src/hexin.js'],
				dest: 'dist/hexin-debug.js',
			},
			util: {
				src: ['src/util.js'],
				dest: 'dist/util-debug.js',
			}
		},
		
		uglify: {
		  register: {
			  options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
							'<%= grunt.template.today("yyyy-mm-dd") %> */',
			  },
			  files: {
				'dist/hexin.js': ['dist/hexin-debug.js'],
				'dist/util.js': ['dist/util-debug.js'],
			  }
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
		
		clean: {
			tests: ['dist', 'assets/<%= pkg.family %>/<%= pkg.name %>/<%= pkg.version %>/'],
		},
		nodeunit: {
			files: ['test/**/*_test.js']
		},
		mochacli: {
			options: {
				//require: ['should'],
				reporter: 'nyan',
				bail: true
			},
			all: ['tests/*_test.js']
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
	grunt.loadNpmTasks('grunt-mocha-cli');
	
	//'transport', 
	grunt.registerTask('build', ['clean', 'concat', 'uglify', 'copy']);
	
	grunt.registerTask('test', ['mochacli']);
	
};
