/* Copyright (C) 2025 MarcosHCK
 * This file is part of ts-to-json-schema.
 *
 * ts-to-json-schema is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ts-to-json-schema is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ts-to-json-schema. If not, see <https://www.gnu.org/licenses/>.
 */
import { dependencies, devDependencies } from './package.json'
import { type Configuration } from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import path from 'path'

const config: Configuration =
{

  devtool: 'source-map',

  entry: [ './src/index.ts' ],

  externals:
    [
      ...Object.keys (dependencies),
      ...Object.keys (devDependencies),
      'fs', 'path'
    ],

  mode: 'production',

  module:
    {
      rules:
        [
          {
            exclude: /node_modules/,
            test: /\.ts$/,
            use: 'babel-loader',
          },
        ],
    },

  resolve:
    {
      extensions: [ '.js', '.ts' ],
    },

  target: 'node',

  output:
    {
      clean: true,
      filename: 'index.js',
      library: '[name]',
      libraryTarget: 'umd',
      path: path.resolve (__dirname, 'dist'),
    },

  plugins:
    [

      new ForkTsCheckerWebpackPlugin (
        {

          typescript:
            {
              diagnosticOptions:
                {
                  semantic: true,
                  syntactic: true,
                },
              mode: 'write-references',
            },
        })
    ]
}

export default config