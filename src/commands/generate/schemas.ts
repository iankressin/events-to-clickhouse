import { z } from 'zod'

const CaseSchema = z.literal(['snake', 'camel', 'preserve'])

export const FromAddressSchema = z.object({
  from: z.literal('address'),
  etherscan: z.string(),
  // TODO: validate contract address format
  contract: z.string(),
  output: z.string().optional(),
  chain: z.number().default(1),
  case: CaseSchema,
})

export const FromFileSchema = z.object({
  from: z.literal('abi'),
  abi: z.string(),
  output: z.string().optional(),
  case: CaseSchema,
})

export const OptionsSchema = z.discriminatedUnion('from', [
  FromAddressSchema,
  FromFileSchema,
])

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
})

const BaseAbiSchema = z.object({
  inputs: z.array(AbiParameterSchema).optional(),
  payable: z.boolean().optional(),
  stateMutability: z.enum(['pure', 'view', 'nonpayable', 'payable']).optional(),
})

const ConstructorSchema = BaseAbiSchema.extend({
  type: z.literal('constructor'),
})

const EventSchema = BaseAbiSchema.extend({
  type: z.literal('event'),
  name: z.string(),
  anonymous: z.boolean(),
})

const FunctionSchema = BaseAbiSchema.extend({
  type: z.literal('function'),
  name: z.string(),
  outputs: z.array(AbiParameterSchema).optional(),
  constant: z.boolean().optional(),
})

// Add this schema for error types
const ErrorSchema = BaseAbiSchema.extend({
  type: z.literal('error'),
  name: z.string(),
})

// Update the discriminated union to include ErrorSchema
export const AbiItemSchema = z.discriminatedUnion('type', [
  ConstructorSchema,
  EventSchema,
  FunctionSchema,
  ErrorSchema, // Add this line
])

export const AbiSchema = z.array(AbiItemSchema)

export type Event = z.infer<typeof EventSchema>
export type Options = z.infer<typeof OptionsSchema>
export type AbiItem = z.infer<typeof AbiItemSchema>
export type ContractAbi = z.infer<typeof AbiSchema>

export type Case = z.infer<typeof CaseSchema>
export type FromFile = z.infer<typeof FromFileSchema>
export type FromAddress = z.infer<typeof FromAddressSchema>
