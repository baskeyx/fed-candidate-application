module.exports = function(grunt) {
    'use strict';

    // load grunt tasks
    require('load-grunt-tasks')(grunt);

    // project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            options: {
                style: 'compressed',
                precision: 5
            },
            dist: {
                files: {
                    'public/css/main.css': 'src/scss/main.scss'
                }
            }
        },

        clean: {
            public: ['public/**']
        },

        copy: {
            app: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['index.html'],
                        dest: 'public'
                    },
                    {
                        expand: true,
                        cwd: 'src/js',
                        src: ['**'],
                        dest: 'public/js'
                    },
                    {
                        expand: false,
                        src: ['node_modules/mustache/mustache.min.js'],
                        dest: 'public/js/lib/mustache.min.js'
                    },
                    {
                        expand: false,
                        src: ['node_modules/requirejs/require.js'],
                        dest: 'public/js/lib/require.js'
                    },
                    {
                        expand: false,
                        src: ['node_modules/normalize.css/normalize.css'],
                        dest: 'src/scss/partials/_normalize.scss'
                    }
                ]
            }
        },

        watch: {
            javascripts: {
                files: [
                    'Gruntfile.js',
                    'src/js/**/*.js'
                ],
                tasks: [
                    'copy'
                ]
            },
            sass: {
                files: [
                    'src/scss/**/*.scss'
                ],
                tasks: [
                    'sass'
                ]
            },
            html: {
                files: [
                    'src/**/*.html'
                ],
                tasks: [
                    'copy'
                ]
            }
        }
    });

    // Task definitions:
    grunt.registerTask('default', [
        'clean',
        'copy',
        'build'
    ]);

    grunt.registerTask('dev', [
        'clean',
        'copy',
        'build',
        'watch'
    ]);

    grunt.registerTask('build', [
        'sass'
    ]);
};
