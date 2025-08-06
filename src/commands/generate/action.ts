import { Effect } from 'effect'
import { get } from '../../utils/fetch'
import { readJsonFile, writeToFile } from '../../utils/fs'
import { parseData } from '../../utils/parse'
import { solidityToClickHouseTypes } from './config'
import {
  AbiSchema,
  type Case,
  type ContractAbi,
  EtherscanResponse,
  type Event,
  type FromAddress,
  OptionsSchema,
} from './schemas'
import { formatStr } from '../../utils/misc'

const BASE_ETHERSCAN_URL = 'https://api.etherscan.io/v2/api'
const DEFAULT_FILE_NAME = 'events.sql'

interface ParsedEventParam {
  name: string
  type: keyof typeof solidityToClickHouseTypes
}

interface ParsedEvent {
  name: string
  params: ParsedEventParam[]
}

export const generate = (options: any) =>
  Effect.gen(function* () {
    const parsedOptions = yield* parseData(OptionsSchema, options)
    const outputPath = parsedOptions.output
      ? `${parsedOptions.output}`
      : `${DEFAULT_FILE_NAME}`

    const abi =
      parsedOptions.from === 'address'
        ? yield* fetchFromEtherscan(parsedOptions)
        : yield* readJsonFile(parsedOptions.abi, AbiSchema)

    const abiEvents = extractEvents(abi)
    for (const event of abiEvents) {
      const tableSql = tableTemplate(event, parsedOptions.case)
      yield* writeToFile(tableSql, outputPath)
    }

    console.log(`Tables created at ${outputPath}`)
  })

const fetchFromEtherscan = (options: FromAddress) =>
  Effect.gen(function* () {
    const params = new URLSearchParams({
      module: 'contract',
      action: 'getabi',
      chainid: options.chain.toString(),
      apikey: options.etherscan,
      address: options.contract,
    })
    const response = yield* get(BASE_ETHERSCAN_URL, params, EtherscanResponse)

    if (response.status !== '1')
      return Effect.fail(`Error fetching ABI: ${response.message}`)

    if (!response.result) return Effect.fail('No ABI found in response')

    return JSON.parse(response.result)
  }).pipe(Effect.flatMap((result) => parseData(AbiSchema, result)))

const extractEvents = (abi: ContractAbi): ParsedEvent[] => {
  return abi
    .filter((item): item is Event => item.type === 'event')
    .map((event) => {
      const params =
        event.inputs?.map((input) => ({
          name: input.name,
          type: input.type as keyof typeof solidityToClickHouseTypes,
        })) || []

      return {
        name: event.name,
        params,
      }
    })
}

const tableTemplate = (event: ParsedEvent, defaultCase: Case) =>
  `CREATE TABLE IF NOT EXISTS ${formatStr(event.name, defaultCase)} (
    ${formatStr('blockNumber', defaultCase)} UInt32 CODEC (DoubleDelta, ZSTD),
    timestamp DateTime CODEC (DoubleDelta, ZSTD),
    ${event.params.map((arg) => `${formatStr(arg.name, defaultCase)} ${solidityToClickHouseTypes[arg.type]}`).join(',\n\t')},
    sign Int8 DEFAULT 1
)
ENGINE = CollapsingMergeTree(sign)
PARTITION BY toYYYYMM(timestamp)
ORDER BY (${formatStr('blockNumber', defaultCase)}, timestamp);

`
