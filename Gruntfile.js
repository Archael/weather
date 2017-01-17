module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            build: {
                files: {
                    'js/app.min.js': ['resources/js/**/*.js'],
                    // 'css/app.min.css' : ['resources/sass/app.scss']  
                }
            }
        },
        sass: {
            dist: {
                files: {
                    'css/app.min.css' : 'resources/sass/app.scss'
                }
            }
        },
        watch: {
            scripts: {
                files: ['resources/js/**/*.js'],
                tasks: ['uglify']
            },

            css: {
                files: ['resources/sass/**/*.scss'],
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.registerTask('default', ['uglify', 'sass']);
    grunt.registerTask('spy', ['watch']);
};
