var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var StringReplacePlugin = require('string-replace-webpack-plugin');

var dir_ts = path.resolve(__dirname, 'src/app');

module.exports = [
    {
        entry: [
            path.resolve(dir_ts, 'pacman.ts')
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
            loaders: [
                {
                    test: /\.tsx?$/,
                    //exclude: /(node_modules|bower_components)/,
                    loader: 'ts-loader'
                },
                {
                    test: /\.css$/,
                    loader: "style!css"
                },
                {
                    // This is the voodoo to have webpack convert "import 'index.html'; into an actual HTML file (!!)
                    test: /index.html$/,
                    loaders: [ 'file?name=[name].[ext]',
                        StringReplacePlugin.replace({
                            replacements: [{
                                pattern: /<%=build.date%>/,
                                replacement: function() {
                                    return new Date().toLocaleDateString();
                                }
                            }]
                        })
                    ]
                }
            ]
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
