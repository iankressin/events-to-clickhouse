import { Effect } from "effect";

export const catchErr = (err: unknown) =>
	err instanceof Error ? err.message : `Unknown error thrown`;

export const safeJsonParse = (str: string) =>
	Effect.try({
		try: () => JSON.parse(str),
		catch: catchErr,
	});

export const pascalToSnakeCase = (str: string): string =>
	str
		.replace(/([A-Z])/g, "_$1")
		.toLowerCase()
		.replace(/^_/, "");
