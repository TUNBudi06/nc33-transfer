const webpackConfig = require('@nextcloud/webpack-vue-config')
const webpackRules = require('@nextcloud/webpack-vue-config/rules')
const TerserPlugin = require('terser-webpack-plugin')

// Override SVG rule to load as raw source string (needed for NcIconSvgWrapper)
webpackRules.RULE_ASSETS = {
	test: /\.(png|jpe?g|gif|woff2?|eot|ttf)$/,
	type: 'asset/inline',
}

webpackRules.RULE_SVGS = {
	test: /\.svg$/,
	type: 'asset/source',
}

webpackConfig.module.rules = Object.values(webpackRules)

// Use parallel: false to prevent TerserPlugin worker threads from hanging
// on low-resource servers (e.g. Debian VMs)
webpackConfig.optimization = {
	...webpackConfig.optimization,
	minimizer: [
		new TerserPlugin({
			parallel: false,
		}),
	],
}

// Silence size warnings — Nextcloud handles chunking server-side
webpackConfig.performance = {
	hints: false,
}

module.exports = webpackConfig
