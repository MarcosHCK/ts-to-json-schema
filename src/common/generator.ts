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
import { createGenerator, BaseError, type Config } from 'ts-json-schema-generator'
import { type Schema } from '@common/TsSchema'

export type GenerateOptions = Omit<Config, 'path' | 'type'>

export async function generate ({ file: path, type }: Schema, config?: GenerateOptions)
{

  try
    {
      const generator = createGenerator ({ ...(config ?? { }), path, type })
      return generator.createSchema (type)
    }
  catch (error)
    {
      if (! (error instanceof BaseError)) throw error
                                     else return error
    }
}