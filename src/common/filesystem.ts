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
import { close as _close, open as _open, opendir as _opendir, writeFile as _writeFile } from 'fs'
import { join, resolve } from 'path'
import type { Dir, PathLike, PathOrFileDescriptor, WriteFileOptions } from 'fs'

export async function close (fd: number)
{

  return new Promise<void> ((resolve, reject) =>

    _close (fd, err =>
      {
        if (err != null) reject (err)
                    else resolve ()
      }))
}

export async function* explore (path: string): AsyncGenerator<[ number, string ], void, unknown>
{

  const dir = await opendirAsync (path)
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

  return new Promise<null | number> ((resolve, reject) =>

    _open (path, (err, fd) =>
      {

        if (err == null) resolve (fd)
        else
        if (err.code === 'ENOENT') resolve (null)
        else
                                   reject (err)
      }))
}

export async function opendirAsync (path: PathLike)
{

  return new Promise<Dir> ((resolve, reject) =>

    _opendir (path, (err, dir) =>
      {
        if (err != null) reject (err)
                    else resolve (dir)
      }))
}

export function writeFile (file: PathOrFileDescriptor, data: string, options: WriteFileOptions)
{

  return new Promise<void> ((resolve, reject) => _writeFile (file, data, options, err =>
    {
      if (err !== null) reject (err)
      if (err === null) resolve ()
    }))
}