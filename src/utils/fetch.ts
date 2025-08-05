import { Effect } from 'effect/index'
import type { ZodType } from 'zod'
import { catchErr } from './misc'
import { parseData } from './parse'

export const get = <T extends ZodType>(
  url: string,
  searchParams: URLSearchParams,
  schema: T,
) =>
  Effect.tryPromise({
    try: () => fetch(`${url}?${searchParams.toString()}`),
    catch: catchErr,
  }).pipe(
    Effect.flatMap(unwrapJson),
    Effect.flatMap((data) => parseData(schema, data)),
  )

const unwrapJson = (res: Response) =>
  Effect.tryPromise({
    try: () => res.json(),
    catch: catchErr,
  })
