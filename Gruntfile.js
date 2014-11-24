module.exports = function(grunt) {
    'use strict';

    var configBridge = grunt.file.readJSON('./grunt/configBridge.json', {
        encoding: 'utf8'
    });

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // banner: '/*!\n' +
        //     ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
        //     ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        //     ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
        //     ' */\n',
        // Task configuration.
        clean: {
            dist: 'dist'
        },
        jshint: {
            options: {
                jshintrc: 'js/.jshintrc'
            },
            grunt: {
              options: {
                jshintrc: 'grunt/.jshintrc'
              },
              src: ['Gruntfile.js', 'grunt/*.js']
            },
            core: {
                src: 'js/*.js'
            }
        },
        jscs: {
            options: {
                config: 'js/.jscsrc'
            },
            grunt: {
                src: '<%= jshint.grunt.src %>'
            },
            core: {
                src: '<%= jshint.core.src %>'
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                },
                preserveComments: 'some'
            },
            core: {
                src: '<%= concat.bootstrap.dest %>',
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },
        autoprefixer: {
            options: {
                browsers: configBridge.config.autoprefixerBrowsers
            },
            core: {
                options: {
                    map: true
                },
                src: 'dist/css/<%= pkg.name %>.css'
            }
        },

        cssmin: {
          options: {
            compatibility: 'ie8',
            keepSpecialComments: '*',
            noAdvanced: true
          },
          minifyCore: {
            src: 'dist/css/<%= pkg.name %>.css',
            dest: 'dist/css/<%= pkg.name %>.min.css'
          }
        }
        // usebanner: {
        //   options: {
        //     position: 'top',
        //     banner: '<%= banner %>'
        //   },
        //   files: {
        //     src: 'dist/*'
        //   }
        // },

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['clean', 'jshint', 'jscs','uglify', 'autoprefixer', 'cssmin']);


};
