import { Effect } from "effect"

export const catchErr = (err: unknown) =>
   err instanceof Error 
        ? err.message
        : `Unknown error thrown`

export const safeJsonParse = (str: string) => Effect.try({
    try: () => JSON.parse(str),
    catch: catchErr
})

