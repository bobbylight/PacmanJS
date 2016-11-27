var loaders = require('./loaders');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var StringReplacePlugin = require('string-replace-webpack-plugin');

module.exports = [
    {
        entry: [
            path.resolve('./src/app/pacman.ts')
        ],
        output: {
            path: './build/web/',
            filename: 'bundle.js',
            // libraryTarget: 'var',
            // library: 'EntryPoint',
            publicPath: '/'
        },
        resolve: {
            extensions: ['', '.js', '.ts'],
            modulesDirectories: ['src/app', 'src/html', 'src/css', 'node_modules']
        },
        module: {
            preLoaders: [
                {
                    test: /\.ts$/,
                    loader: 'tslint-loader'
                }
            ],
            loaders: loaders
        },
        plugins: [
            // Simply copies the files over
            new CopyWebpackPlugin([
                { from: 'src/res', to: 'res' }
            ]),
            new StringReplacePlugin()
        ],
        // Create Sourcemaps for the bundle
        devtool: 'source-map',
        devServer: {
            contentBase: './build/web'
        }
    }
];
