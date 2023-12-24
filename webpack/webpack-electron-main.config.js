const loaders = require('./loaders');
const path = require('path');

const devBuild = process.env.NODE_ENV === 'dev';
console.log(`Starting electron main build with NODE_ENV: ${process.env.NODE_ENV}`);

module.exports = [
    {
        target: 'electron-main',
        entry: './src/electron-main.ts',
        output: {
            path: path.resolve('./build/electron/'),
            filename: 'electron-bundle.js'
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
        ],
        module: {
            rules: loaders
        }
    }
];
