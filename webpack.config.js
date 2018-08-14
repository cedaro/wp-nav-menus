const webpack = require( 'webpack' );
const pkg = require( './package.json' );

const config = {
	entry: {
		index: './index.js',
	},
	output: {
		path: __dirname + '/dist',
		filename: 'wp-nav-menus.js',
		library: 'cedaroNavMenu',
		libraryTarget: 'this',
	},
	optimization: {
		minimize: false,
	},
	externals: {
		jquery: 'jQuery',
		wp: 'wp',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
		],
	},
	plugins: [
		new webpack.BannerPlugin( {
			banner: `/**
 * wp-nav-menus.js
 * https://github.com/cedaro/wp-nav-menus
 *
 * @copyright Copyright (c) 2016 Cedaro, LLC
 * @license ${ pkg.license }
 * @version ${ pkg.version }
 */`,
			raw: true
		} ),
	],
};

module.exports = config;
