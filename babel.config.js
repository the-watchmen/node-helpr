module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					node: 'current',
					browsers: ['last 3 versions']
				}
			}
		]
	]
}
