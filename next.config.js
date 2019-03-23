/* eslint-disable @typescript-eslint/no-var-requires */
const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const plugins = [new MonacoWebpackPlugin()];
module.exports = withCSS(
    withTypescript({
        webpack(config) {
            config.node = {
                fs: 'empty'
            };
            config.plugins.push(new MonacoWebpackPlugin());
            return config;
        }
    })
);
