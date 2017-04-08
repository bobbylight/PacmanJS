var loaders = require('./loaders');
var path = require('path');
var webpack = require('webpack');

// loaders.push({
//     test: /^((?!\.spec\.ts).)*.ts$/,
//     exclude: /node_modules/,
//     loader: 'istanbul-instrumenter-loader'
// });

module.exports = {
    entry: [ path.resolve('./src/app/pacman.ts') ],
    output: {
        filename: 'build.js',
        path: 'tmp'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        modules: ['src/app', 'src/html', 'src/css', 'node_modules']

    },
    devtool: "source-map-inline",
    plugins: [
        new webpack.ProvidePlugin({
        })
    ],
    module: {
        loaders: loaders
    }
};
