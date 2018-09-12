'use strict';

const webpack = require('webpack');

module.exports = {
    mode: 'production',

    'context': __dirname + '/client',
//    'cache': true,
    'output': {
        'filename': '[name].js',
        'path': __dirname + '/public/javascripts',
    },
    'devServer': {
        'publicPath': "/javascripts",
        port:8080
    },
    'watchOptions': {
        aggregateTimeout: 300,
        poll:1000
    },
    'entry': {
        'main': [__dirname + '/client/main.js'],
    },
    'module': {
        'rules': [
            {
                'test': /\.json$/,
                'loader': 'json-loader',
            },
            {
                'test': /\.js?$/,
                'exclude': /(node_modules|bower_components|\/vendor)/,
                'loader': 'babel-loader', // 'babel-loader' is also a legal name to reference
                // 'query': {
                //     'presets': ['es2015', 'react'],
                // },
            },
            {
                'test': /\.css$/,
                'loader': 'style-loader!css-loader',
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'mirro': {
                'static': {
                    'host': JSON.stringify(process.env.NODE_ENV === "development" ? 'http://127.0.0.1:8080' : 'https://127.0.0.1'),
                }
            },

        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.css'],
    },
};