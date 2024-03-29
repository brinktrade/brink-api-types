import { ApprovalResponse, BigIntish, Bit, DeclarationArgs, DeclarationDefinitionArgs, DeclarationJSON, EIP712TypedData, IntentJSON, LimitSwapOutputEstimates, MarketSwapOutputEstimates, ProcessError, RouteSegment, SegmentJSON, SignatureType, SignedDeclarationJSON, TokenArgs, TokenJSON, TransactionResponse } from "@brinkninja/types"

export type RoutingSource =
  'odos' |
  'enso'

export type DeclarationStatus =
  'open' |
  'filled' |
  'cancelled' |
  'expired'

export type DeclarationSortBy = 'created_time'

export interface NoncesResponse {
  nonce: BigIntish
  bit: Bit
}

export interface IntentNonceResponse extends NoncesResponse {
  segmentIndex: number
}

export interface DeclarationNonceResponse extends IntentNonceResponse {
  intentIndex: number
}

export interface TransactionAPIResponse {
  hash: string
  status: 'succeeded' | 'failed'
  txTime: string
  usdValueAtot?: string
  pointsClaimed?: string
}

export interface DeclarationTransactionAPIResponse extends TransactionAPIResponse {
  intentIndex: number
}

export interface TokenResponse {
  paramName: string
  tokenData: TokenJSON
}

export interface IntentTokenResponse extends TokenResponse {
  segmentIndex: number
}

export interface DeclarationTokenResponse extends IntentTokenResponse {
  intentIndex: number
}

export interface DeclarationIncludes {
  requiredTransactions?: (ApprovalResponse | TransactionResponse)[] | ProcessError
  cancel?: TransactionResponse | ProcessError
}

export interface SignedDeclarationMetadata {
  createdAt: string
  expiryTime?: string | ProcessError
  tokens: DeclarationTokenResponse[]
  nonces: DeclarationNonceResponse[]
  transactions: DeclarationTransactionAPIResponse[]
  source?: string
  hash: string
}

export interface SignedDeclarationResponse extends Omit<SignedDeclarationJSON, 'eip712Data'>, SignedDeclarationMetadata {
  eip712Data?: EIP712TypedData | ProcessError | null
}

export interface IntentMetadata {
  intentId: number
  declarationId: number
  declarationHash: string
  requeueTime: string
  declarationIndex: number
  createdTime: string
  chainId: BigIntish
  state: {
    statuses: string[]
  }
}
export interface IntentResponse extends IntentJSON, IntentMetadata { }

export interface RequireCheckResponse {
  success: boolean
  bytes: string
}

export interface TWapRequest {
  tokenA: string
  tokenB: string
  interval: BigIntish
}

export interface OracleCall {
  oracleAddress: string
  oracleParams: string
}

export interface OracleResponse {
  oracleValue: BigIntish
}

export interface MultichainRequest {
  chainId: number
}

export interface MultiSignatureRequest {
  signer: string,
  signatureType: `${SignatureType}`,
}

export interface SortedRequest {
  sortBy?: string | null
  sortDirection?: 'asc' | 'desc' | null
}

export interface PaginatedRequest {
  limit?: number | null
  offset?: number | null
}

export interface PaginatedResponse {
  count: number
}
export interface RoutingRequest {
  sources?: RoutingSource[] | null
  buyer?: string | null
  include?: 'estimates' | 'routes' | null
}

export interface RoutingResponse {
  estimates?: MarketSwapOutputEstimates | LimitSwapOutputEstimates | ProcessError
  routes?: RouteSegment[] | ProcessError
}

// GET signers/:address/account/v1
export interface GetSignersAccountV1Request extends MultichainRequest { }
export interface GetSignersAccountV1Response {
  account: string
  deployed: boolean
  deploymentTransaction: TransactionResponse
}

// GET /signers/:address/cancel/v1
export interface GetSignersCancelV1Request extends MultichainRequest {
  nonce: BigIntish
}
export type GetSignersCancelV1Response = TransactionResponse

// GET /signers/:address/cancelEIP712TypedData/v1
export interface GetSignersCancelEIP712TypedDataV1Request extends MultichainRequest {
  nonce: BigIntish
}
export type GetSignersCancelEIP712TypedDataV1Response = EIP712TypedData

