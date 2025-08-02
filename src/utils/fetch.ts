import { Effect } from "effect/index"
import { ZodType } from "zod"
import { parseData } from "./parse"
import { catchErr } from "./misc"

export const get = <T extends ZodType>(
    url: string,
    searchParams: URLSearchParams,
    schema: T
) => Effect.tryPromise({
    try: () => fetch(`${url}?${searchParams.toString()}`),
    catch: catchErr
}).pipe(
    Effect.flatMap(unwrapJson),
    Effect.flatMap((data) => parseData(schema, data))
)

const unwrapJson = (res: Response) => Effect.tryPromise({
    try: () => res.json(),
    catch: catchErr
})

