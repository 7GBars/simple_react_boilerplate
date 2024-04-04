const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].[contenthash].js',
    },
    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules',
        ],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: ["ts-loader"],
            },
            {
                enforce: "pre",
                test: /\.js$/,
                use: ["source-map-loader"],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html"),
        }),
        new BundleAnalyzerPlugin({
            analyzerPort: 8889
        })
    ],
    optimization: {
        runtimeChunk: 'single',
        moduleIds: 'deterministic',

        splitChunks: {
            chunks: 'all',

            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        return `npm.${packageName.replace('@', '')}`;
                    },
                },
            },
        },
    },
}