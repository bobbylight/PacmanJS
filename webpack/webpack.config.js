const loaders = require('./loaders');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const webpack = require('webpack');

const devBuild = process.env.NODE_ENV === 'dev';

// Loaders specific to compiling
loaders.push({
    enforce: 'pre',
    test: /\.tsx?$/,
    loader: 'tslint-loader',
    exclude: /node_modules/,
    options: {
        typeCheck: true
    }
});

module.exports = [
    {
        entry: [
            path.resolve('./src/app/pacman.ts')
        ],
        output: {
            path: path.resolve('./build/web/'),
            filename: '[name].js',
            publicPath: '/'
        },
        resolve: {
            extensions: ['.js', '.ts'],
            modules: ['src/app', 'src/html', 'src/css', 'node_modules']
        },
        module: {
            loaders: loaders
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
                }
            }),
            // Simply copies the files over
            new CopyWebpackPlugin([
                { from: 'src/res', to: 'res' }
            ]),
            new StringReplacePlugin()
        ],
        // Create sourcemaps for the bundle
        devtool: devBuild ? 'source-map' : undefined,
        devServer: {
            contentBase: './build/web'
        }
    }
];
