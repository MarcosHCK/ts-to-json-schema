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
import { Ajv, Options as AjvOptions, type SchemaObject } from 'ajv'
import standAlone from 'ajv/dist/standalone'

export type CompilerOptionsCode = Omit<Required<AjvOptions>['code'], 'source'>
export type CompilerOptions = Omit<AjvOptions, 'code'> & { code: CompilerOptionsCode }

export function compile (schema: SchemaObject, options: CompilerOptions)
{
  const compiler = new Ajv ({ ...options, code: { ...options.code, source: true } })
  return standAlone (compiler, compiler.compile (schema))
}