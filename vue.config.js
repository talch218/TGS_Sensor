const path =require('path');

module.exports = {
	publicPath: './',
	outputDir: path.resolve(__dirname, 'docs'),
	pages: {
		index: {
			entry: 'src/main.js',
			title: 'TGS Sensor',
		}
	},
};
