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

module.exports =
{

  env:
    {
      browser: true,
      es2022: true,
      node: true,
    },

  extends:
    [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:promise/recommended',
    ],

  root: true,
  parser: '@typescript-eslint/parser',

  parserOptions:
    {

      babelOptions:
        {
          configFile: './babel.config.cjs',
        },

      ecmaFeatures:
        {
          jsx: true,
        },

      ecmaVersion: 2022,
      project: './tsconfig.json',
      sourceType: 'module',
      tsconfigRootDir: __dirname,
    },

  plugins:
    [
      '@typescript-eslint',
      '@babel',
      'import',
      'promise',
    ],

  rules:
    {

      '@typescript-eslint/no-unused-vars': [ 'error',
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_' 
        }],
    },

  settings:
    {

      'import/resolver':
        {

          node:
            {
              extensions: [ '.js', '.jsx', '.ts', '.tsx' ],
              paths: [ '.' ],
            },

          typescript:
            {
              alwaysTryTypes: true,
              project: './tsconfig.json',
            }
        }
    }
};