// GET /signers/:address/cancelWithSignature/v1
export interface GetSignersCancelWithSignatureV1Request {
  nonce: BigIntish
  signature: string
}
export type GetSignersCancelWithSignatureV1Response = TransactionResponse

// GET /signers/:address/delegateCall/v1
export interface GetSignersDelegateCallV1Request {
  data: string
  to: string
}
export type GetSignersDelegateCallV1Response = TransactionResponse

// GET /signers/:address/externalCall/v1
export interface GetSignersExternalCallV1Request {
  data: string
  to: string
  value: string
}
export type GetSignersExternalCallV1Response = TransactionResponse

// GET /signers/:address/metaDelegateCall/v1
export interface GetSignersMetaDelegateCallV1Request {
  data: string
  to: string
  deployAccount: boolean
  signature: string
  unsignedData: string
}
export type GetSignersMetaDelegateCallV1Response = TransactionResponse

// GET /signers/:address/nonce/v1
export interface GetSignersNonceV1Request extends MultichainRequest {
  nonce: BigIntish
}
export interface GetSignersNonceV1Response {
  usedByIntents: string[]
  usedOnChain: boolean
  transactions: {
    chainId: number
    declarationHash?: string
    hash: string
    intentIndex?: number
    status: 'sucedded' | 'failed'
    type: 'cancel' | 'execute'
  }[]
}

// GET signers/:address/nonces/v1
export interface GetSignersNoncesV1Request extends MultichainRequest {
  count: number
}
export interface GetSignersNoncesV1Response {
  nonces: BigIntish[]
}
//////////////////////////////////////////
// SEGMENTS
//////////////////////////////////////////
// GET /segments/blockInterval/v1
export interface GetSegmentsBlockIntervalV1Request extends MultichainRequest {
  id: BigIntish
  initialStart: BigIntish
  intervalMinSize: BigIntish
  maxIntervals: BigIntish
  signer: string
}
export interface GetSegmentsBlockIntervalV1Response extends RequireCheckResponse {
  bytes: string
  currentBlockNumber: BigIntish
  intervalReady: boolean
  intervalReadyBlock: BigIntish
  maxIntervalsExceeded: boolean
  state: {
    start: BigIntish
    counter: BigIntish
  }
  success: boolean
}

// GET /segments/limitSwapExactInput/v1
export interface GetSegmentsLimitSwapExactInputV1Request extends MultichainRequest, RoutingRequest {
  priceCurveParams: string
  priceCurveAddress: string
  tokenIn: string
  tokenInAmount: string
  tokenOut: string
}
export interface GetSegmentsLimitSwapExactInputV1Response extends RoutingResponse { }

// GET segments/marketSwapExactInput/v1
export interface GetSegmentsMarketSwapExactInputV1Request extends MultichainRequest, RoutingRequest {
  tokenIn: string
  tokenInAmount: string
  tokenOut: string
  feePercent: string
  feeMinTokenOut: string
}
export interface GetSegmentsMarketSwapExactInputV1Response extends RoutingResponse { }

// GET /segments/requireBlockNotMined/v1
export interface GetSegmentsRequireBlockNotMinedV1Request extends MultichainRequest {
  blockNumber: BigIntish
}
export interface GetSegmentsRequireBlockNotMinedV1Response extends RequireCheckResponse {
  currentBlock: BigIntish
}

// GET /segments/requireUint256LowerBound/v1
export interface GetSegmentsRequireUint256LowerBoundV1Request extends MultichainRequest, OracleCall {
  lowerBound: BigIntish
}
export interface GetSegmentsRequireUint256LowerBoundV1Response extends OracleResponse, RequireCheckResponse { }


// GET /segments/requireUint256UpperBound/v1
export interface GetSegmentsRequireUint256UpperBoundV1Request extends MultichainRequest, OracleCall {
  upperBound: BigIntish
}
export interface GetSegmentsRequireUint256UpperBoundV1Response extends OracleResponse, RequireCheckResponse { }

// GET /segments/swap01/v1
export interface GetSegmentsSwap01V1Request extends MultichainRequest {
  inputAmountContract: string
  inputAmountParams: string
  outputAmountContract: string
  outputAmountParams: string
  owner: string
  solverValidator: string
  tokenIn: string
  tokenOut: string
}
interface Params {
  oppositeTokenAmount: string;
  blockIntervalId: string;
  firstAuctionStartBlock: string;
  auctionDelayBlocks: string;
  auctionDurationBlocks: string;
  startPercentE6: string;
  endPercentE6: string;
  priceX96Oracle: string;
  priceX96OracleParams: string;
}

