module.exports = [
    {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
            { loader: 'ts-loader' },
            {
                loader: 'tslint-loader',
                options: {
                    typeCheck: true
                }
            }
        ]
    },
    {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
    },
    {
        test: /index.html$/,
        loader: 'raw-loader'
    }
];
