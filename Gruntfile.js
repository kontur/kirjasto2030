/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        '*/\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            libs: {
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/jquery.typer/src/jquery.typer.js'
                ],
                dest: 'public/assets/js/libs.js'
            },
            main: {
                src: ['src/js/*.js'],
                dest: 'public/assets/js/main.js'
            }
        },
        uglify: {
            libs: {
                src: '<%= concat.libs.dest %>',
                dest: 'public/assets/js/libs.min.js'
            },
            main: {
                options: {
                    banner: '<%= banner %>'
                },
                src: '<%= concat.main.dest %>',
                dest: 'public/assets/js/main.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            }
        },
        less: {
            main: {
                options: {},
                files: {
                    'public/assets/css/main.css': 'src/less/main.less'
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            js: {
                files: 'src/js/*.js',
                tasks: ['jshint:main', 'concat:main', 'uglify:main']
            },
            css: {
                files: 'src/less/*.less',
                tasks: ['less']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    // Default task.
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('libs', ['concat:libs', 'uglify:libs']);

};