export interface FixedSwapAmount01 {
  amount: string;
  ISwapAmount: string;
  ISwapAmountBytesParams: string;
  params: {
    amount: string;
  };
  token: TokenArgs;
  type: 'FixedSwapAmount01';
}

export interface BlockIntervalDutchAuctionAmount01 {
  amount: string;
  ISwapAmount: string;
  ISwapAmountBytesParams: string;
  params: Params;
  token: TokenArgs;
  type: 'BlockIntervalDutchAuctionAmount01';
}

export type Swap01Type = FixedSwapAmount01 | BlockIntervalDutchAuctionAmount01
export interface GetSegmentsSwap01V1Response {
  chainId: number
  input: Swap01Type
  output: Swap01Type
  owner: string
  solverValidator: string
}

// GET /segments/useBit/v1
export interface GetSegmentsUseBitV1Request {
  bitmapIndex: BigIntish
  bit: BigIntish
  signer: string
}

export interface GetSegmentsUseBitV1Response extends RequireCheckResponse {
  bitUsed: boolean
}

//////////////////////////////////////////
// INTENTS
//////////////////////////////////////////

// GET /intents/declarations/:hash/v1
export interface GetIntentsDeclarationsV1Request {
  includes?: DeclarationIncludes[] | null
}
export type GetIntentsDeclarationV1Response = SignedDeclarationResponse


// GET /intents/declarations/find/v1
export interface GetIntentsDeclarationsFindV1Request extends MultichainRequest, PaginatedRequest, SortedRequest {
  hash?: string | null
  signatureType?: string | null
  signer?: string | null
  source: string
  tokenAddress: string | string[]
  includes?: DeclarationIncludes[] | null
}
export interface GetIntentsDeclarationsFindV1Response extends PaginatedResponse {
  declarations: SignedDeclarationResponse[]
}
// GET /intents/:intentId/v1
export interface GetIntentsV1Request { }

export interface GetIntentsV1Response extends IntentResponse { }

// GET /intents/compile/v1
export interface GetIntentsCompileV1Request extends MultichainRequest, MultiSignatureRequest {
  declaration: DeclarationArgs | DeclarationDefinitionArgs
  include?: DeclarationIncludes[] | null
}
export interface GetIntentsCompileV1Response extends DeclarationIncludes {
  declaration: DeclarationJSON
  declarationContract: string
  eip712Data: EIP712TypedData | ProcessError
}

// GET /intents/find/v1
export interface GetIntentsFindV1Request extends PaginatedRequest, SortedRequest, MultichainRequest {
  creationTimeAfter?: string | null
  creationTimeBefore?: string | null
  requeueTimeAfter?: string | null
  requeueTimeBefore?: string | null

}
export interface GetIntentsFindV1Response extends PaginatedResponse {
  intents: IntentResponse[]
}

// POST /intents/submit/v1
export type PostIntentsSubmitV1Request = DeclarationArgs & DeclarationDefinitionArgs & {
  source?: string;
};

export interface PostIntentsSubmitV1Response {
  hash: string
}

//////////////////////////////////////////
// ORACLES
//////////////////////////////////////////
// GET /oracles/uint256Oracle/value/v1
export interface GetOraclesUint256OracleValueV1Request extends OracleCall { }
export interface GetOraclesUint256OracleValueV1Response extends OracleResponse { }

// GET /oracles/uniV3TWAP/v1
export interface GetOraclesUniV3TWAPV1Request extends TWapRequest {
  fee: number
}
export interface GetOraclesUniV3TWAPV1Response extends OracleCall { }

// GET /oracles/uniV3TWAP/price/v1
export interface GetOraclesUniV3TWAPPriceV1Request extends TWapRequest { }
export interface GetOraclesUniV3TWAPPriceV1Response {
  fee: BigIntish
  poolAddress: string
  priceDecimal: number
  priceUintX96: string
}

//////////////////////////////////////////
// ROUTES
//////////////////////////////////////////
// GET /routing/routeSwapForInput/v1

export interface GetRoutingRouteSwapForInput extends MultichainRequest, RoutingRequest {
  gasPrice?: number
  tokenIn: string
  tokenInAmount: string
  tokenOut: string
}