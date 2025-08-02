import {
    AbiSchema,
    ContractAbi,
    EtherscanResponse,
    OptionsSchema,
    Event,
    FromAddress,
} from "./schemas";
import { solidityToClickHouseTypes } from "./config";
import { Effect } from "effect";
import { parseData } from "../../utils/parse";
import { get } from '../../utils/fetch'
import { readJsonFile, writeToFile } from "../../utils/fs";

const BASE_ETHERSCAN_URL = 'https://api.etherscan.io/v2/api';
const FILE_NAME = 'events.sql';

interface ParsedEventParam {
    name: string
    type: keyof typeof solidityToClickHouseTypes
}

interface ParsedEvent {
    name: string;
    params: ParsedEventParam[];
}

export const generate = (options: any) => Effect.gen(function* () {
    const parsedOptions = yield* parseData(OptionsSchema, options)

    const abi = parsedOptions.from === 'address'
        ? yield* fetchFromEtherscan(parsedOptions)
        : yield* readJsonFile(options.abi, AbiSchema)
        
    const abiEvents = extractEvents(abi)
    for (const event of abiEvents) {
        const tableSql = tableTemplate(event);
        yield* writeToFile(tableSql, FILE_NAME);
    }
})

const fetchFromEtherscan = (options: FromAddress) => Effect.gen(function* () {
    const params = new URLSearchParams({
        module: 'contract',
        action: 'getabi',
        chainid: options.chain.toString(),
        apikey: options.etherscan,
        address: options.contract
    })
    const response = yield* get(BASE_ETHERSCAN_URL, params, EtherscanResponse)

    if (response.status !== '1')
        return Effect.fail(`Error fetching ABI: ${response.message}`);

    if (!response.result)
        return Effect.fail("No ABI found in response");

    return JSON.parse(response.result)
}).pipe(Effect.flatMap((result) => parseData(AbiSchema, result)))

const extractEvents = (abi: ContractAbi): ParsedEvent[] => {
    return abi
        .filter((item): item is Event => item.type === 'event')
        .map(event => {
            const params = event.inputs?.map(input => ({
                name: input.name,
                type: input.type as keyof typeof solidityToClickHouseTypes
            })) || [];

            return {
                name: event.name,
                params
            };
        })
}

const tableTemplate = (event: ParsedEvent) =>
`CREATE TABLE IF NOT EXISTS ${event.name} (
    block_number UInt32 CODEC (DoubleDelta, ZSTD),
    timestamp DateTime CODEC (DoubleDelta, ZSTD),
    ${event.params.map(arg => `${arg.name} ${solidityToClickHouseTypes[arg.type]}`).join(',\n\t')},
    sign Int8 DEFAULT 1,
)
ENGINE = CollapsingMergeTree()
ORDER BY (block_number, timestamp)

` 
