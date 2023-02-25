const WebpackIconfontPluginNodejs = require('webpack-iconfont-plugin-nodejs')
const path = require('path')
const dir = 'src/assets'
const name = 'icon'
const options = {
  fontName: name,
  cssPrefix: name,
  svgs: path.join(dir, 'svgs/*.svg'),
  fontsOutput: path.join(dir, 'icon/'),
  cssOutput: path.join(dir, 'icon/' + name + '.css'),
  jsOutput: path.join(dir, 'icon/' + name + '.js'),
  htmlOutput: false,
  formats: ['ttf', 'woff']
}
new WebpackIconfontPluginNodejs(options).build()