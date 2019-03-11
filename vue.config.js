const path = require('path')
module.exports = {
    outputDir: path.resolve(__dirname, '../apim-be/public'),
    devServer: {
        // 设置代理转发
        proxy: {
            '/user': {
                target: 'http://localhost:3001/'
            },
        }
    }
}
