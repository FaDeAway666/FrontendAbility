const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: './main.js',
    target: 'web',
    devServer: {
        host: 'localhost',
        port: 3030,
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ]
}