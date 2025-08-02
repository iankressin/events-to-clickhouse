export function catchErr(err: unknown): string {
   return  err instanceof Error 
        ? err.message
        : `Unknown error thrown`
}
