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
import { close, explore, normalizeFile } from '@common/filesystem'
import { createReadStream } from 'fs'
import { dirname } from 'path'
import { getValidator } from '@common/TsSchema.shim'
import { json as _json } from 'stream/consumers'
import { type DefinedError } from 'ajv'
import { type Schema, type TsSchema } from '@common/TsSchema'
const validator = getValidator ()

export async function* collect (path: string, { compile }: { compile: boolean })
  : AsyncGenerator<Schema, void, unknown>
{

  for await (const [ fd, name ] of explore (path))
    {

      const autoClose = true
      const encoding = 'utf-8' as BufferEncoding

      const options = { autoClose, encoding, fd }

      const stream = createReadStream (name, options)
      const config = (await _json (stream)) as TsSchema

      if (validator (config) === false)
        {

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const errors = ((validator as any).errors as DefinedError[])!.map (e =>
            {
              let part
              const location = '' !== (part = e.instancePath) ? part : '(root)'
              const rule = e.schemaPath
              const message = `At ${location}: ${e.message} (violates ${rule})`
              return new Error (message, { cause: 'validation' })
            })

          const message = `invalid tsschema.json (in ${dirname (name)})`

          throw new AggregateError (errors, message, { cause: 'validation' })
        }

      for (const [ type, desc ] of Object.entries (config))
        {

          const base = dirname (name)
          const ext = ! (desc.compile ?? compile) ? 'json' : 'ajv.cjs'

          const file = normalizeFile (desc.file, base, `${type}.ts`)
          const output = normalizeFile (desc.output, base, `${type}.${ext}`)

          yield { compile: desc.compile ?? compile, file, output, type }
    }}
}

export async function* collectConf (path: string)
{

  for await (const [ fd, name ] of explore (path))
    { await close (fd); yield name }
}