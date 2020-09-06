const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'main.js',
	},
	plugins: [
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 3000,
			server: { baseDir: ['public'] }
		})
	],
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
		],
	},
	watch: true
};

