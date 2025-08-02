# events-to-clickhouse-table

A CLI tool that generates ClickHouse table schemas from Ethereum contract events.

## Installation

```bash
pnpm install
pnpm build
```

## Usage

The CLI has one command: `generate`

### Generate from contract address

```bash
node dist/index.js generate --from address --contract 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984 --etherscan YOUR_API_KEY
```

### Generate from ABI file

```bash
node dist/index.js generate --from abi --abi ./path/to/abi.json
```

## Options

- `--from <'address' | 'abi'>` - Source for the ABI data
- `--contract <string>` - Contract address (required when using `--from address`)
- `--etherscan <string>` - Etherscan API key (required when using `--from address`)
- `--abi <string>` - Path to local ABI file (required when using `--from abi`)
- `--output <string>` - Output directory for generated files (optional)

It uses [Effect](https://effect.website) btw
