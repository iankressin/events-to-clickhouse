import { Command } from 'commander';
import { generate } from './commands/generate/action';

export const program = new Command()

program
    .name('events-to-tables')
    .description('Create DB tables from EVM events')
    .version('0.1.0')

program
    .command('generate')
    .description('Generate DB tables from EVM events')
    .option('-e, --etherscan <string>', 'Etherscan API key')
    .option('-c --contract <string>', 'Contract address')
    .option('-o --output <string>', 'Output directory for the generated file')
    .action((options) => generate(options))
