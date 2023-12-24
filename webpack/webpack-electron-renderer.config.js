const loaders = require('./loaders');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devBuild = process.env.NODE_ENV === 'dev';
console.log(`Starting electron renderer build with NODE_ENV: ${process.env.NODE_ENV}`);

module.exports = [
    {
        target: 'electron-renderer',
        entry: './src/pacman.ts',
        output: {
            path: path.resolve('./build/electron/'),
            filename: 'pacman.js'
        },
        resolve: {
            extensions: ['.js', '.ts', '.tsx'],
            modules: ['src/app', 'src/html', 'src/css', 'node_modules']
        },
        mode: devBuild ? 'development' : 'production',
        devtool: devBuild ? 'cheap-module-source-map' : undefined,
        node: {
            __dirname: false,
            __filename: false
        },
        plugins: [
            // Simply copies the files over
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'src/res', to: 'res' }
                ]
            }),
            new HtmlWebpackPlugin({
                template: 'src/html/electron-index.html',
                inject: 'body',
                hash: true
            }),
        ],
        module: {
            rules: loaders
        }
    }
];
