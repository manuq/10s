module.exports = function(grunt) {

    grunt.initConfig({
        typescript: {
            base: {
                src: ['src/**/*.ts'],
                dest: '10s.js',
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    base_path: 'src',
                    sourcemap: false,
                    fullSourceMapPath: false,
                    declaration: false,
                    comments: true,
                }
            }
        },

        watch: {
            scripts: {
                files: ['src/**/*.ts'],
                tasks: ['typescript'],
            }
        },
    });

    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['typescript']);
};
