import { program } from "./program";
import { Effect, succeed, fail } from "effect/Effect"

const value = succeed(10)
const error = fail(new Error('An error'))

function divide(a: number, b: number): Effect<number, Error> {
    return b === 0 ? succeed(a / b) : fail(new Error('cannot devide by 0'))
}

function main() {
    program.parse(process.argv)
}

void main()
