const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].[contenthash].js',
        publicPath: '/'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 3000,
    },
    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx", ".css", ".scss"],
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules',
        ],
        alias: {
            '@commonStyles': path.resolve(__dirname, 'node_modules/lib2_geo_bars/dist/styles/common.css'),
        }
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
        }),

        new CopyPlugin({
            patterns: [
                { from: 'node_modules/lib2_geo_bars/dist/assets', to: path.join(__dirname, 'public/assets') }
            ],
        }),
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