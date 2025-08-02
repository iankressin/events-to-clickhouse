"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
const commander_1 = require("commander");
exports.program = new commander_1.Command();
exports.program
    .name('events-to-tables')
    .description('Create DB tables from EVM events')
    .version('0.1.0')
    .command('generate')
    .option('-e, --etherscan-api <string>', 'Etherscan API key')
    .option('-c --contract <string>', 'Contract address');
