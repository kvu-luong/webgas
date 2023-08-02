const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const nodeExternals = require('webpack-node-externals');
const tsconfig = require('./tsconfig');

module.exports = (env) => {
  const isProduction = env.NODE_ENV === 'prod';
  return {
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: [/node_modules/],
          loader: 'ts-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [path.resolve('./node_modules'), path.resolve('./src')],
      alias: Object.keys(tsconfig.compilerOptions.paths).reduce((aliases, aliasName) => {
        aliases[aliasName.replace('/*', '')] = path.resolve(
          __dirname,
          `${tsconfig.compilerOptions.paths[aliasName][0].replace('/*', '')}`,
        );
        return aliases;
      }, {}),
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `server.${env.NODE_ENV}.js`,
    },

    mode: isProduction ? 'production' : 'development',
    plugins: [new CleanWebpackPlugin(), new Dotenv()],
    externals: [nodeExternals()],
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    target: 'node',
  };
};
