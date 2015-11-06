/*!
 * Price Recommendation Service
 * ----------------------------
 * Gruntfile.
 */

module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: true
            },
            files: [
                'Gruntfile.js',
                'server/*.js',
                'server/lib/**/*.js',
                'server/app/**/*.js',
                'server/test/**/*.js'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build', ['jshint']);

    // Default task.
    grunt.registerTask('default', ['build']);

};
