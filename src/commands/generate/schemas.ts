import { z } from 'zod';

export const GenerateOptionsSchema = z.object({
    etherscan: z.string(),
    // TODO: validate contract address format
    contract: z.string(),
    output: z.string().optional(),
    chain: z.number().default(1),
})

export const EtherscanResponse = z.object({
    status: z.string(),
    message: z.string(),
    result: z.string().optional(),
})

const AbiParameterSchema = z.object({
  internalType: z.string(),
  name: z.string(),
  type: z.string(),
  indexed: z.boolean().optional(), // Only present for event inputs
});

const BaseAbiSchema = z.object({
  inputs: z.array(AbiParameterSchema).optional(),
  payable: z.boolean().optional(),
  stateMutability: z.enum(['pure', 'view', 'nonpayable', 'payable']).optional(),
});

const ConstructorSchema = BaseAbiSchema.extend({
  type: z.literal('constructor'),
});

const EventSchema = BaseAbiSchema.extend({
  type: z.literal('event'),
  name: z.string(),
  anonymous: z.boolean(),
});

const FunctionSchema = BaseAbiSchema.extend({
  type: z.literal('function'),
  name: z.string(),
  outputs: z.array(AbiParameterSchema).optional(),
  constant: z.boolean().optional(),
});

export const AbiItemSchema = z.discriminatedUnion('type', [
  ConstructorSchema,
  EventSchema,
  FunctionSchema,
]);

export const AbiSchema = z.array(AbiItemSchema);

export type Event = z.infer<typeof EventSchema>;
export type GenerateOptions = z.infer<typeof GenerateOptionsSchema>;
export type AbiItem = z.infer<typeof AbiItemSchema>;
export type ContractAbi = z.infer<typeof AbiSchema>;


