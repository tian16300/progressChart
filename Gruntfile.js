module.exports = function(grunt) {
    var path = require('path');
    var webpackDevConfig = require('./webpack.dev.config');
    var webpackConfig = require('./webpack.config');
    // 构建任务配置
    grunt.initConfig({
        //读取package.json的内容，形成个json数据
        pkg: grunt.file.readJSON('package.json'),
        webpack: {
            dev: webpackDevConfig,
            deploy: webpackConfig
        },
        clean: {
            build: [path.resolve(__dirname, 'src/main/webapp')]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-webpack');
    // 默认执行的任务
    grunt.registerTask('default', ['clean:build', 'webpack:deploy']);
};