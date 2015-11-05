/*!
 * Price Recommendation Service
 * ----------------------------
 * Gruntfile.
 */

module.exports = function(grunt) {

    grunt.initConfig({

        jshint: {
            files: [
                'Gruntfile.js'
            ],
            options: {
                // options here to override JSHint defaults
                "bitwise": true,
                "curly": true,
                "eqeqeq": true,
                "forin": true,
                "immed": true,
                "loopfunc": true,
                "newcap": true,
                "noarg": true,
                "noempty": true,
                "nonew": true,
                "onecase": true,
                "trailing": true,
                "white": false,
                "strict": false,
                "sub": true,
                "node": true,
                "undef": true,
                "unused": true
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build', ['jshint']);

    // Default task.
    grunt.registerTask('default', ['build']);

};
