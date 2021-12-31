const loaders = require('./loaders');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const devBuild = process.env.NODE_ENV === 'dev';
console.log(`Starting webpack build with NODE_ENV: ${process.env.NODE_ENV}`);

module.exports = [
    {
        target: 'electron-main',
        entry: {
            'electron-main': path.resolve('./src/app/electron-main.ts'),
            app: path.resolve('./src/app/pacman.ts')
        },
        output: {
            path: path.resolve('./build/electron/'),
            filename: '[name].js'
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
                    {from: 'src/res', to: 'res'},
                    { from: 'desktop-index.html', context: 'src/html' },
                ]
            }),
        ],
        module: {
            rules: loaders
        }
    }
];
