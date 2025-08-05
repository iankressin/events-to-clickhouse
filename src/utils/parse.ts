import { Effect } from 'effect'
import type { output, ZodSafeParseSuccess, ZodType } from 'zod'

export function parseData<T extends ZodType>(
  schema: T,
  data: any,
): Effect.Effect<ZodSafeParseSuccess<output<T>>['data'], string> {
  const parsedOptions = schema.safeParse(data)

  if (!parsedOptions.success)
    return Effect.fail(
      `Invalid options provided: ${parsedOptions.error.format()}`,
    )

  return Effect.succeed(parsedOptions.data)
}
