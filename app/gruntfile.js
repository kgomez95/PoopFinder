module.exports = function (grunt) {
    grunt.initConfig({
        cssmin: {
            poopFinder: {
                src: "lib/poop-finder/css/*.css",  // source files mask
                dest: "lib/poop-finder/css/",    // destination folder
                expand: true,    // allow dynamic building
                flatten: true,   // remove all unnecessary nesting
                ext: ".min.css"   // replace .js to .min.js
            }
        },
        uglify: {
            poopFinder: {
                src: "lib/poop-finder/js/*.js",  // source files mask
                dest: "lib/poop-finder/js/",    // destination folder
                expand: true,    // allow dynamic building
                flatten: true,   // remove all unnecessary nesting
                ext: ".min.js"   // replace .js to .min.js
            }
        }
    });

    // Load plugins.
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");

    // Register at least this one task.
    grunt.registerTask("default", ["uglify", "cssmin"]);
};
