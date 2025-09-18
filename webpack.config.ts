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
import path from 'path'

const base: Configuration =
{

  devtool: 'source-map',

  externals:
    [
      ...Object.keys (dependencies),
      ...Object.keys (devDependencies).filter (e => e !== 'commander'),
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
}

const allConfig: Configuration =
{
  ...base,

  entry: [ './src/index.ts' ],

  output:
    {
      clean: true,
      filename: 'index.js',
      library: { type: 'umd' },
      path: path.resolve (__dirname, 'dist'),
    },
}

const cliConfig: Configuration =
{
  ...base,

  entry: [ './src/cli/index.ts' ],

  output:
    {
      clean: true,
      filename: 'index.js',
      library: { type: 'umd' },
      path: path.resolve (__dirname, 'dist/cli'),
    },
}

export default [ allConfig, cliConfig ]