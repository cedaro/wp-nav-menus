const webpack = require( 'webpack' );
const WebpackTapeRun = require( 'webpack-tape-run' );

const config = {
	mode: 'none',
	node: {
		fs: 'empty',
	},
	entry: './test',
	output: {
		path: __dirname + '/tmp',
		filename: 'test.js',
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				use: 'raw-loader'
			}
		]
	},
	resolve: {
		modules: [ 'node_modules' ],
		extensions: [ '*', '.js' ]
	},
	plugins: [
		new WebpackTapeRun(),
	],
};

module.exports = config;
