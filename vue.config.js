const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
    outputDir: path.resolve(__dirname, '../apim-be/public'),
    devServer: {
        // 设置代理转发
        proxy: {
            '/api/*': {
                target: 'http://localhost:3001'
            },
            '/mock/*': {
                target: 'http://localhost:3001'
            }
        }
    },
    configureWebpack: {
        plugins: [
            new MonacoWebpackPlugin({
                languages: ['javascript', 'json']
            })
        ]
    }
}
