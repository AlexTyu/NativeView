module.exports = function (grunt) {

    grunt.initConfig({
        less: {
            development: {
                files: {
                    'static/styles.css': [
                        'src/less/style.less'
                    ]
                }
            }
        },
        watch: {
            styles: {
                files  : ['src/less/**/*.less', 'src/js/**/*.js'],
                tasks  : ['less', 'uglify'],
                options: {
                    nospawn: true,
                    compress: true
                }
            },
            everything: {
                files: ['src/**/*.*'],
                options: {
                    livereload: {
                        host: 'localhost',
                        port: 35729,
                    }
                }
            }
        },
        uglify: {
            development: {
                files: {
                    'static/scripts.min.js': [
                        'node_modules/moment/min/moment.min.js',
                        'node_modules/angular/angular.js',
                        'node_modules/angular-cookies/angular-cookies.min.js',
                        'node_modules/angular-route/angular-route.min.js',
                        'node_modules/angular-animate/angular-animate.min.js',
                        'node_modules/angular-upload/angular-upload.min.js'
                    ]
                }
            },
            options: {
                nospawn: true,
                mangle: false,
                report: 'min',
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('run', ['watch']);

};
