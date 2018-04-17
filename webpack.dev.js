/**
 * Created by huangw1 on 2018/4/16.
 */

const webpack = require('webpack')
const base = require('./webpack.base.js')
const merge = require('webpack-merge')

module.exports = merge(base, {
	devtool: 'source-map',
	plugins: [
		new webpack.NamedModulesPlugin()
	]
})
