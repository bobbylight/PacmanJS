var StringReplacePlugin = require('string-replace-webpack-plugin');

module.exports = [
    {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
    },
    {
        test: /\.css$/,
        loader: "style-loader!css-loader"
    },
    {
        // This is the voodoo to have webpack convert "import 'index.html'; into an actual HTML file (!!)
        test: /index.html$/,
        loaders: [ 'file-loader?name=[name].[ext]',
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
];
