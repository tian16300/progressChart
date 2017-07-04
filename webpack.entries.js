var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        main: ['bootstrap-loader', './index.ts']
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: "commons", filename: "[name].bundle.js" }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/main/app/index.html'),
            title: '组件列表',
            filename: 'index.html',
            chunks: ['commons', 'main']
        })
    ]
};