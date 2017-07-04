var path = require('path')
var os = require('os');
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
var entries = require('./webpack.entries');
var config = {
    context: path.join(__dirname, './src/main/app'),
    output: {
        path: path.join(__dirname, 'src/main/webapp'),
        // publicPath: "/bundles/",
        filename: "[name].bundle.js",
        chunkFilename: "[id].chunk.js"
    },
    module: {
        rules: [{
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: (loader) => [
                                require('postcss-import')({ root: loader.resourcePath }),
                                require('autoprefixer')(),
                                require('postcss-filter-gradient')()
                            ]
                        }
                    },
                    { loader: 'less-loader' }
                ]
            }, { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.tsx?$/, loaders: ["ts-loader"], exclude: /(node_modules|bower_components)/ },
            { test: /\.json$/, loaders: ["json"], exclude: /(node_modules|bower_components)/ },
            //如果不超过30000/1024kb,那么就直接采用dataUrl的形式,超过则返回链接,图片会复制到dist目录下
            { test: /\.(png|jpg|jpeg|gif)$/, loader: "url-loader?limit=30000" },
            { test: /\.(svg|ttf|eot|svg|woff(\(?2\)?)?)(\?[a-zA-Z_0-9.=&]*)?(#[a-zA-Z_0-9.=&]*)?$/, loader: "file-loader" },
            { test: /\.hbs$/, loader: "handlebars-loader" }
        ]
    },

    resolve: {
        extensions: [".webpack.js", ".web.js", ".js", ".ts", ".jsx", ".tsx"]
    },
    externals: {},
    resolveLoader: {
        // root: path.join(__dirname, 'node_modules')
        moduleExtensions: ['-loader']
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        // new webpack.optimize.CommonsChunkPlugin({ name: "commons", filename: "[name].bundle.js" }),
        /**
         * 压缩代码
         */
        new ParallelUglifyPlugin({
            // cacheDir: '.cache/',
            workers: os.cpus().length,
            uglifyJS: {
                output: {
                    comments: false
                }
                // ,
                // compress: {
                //     // warnings: false
                // }
            }
        })
    ]

    //devServer 配置在webpack.dev.server.js 中
};
config.entry = entries.entry;
config.plugins = config.plugins.concat(entries.plugins);
module.exports = config;