/* Copyright (C) 2025 MarcosHCK
 * This file is part of uh-statistics.
 *
 * uh-statistics is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * uh-statistics is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with uh-statistics. If not, see <https://www.gnu.org/licenses/>.
 */

module.exports =
{
  presets:
    [
      [ '@babel/preset-env', { targets: 'defaults' }],
      '@babel/preset-typescript'
    ],
  plugins:
    [
      [ 'module-resolver', { 'root': './src/',
                             alias: { '@cli': './src/cli/',
                                      '@common': './src/common/',
                                      '@plugin': './src/plugin/' }}
      ]
    ],
}