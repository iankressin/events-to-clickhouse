"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
function main() {
    const values = program_1.program.parse(process.argv);
    console.log("Parsed values:", values);
}
void main();
