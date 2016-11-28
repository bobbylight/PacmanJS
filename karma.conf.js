'use strict';

var webpackConfig = require('./webpack/webpack.test.js');
webpackConfig.entry = {};

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: [ 'jasmine' ],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true,
        autoWatchBatchDelay: 300,
        files: [
            './src/app/test.ts'
            //{ pattern: 'src/**/!(*.spec)+(.ts)', included: false },
            //'src/app/**/*.spec.ts',
            //{ pattern: 'node_modules/gtp/**/*.js', included: false },
            //{ pattern: 'src/**/*.ts', included: false },
            //'test-main.js'
        ],
        preprocessors: {
            //'src/**/*.ts': [ 'typescript' ],
            ////'src/app/test.ts': [ 'webpack' ],
            //'src/app/**/*.spec.ts': [ 'webpack' ],
            //'src/**/!(*.spec)+(.js)': ['coverage']
            './src/app/test.ts': [ 'webpack' ],
            'src/**/!(*.spec)+(.js)': ['coverage']
        },

// typescriptPreprocessor: {
//     // options passed to the typescript compiler
//     options: {
//         sourceMap: false, // (optional) Generates corresponding .map file.
//         target: 'ES5', // (optional) Specify ECMAScript target version: 'ES3' (default), or 'ES5'
//         module: 'amd', // (optional) Specify module code generation: 'commonjs' or 'amd'
//         noImplicitAny: true, // (optional) Warn on expressions and declarations with an implied 'any' type.
//         noResolve: true, // (optional) Skip resolution and preprocessing.
//         removeComments: true, // (optional) Do not emit comments to output.
//         concatenateOutput: false // (optional) Concatenate and emit output to single file. By default true if module option is omited, otherwise false.
//     },
//     // transforming the filenames
//     transformPath: function(path) {
//         return path.replace(/\.ts$/, '.js');
//     }
// },
        webpackMiddleware: {
            stats: {
                chunkModules: false,
                colors: true
            }
        },
        webpack: webpackConfig,
        reporters: [
            'dots',
            'coverage'
        ],
        coverageReporter: {
            reporters: [
                {
                    dir: 'reports/coverage/',
                    subdir: '.',
                    type: 'html'
                },{
                    dir: 'reports/coverage/',
                    subdir: '.',
                    type: 'cobertura'
                }, {
                    dir: 'reports/coverage/',
                    subdir: '.',
                    type: 'json'
                }
            ]
        }
    });
};
