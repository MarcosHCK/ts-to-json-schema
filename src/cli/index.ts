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
import package_ from '@package'
import { BaseError } from 'ts-json-schema-generator'
import { collect, collectConf } from '@common/config'
import { compile, type CompilerOptions } from '@common/compiler'
import { generate, type GenerateOptions } from '@common/generator'
import { program, type OptionValues } from 'commander'
import { relative } from 'path'
import { writeFile } from '@common/filesystem'

program.description (package_.description)
       .argument ('<dir>', 'Directory to scan for tsschema.json files')
       .version (package_.version)

program.option ('--compile', 'Compile schemas by default (can be overridden in tsschema.json)', false)

program.option ('--compiler-add-used-schemas', 'add schemas to the instance if they have $id (or id) property that does not start with "#". If $id is present and it is not unique the compilation will fail', false)
program.option ('--compiler-all-errors', 'Report all possible errors in the schema (default behavior is to stop compilation after the first problem)', false)
program.option ('--compiler-allow-date', 'Defines how date-time strings are parsed and validated (use this flag to allow date string, against whats is required by JTD specification)', false)
program.option ('--compiler-allow-matching-properties', 'Allow overlap between "properties" and "patternProperties" when running on strict mode', false)
program.option ('--compiler-allow-union-types', 'Allow using multiple non-null types in "type" keyword when running on strict mode', false)
program.option ('--compiler-code-es5', 'Emit ES5-compatible code (default is emit ES6-compatible code)', false)
program.option ('--compiler-code-esm', 'Emit ESM code (default is CommonJS code)', false)
program.option ('--compiler-code-lines', 'Insert line breaks in the generated code (default is minified code)', false)
program.option ('--compiler-coerce-types [type]', 'Try to coerce field value to match type specified in "type" keyword (use "array" to consider scalars and arrays with only one value coercible)', false)
program.option ('--compiler-disable-int32-range', 'Disable range checking for int32 and uint32 types (in JTD schemas)', false)
program.option ('--compiler-disable-unicode-reg-exp', 'Use unicode flag "u" with "pattern" and "patternProperties"', false)
program.option ('--compiler-discriminator', 'Add support for "discriminator" keyword', false)
program.option ('--compiler-dont-inline-refs', 'The referenced schemas that do not have refs in them are inlined, regardless of their size (it improves performance)', false)
program.option ('--compiler-dont-validate-schema', 'Validate the input schema against the meta schema specified in "$schema" (or against draft-07 if absent)', false)
program.option ('--compiler-own-properties', 'Iterate only own enumerable object properties (i.e. found directly on the object rather than on its prototype)', false)
program.option ('--compiler-parse-date', 'Defines how date-time strings are parsed by JTD parsers (use this flag to parse them as Date objects)', false)
program.option ('--compiler-remove-additional [type]', 'Remove additional properties (use "all" to remove them nonetheless, "failing" if they invalidates the data, of none to remove only if "additionalProperties" is false)', false)
program.option ('--compiler-strict [value]', 'Run JSON schema compiler (Ajv) in strict mode (or use "log" as argument to log when an strict mode rule is broken)', true)
program.option ('--compiler-strict-numbers [value]', 'Run JSON schema compiler (Ajv) in strict numbers mode (or use "log" as argument to log when an strict mode rule is broken)', true)
program.option ('--compiler-strict-required [value]', 'Run JSON schema compiler (Ajv) in strict required mode (or use "log" as argument to log when an strict mode rule is broken)', true)
program.option ('--compiler-strict-schema [value]', 'Run JSON schema compiler (Ajv) in strict schemas mode (or use "log" as argument to log when an strict mode rule is broken)', true)
program.option ('--compiler-strict-tuples [value]', 'Run JSON schema compiler (Ajv) in strict tuples mode (or use "log" as argument to log when an strict mode rule is broken)', true)
program.option ('--compiler-strict-types [value]', 'Run JSON schema compiler (Ajv) in strict types mode (or use "log" as argument to log when an strict mode rule is broken)', true)
program.option ('--compiler-timestamp <type>', 'Defines which Javascript types will be accepted for the JTD timestamp type (choices: "date", "string")', undefined)
program.option ('--compiler-use-defaults [type]', 'Whether to fill up missing properties with "default" keyword value (use "empty" to consider null or "" properties as missing as well)', false)
program.option ('--compiler-validate-formats', 'Enforce format validation (like "format": "date" on fields) when running on strict mode', false)

program.option ('-O, --optimize [N]', 'Optimize generated code using [N] passes (one by default). Multiple passes are unlikely to make a difference (unless a compiling a really complex schema)', true)

