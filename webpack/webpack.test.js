var loaders = require('./loaders');
var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [ './src/app/pacman.ts' ],
    output: {
        filename: 'build.js',
        path: 'tmp'
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js', '.json']
    },
    resolveLoader: {
        modulesDirectories: ["node_modules"]
    },
    devtool: "source-map-inline",
    plugins: [
        new webpack.ProvidePlugin({
        })
    ],
    module: {
        loaders: loaders,
        postLoaders: [
            {
                test: /^((?!\.spec\.ts).)*.ts$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'istanbul-instrumenter'
            }
        ]
    }
};