import { Effect } from 'effect'
import type { Case } from '../commands/generate/schemas'

export const catchErr = (err: unknown) =>
  err instanceof Error ? err.message : `Unknown error thrown`

export const safeJsonParse = (str: string) =>
  Effect.try({
    try: () => JSON.parse(str),
    catch: catchErr,
  })

export const formatStr = (str: string, defaultCase: Case) => {
  switch (defaultCase) {
    case 'camel':
      return toCamelCase(str)
    case 'snake':
      return toSnakeCase(str)
    case 'preserve':
      return str
  }
}

const toSnakeCase = (str: string) =>
  str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')

const toCamelCase = (str: string) =>
  str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase())
