module.exports = function (grunt) {
    grunt.registerTask('release', function(target){
        var bump = target ? "bump" : "bump:" + target

        grunt.task.run([
            'prod',
            bump
        ])
    });
};
