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
import { BaseError } from 'ts-json-schema-generator'
import { collect, collectConf } from '@common/config'
import { compile, type CompilerOptions } from '@common/compiler'
import { generate, type GenerateOptions } from '@common/generator'
import { relative } from 'path'
import { type Compilation, type Compiler } from 'webpack'
import { type Schema } from '@common/TsSchema'
import { writeFile } from '@common/filesystem'

export interface Options
{
  basePath?: string;
  compilerOptions?: CompilerOptions;
  compileSchemas?: boolean;
  generatorOptions?: GenerateOptions;
}

export class Ts2JsonSchemaPlugin
{

  private basePath: string
  private compilerOptions: CompilerOptions
  private compileSchemas: boolean
  private generatorOptions: GenerateOptions

  public constructor (options?: Options)
    {
      this.basePath = options?.basePath ?? process.cwd ()
      this.compilerOptions = options?.compilerOptions ?? { code: { optimize: true } }
      this.compileSchemas = options?.compileSchemas ?? true
      this.generatorOptions = options?.generatorOptions ?? { skipTypeCheck: true }
    }

  public apply (compiler: Compiler)
    {

      compiler.hooks.beforeCompile.tapPromise ('SchemaGeneratorPlugin', () =>
        {
          return this.generate ()
        })

      if (compiler.options.watch)

      compiler.hooks.afterCompile.tapPromise ('SchemaGeneratorPlugin', compilation =>
        {
          return this.watchFiles (compilation)
        })
    }

  public async generate ()
    {

      const promises = []

      for await (const promise of this.generateAll ())
        promises.push (promise)

      await Promise.all (promises)
    }

  public async* generateAll ()
    {

      for await (const entry of collect (this.basePath, { compile: this.compileSchemas }))
        yield this.generateOne (entry)
    }

  public async generateOne (schema: Schema)
    {

      const { compile: mayCompile = this.compileSchemas } = schema
      const { file, output, type } = schema

      const where = relative (process.cwd (), file)
      console.log (`Generating schema for '${type}' (in ${where})`, file)

      let result
      if ((result = await generate (schema, this.generatorOptions)) instanceof BaseError)

        { process.stderr.write (result.format ()); return }
      else
        { result = mayCompile ? compile (result, this.compilerOptions) : JSON.stringify (result, null, 2) }

      await writeFile (output, result, { encoding: 'utf8' })
    }

  public async watchFiles (compilation: Compilation)
    {

      for await (const conf of collectConf (this.basePath))

        compilation.fileDependencies.add (conf)

      for await (const { file } of collect (this.basePath, { compile: false }))

        compilation.fileDependencies.add (file)
    }
}

export default Ts2JsonSchemaPlugin