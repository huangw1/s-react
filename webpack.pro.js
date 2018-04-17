/**
 * Created by huangw1 on 2018/4/16.
 */

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const base = require('./webpack.base.js')
const merge = require('webpack-merge')

module.exports = merge(base, {
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				uglifyOptions: {
					compress: false,
					ecma: 6,
					mangle: true
				},
				sourceMap: true
			})
		]
	}
})
