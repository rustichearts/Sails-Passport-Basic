module.exports = function (grunt) {
	grunt.registerTask('release', function(target){
     var bump = target ? "bump-only" : "bump:" + target

     grunt.runTask([
         'prod',
         'bump'
     ])
    });
};
