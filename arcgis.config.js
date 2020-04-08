const ArcGISPlugin = require("@arcgis/webpack-plugin");
/**
 * Configuration items defined here will be appended to the end of the existing webpack config defined by the Angular CLI.
 */
module.exports = {
  plugins: [
    new ArcGISPlugin({
      options: {
        locales: ['en']
      },
      features: {
        "3d": false
      }
    })

  ],
  node: {
    process: false,
    global: false,
    fs: "empty",
  },
  optimization: {
    namedChunks: true,
    namedModules: true
  }
};
// const ArcGISPlugin = require("@arcgis/webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const HtmlWebPackPlugin = require("html-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const TerserPlugin = require("terser-webpack-plugin");

// const path = require("path");

// module.exports = {
//   entry: {
//     index: ["./src/styles.scss", "./src/main.ts"]
//   },
//   output: {
//     filename: "[name].[chunkhash].js",
//     publicPath: "",

//   },
//   optimization: {
//     minimizer: [
//       new TerserPlugin({
//         cache: true,
//         parallel: true,
//         sourceMap: false,

//         terserOptions: {
//           mangle: true,
//           output: {
//             comments: false
//           }
//         }
//       })
//     ],
//     namedChunks: true,
//     // minimize: true, splitChunks: { minChunks: Infinity, chunks: 'all' },
//     namedModules: true
//   },
//   plugins: [
//     new HtmlWebPackPlugin({
//       template: './src/index.html',
//       filename: './index.html',
//       chunksSortMode: "none"
//     }),
//     new MiniCssExtractPlugin({
//       filename: "[name].css",
//       chunkFilename: "[id].css"
//     }),
//     new ArcGISPlugin({
//       options: {
//         locales: ['en']
//       },
//       features: {
//         "3d": false
//       }
//     }),
//     new CleanWebpackPlugin()

//   ],
//   node: {
//     process: false,
//     global: false,
//     fs: "empty"
//   }
// };
