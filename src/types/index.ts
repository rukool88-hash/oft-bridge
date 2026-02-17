// ─── Chain Types ────────────────────────────────────────────────────────────

export interface SupportedChain {
  id: number              // EVM chain ID
  eid: number             // LayerZero Endpoint ID (V2)
  name: string
  shortName: string
  logo: string            // emoji or image path
  color: string           // brand color
  rpcUrl: string
  blockExplorer: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  layerZeroEndpoint: `0x${string}`  // LZ V2 EndpointV2 contract
  isTestnet?: boolean
}

// ─── Token Types ─────────────────────────────────────────────────────────────

export interface OFTToken {
  symbol: string
  name: string
  icon: string
  description: string
  coingeckoId?: string
  decimals: number
  deployments: TokenDeployment[]  // one per supported chain
  tags?: string[]
}

export interface TokenDeployment {
  chainEid: number
  address: `0x${string}`
  oftVersion: 'OFT' | 'OFTAdapter' | 'NativeOFT'
  isAdapter?: boolean      // OFTAdapter wraps an existing ERC-20
  underlyingToken?: `0x${string}` // only for OFTAdapter
}

// ─── Bridge Types ─────────────────────────────────────────────────────────────

export interface BridgeQuote {
  nativeFee: bigint        // fee in source chain native token (wei)
  nativeFeeUSD: number
  lzTokenFee: bigint       // fee in $ZRO token (optional)
  minDstGas: bigint
  estimatedTimeSeconds: number
  exchangeRate: number     // usually 1:1 for OFT
  amountIn: bigint
  amountOut: bigint        // after fee deduction
  refundAddress: `0x${string}`
}

export interface SendParam {
  dstEid: number
  to: `0x${string}`        // recipient address as bytes32
  amountLD: bigint         // amount in local decimals
  minAmountLD: bigint      // slippage protection
  extraOptions: `0x${string}`
  composeMsg: `0x${string}`
  oftCmd: `0x${string}`
}

export interface BridgeTx {
  id: string
  srcChainEid: number
  dstChainEid: number
  tokenSymbol: string
  amountIn: string
  amountOut: string
  sender: `0x${string}`
  recipient: `0x${string}`
  srcTxHash: `0x${string}`
  dstTxHash?: `0x${string}`
  status: TxStatus
  timestamp: number
  nonce?: number
  guid?: string            // LayerZero message GUID
}

export type TxStatus =
  | 'pending'
  | 'inflight'
  | 'delivered'
  | 'failed'

// ─── Price Types ─────────────────────────────────────────────────────────────

export interface TokenPrice {
  symbol: string
  usd: number
  usd_24h_change?: number
  last_updated: number
}

// ─── Store Types ─────────────────────────────────────────────────────────────

export interface BridgeState {
  fromChainEid: number
  toChainEid: number
  selectedToken: string   // symbol
  amountIn: string
  recipient: string        // defaults to connected wallet
  slippage: number         // basis points, e.g. 50 = 0.5%
}
