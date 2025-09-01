import { Command } from 'commander'
import { Effect } from 'effect/index'
import { generate } from './commands/generate/action'

export const program = new Command()

program
  .name('events-to-tables')
  .description('Create DB tables from EVM events')
  .version('0.0.9')

program
  .command('generate')
  .description('Generate DB tables from EVM events')
  .option(
    `-f, --from <'address', 'abi'>`,
    'Tells the CLI to either fetch the ABI from Etherscan using the contract address or from a local ABI file',
  )
  .option('-a, --abi <string>', 'Path to ABI file')
  .option('-c --contract <string>', 'Contract address')
  .option(
    '-e, --etherscan <string>',
    'Etherscan API key. Must be provided if fetch ABI by contract address',
  )
  .option('-o --output <string>', 'Output directory for the generated file')
  .option(
    '--case <snake | camel | preserve>',
    'The case used to name the table and the field',
    'snake',
  )
  .option('-t --table-prefix <string>', 'Prefix to append to table names')
  .action((options) => Effect.runPromise(generate(options)))