program.option ('--generator-additional-properties', 'Allow additional properties for objects with no index signature', false)
program.option ('--generator-discriminator-type <type>', '"discriminator" keyword type to use (choices: "json-schema", "open-api")', undefined)
program.option ('--generator-dont-encode-refs', 'Do not encode references', false)
program.option ('--generator-expose', 'Type exposing (choices: "all", "none", "export")', 'export')
program.option ('--generator-extra-keywords <value>', 'Provide additional validation keywords to include', undefined)
program.option ('--generator-js-doc', 'Read JsDoc annotations (choices: "none", "basic", "extended")', 'extended')
program.option ('--generator-markdown-description', 'Generate "markdownDescription" keyword in addition to "description" keyword', false)
program.option ('--generator-minify', 'Minify generated schema', false)
program.option ('--generator-no-top-ref', 'Do not create a top-level $ref definition (create an reference schema)', false)
program.option ('--generator-schema-id', '"$id" keyword value for generated schema', undefined)
program.option ('--generator-skip-type-check', 'Skip typescript parser type checks (improves performance)', false)
program.option ('--generator-sort-properties', 'Sort class or interface properties (generates an stable schema)', false)
program.option ('--generator-strict-tuples', 'Do not allow additional items on tuples', false)

program.option ('-p, --project <file>', 'Use <file> as Typescript project (default is tsconfig.json)', 'tsconfig.json')

program.parse (process.argv)

function choice<T> (value: string, set: T[], optionName: string): T
{

  if (value in set)
    {
      const choices = set.filter (e => e !== undefined).map (e => `'${e}'`).join (',')

      process.stderr.write (`invalid choice for '${optionName}' (valid choices are ${choices})`)
      process.exit (1)
    }
return value as T
}

function numberArg (value: string, optionName: string, float: boolean = false)
{
  const n = ! float ? Number.parseInt (value)
                    : Number.parseFloat (value)
  return n
}

async function main (options: OptionValues)
{

  const compilerOptions: CompilerOptions =
    {
      addUsedSchema: options.addUsedSchema,
      allErrors: options.compilerAllErrors,
      allowDate: options.compilerAllowDate,
      allowMatchingProperties: options.compilerAllowMatchingProperties,
      allowUnionTypes: options.compilerAllowUnionTypes,
      code: { es5: options.compilerCodeEs5,
              esm: options.compilerCodeEsm,
              lines: options.compilerCodeLines,
              optimize: numberArg (options.optimize as string, '--optimize') },
      coerceTypes: choice (options.compilerCoerceTypes, [ false, true, undefined, 'array' ], '--compiler-coerce-types'),
      int32range: !options.compilerDisableInt32Range,
      unicodeRegExp: !options.compilerDisableUnicodeRegExp,
      discriminator: options.compilerDiscriminator,
      inlineRefs: !options.compilerDontInlineRefs,
      validateSchema: !options.compilerDontValidateSchema,
      ownProperties: options.compilerOwnProperties,
      parseDate: options.compilerParseDate,
      removeAdditional: choice (options.compilerRemoveAdditional, [ false, true, 'all', 'failing' ], '--compiler-remove-additional'),
      strict: choice (options.compilerStrict, [ false, true, 'log' ], '--compiler-strict'),
      strictNumbers: choice (options.compilerStrictNumbers, [ false, true, 'log' ], '--compiler-strict-numbers'),
      strictRequired: choice (options.compilerStrictRequired, [ false, true, 'log' ], '--compiler-strict-required'),
      strictSchema: choice (options.compilerStrictSchema, [ false, true, 'log' ], '--compiler-strict-schema'),
      strictTuples: choice (options.compilerStrictTuples, [ false, true, 'log' ], '--compiler-strict-tuples'),
      strictTypes: choice (options.compilerStrictTypes, [ false, true, 'log' ], '--compiler-strict-types'),
      timestamp: choice (options.compilerTimestamp, [ undefined, 'date', 'string' ], '--compiler-timestamp'),
      useDefaults: choice (options.compilerUseDefaults, [ false, true, 'empty' ], '--compiler-use-defaults'),
      validateFormats: options.compilerValidateFormats,
    }

  const generatorOptions: GenerateOptions =
    {
      additionalProperties: options.generatorAdditionalProperties,
      discriminatorType: choice (options.generatorDiscriminatorType, [ undefined, 'json-schema', 'open-api' ], '--generator-discriminator-type'),
      encodeRefs: !options.generatorDontEncodeRefs,
      expose: options.generatorExpose,
      extraTags: (options.generatorExtraKeywords as string)?.split (',')?.map (e => e.trim ()),
      jsDoc: options.generatorJsDoc,
      markdownDescription: options.generatorMarkdownDescription,
      minify: options.generatorMinify,
      skipTypeCheck: options.generatorSkipTypeCheck,
      sortProps: options.generatorSortProperties,
      strictTuples: options.generatorStrictTuples,
      topRef: !options.generatorNoTopRef,
      tsconfig: options.project,
    }

  const dir = options.dir ?? process.cwd ()

  for await (const conf of collectConf (dir))
    {
      console.log (`Reding tsschema.json on '${relative (dir, conf)}'`)
    }

  for await (const schema of collect (dir, { compile: options.compile,
                                                 esm: compilerOptions.code.esm }))
    {

      const { compile: mayCompile = options.compile as boolean, file, output, type } = schema

      console.log (`Generating schema for '${type}' (in ${relative (process.cwd (), file)})`)

      let result
      if ((result = await generate (schema, generatorOptions)) instanceof BaseError)

        { process.stderr.write (result.format ()); return }
      else
        { result = mayCompile ? compile (result, compilerOptions) : JSON.stringify (result, null, 2) }

      await writeFile (output, result, { encoding: 'utf8' })
    }
}

main (program.opts ()).catch (e => console.log (e))