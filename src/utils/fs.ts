import { Effect } from 'effect/index'
import { readFileSync, writeFileSync } from 'fs'
import type { ZodType } from 'zod'
import { catchErr, safeJsonParse } from './misc'
import { parseData } from './parse'

export const writeToFile = (content: string, path: string) =>
  Effect.try({
    try: () => writeFileSync(path, content, { encoding: 'utf8', flag: 'a' }),
    catch: catchErr,
  })

export const readJsonFile = <T extends ZodType>(path: string, schema: T) =>
  Effect.try({
    try: () => {
      if (!path.endsWith('.json'))
        new Error('JSON file path must have .json file extension')

      return readFileSync(path, 'utf8')
    },
    catch: catchErr,
  }).pipe(
    Effect.flatMap((contents) => safeJsonParse(contents)),
    Effect.flatMap((json) => parseData(schema, json)),
  )
