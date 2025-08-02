import { AbiSchema, ContractAbi, EtherscanResponse, GenerateOptionsSchema, Event } from "./schemas";
import { solidityToClickHouseTypes } from "./config";
import fs from 'fs';

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

export async function generate(options: any) {
    const parsedOptions = GenerateOptionsSchema.safeParse(options);

    if (!parsedOptions.success) {
        console.warn("Invalid options provided:", parsedOptions.error.format);
        return
    }

    const { data } = parsedOptions;
    if (!data) {
        console.warn('Missing data from parsed options');
        return
    }

    const abi = await fetchContractAbi(
        data.contract,
        data.etherscan,
        data.chain
    );

    if (!abi) return

    const abiEvents = extractEvents(abi)

    for (const event of abiEvents) {
        const tableSql = tableTemplate(event);
        writeToFile(tableSql, FILE_NAME);
    }
}

export async function fetchContractAbi(
    contractAddress: string,
    apiKey: string,
    chain: number
): Promise<ContractAbi | undefined> {
    const params = new URLSearchParams({
        module: 'contract',
        action: 'getabi',
        chainid: chain.toString(),
        apikey: apiKey,
        address: contractAddress
    })

    const url = `${BASE_ETHERSCAN_URL}?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
        console.error(`Failed to fetch ABI: ${response.statusText}`);
        return undefined;
    }

    const data = await response.json();
    const parsedResponse = EtherscanResponse.safeParse(data);
    if (!parsedResponse.success) {
        console.error("Invalid response from Etherscan:", parsedResponse.error.format);
        return undefined;
    }

    if (parsedResponse.data.status !== '1') {
        console.error(`Error fetching ABI: ${data.message}`);
        return undefined;
    }

    if (!parsedResponse.data.result) {
        console.error("No ABI found in response");
        return undefined;
    }

    const abi = JSON.parse(parsedResponse.data.result);
    const parsedAbi = AbiSchema.safeParse(abi);
    if (parsedAbi.success) {
        return parsedAbi.data;
    }

    console.error("Invalid ABI format:", parsedAbi.error.issues);
    return undefined
}

function extractEvents(abi: ContractAbi): ParsedEvent[] {
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


function tableTemplate(event: ParsedEvent): string {
    return `CREATE TABLE IF NOT EXISTS ${event.name} (
    block_number UInt32 CODEC (DoubleDelta, ZSTD),
    timestamp DateTime CODEC (DoubleDelta, ZSTD),
    ${event.params.map(arg => `${arg.name} ${solidityToClickHouseTypes[arg.type]}`).join(',\n\t')},
    sign Int8 DEFAULT 1,
)
ENGINE = CollapsingMergeTree()
ORDER BY (block_number, timestamp)

`
} 

function writeToFile(content: string, filePath: string): void {
    fs.writeFileSync(filePath, content, { encoding: 'utf8', flag: 'a' });
}
