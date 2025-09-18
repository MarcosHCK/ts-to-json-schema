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
export { opendir, writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { open as _open, opendir, type FileHandle } from 'fs/promises'
import type { Dir, PathLike } from 'fs'

export async function* explore (path: string): AsyncGenerator<[ FileHandle, string ], void, unknown>
{

  const dir = await opendir (path)
  const conf = join (path, 'tsschema.json')

  let fd
  if (null != (fd = await open (conf)))
    yield [ fd, conf ]

  let fold
  while (null != (fold = await dir.read ())) if (fold.isDirectory ())
    yield* explore (join (path, fold.name))

  await dir.close ()
}

export function normalizeFile (file: string | undefined, base: string, alt: string)
{

  return undefined === file ? join (base, alt)
                            : resolve (base, file)
}

export async function open (path: PathLike)
{

  try { return await _open (path) } catch (e)
    {

      if (typeof e !== 'object' || e == null)

        throw e
      else

        if (! Object.hasOwn (e, 'code') || (e as { code: string }).code !== 'ENOENT')

          throw e
        else
          return null
    }
}