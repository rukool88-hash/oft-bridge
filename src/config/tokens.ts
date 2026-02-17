import type { OFTToken } from '@/types'

// Curated list of well-known OFT tokens with real deployment addresses.
// Add/remove entries as needed. Addresses sourced from official docs/repos.

export const OFT_TOKENS: OFTToken[] = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '💎',
    description: 'Circle 发行的合规稳定币，受 LayerZero OFT 标准支持',
    coingeckoId: 'usd-coin',
    decimals: 6,
    tags: ['stablecoin', 'popular'],
    deployments: [
      { chainEid: 30101, address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', oftVersion: 'OFT' },
      { chainEid: 30110, address: '0x980b62da83eff3d4576c647993b0c1d7faf17c73', oftVersion: 'OFT' },
      { chainEid: 30111, address: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7', oftVersion: 'OFT' },
      { chainEid: 30184, address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', oftVersion: 'OFT' },
      { chainEid: 30109, address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', oftVersion: 'OFT' },
    ],
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    icon: '💵',
    description: 'Tether 发行的稳定币，全球交易量最大',
    coingeckoId: 'tether',
    decimals: 6,
    tags: ['stablecoin', 'popular'],
    deployments: [
      { chainEid: 30101, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', oftVersion: 'OFTAdapter', underlyingToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
      { chainEid: 30102, address: '0x55d398326f99059fF775485246999027B3197955', oftVersion: 'OFT' },
      { chainEid: 30110, address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', oftVersion: 'OFT' },
      { chainEid: 30109, address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', oftVersion: 'OFT' },
    ],
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    icon: '🔷',
    description: '以太坊的 ERC-20 封装版本，支持跨链传输',
    coingeckoId: 'weth',
    decimals: 18,
    tags: ['wrapped', 'popular'],
    deployments: [
      { chainEid: 30101, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', oftVersion: 'OFTAdapter' },
      { chainEid: 30110, address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', oftVersion: 'OFT' },
      { chainEid: 30111, address: '0x4200000000000000000000000000000000000006', oftVersion: 'OFT' },
      { chainEid: 30184, address: '0x4200000000000000000000000000000000000006', oftVersion: 'OFT' },
      { chainEid: 30109, address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', oftVersion: 'OFT' },
    ],
  },
  {
    symbol: 'STG',
    name: 'Stargate',
    icon: '⭐',
    description: 'Stargate Finance 原生 OFT 治理代币',
    coingeckoId: 'stargate-finance',
    decimals: 18,
    tags: ['defi', 'governance'],
    deployments: [
      { chainEid: 30101, address: '0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6', oftVersion: 'OFT' },
      { chainEid: 30102, address: '0xB0D502E938ed5f4df2E681fE6E419ff29631d62b', oftVersion: 'OFT' },
      { chainEid: 30106, address: '0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590', oftVersion: 'OFT' },
      { chainEid: 30109, address: '0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590', oftVersion: 'OFT' },
      { chainEid: 30110, address: '0x6694340fc020c5E6B96567843da2df01b2CE1eb6', oftVersion: 'OFT' },
      { chainEid: 30111, address: '0x296F55F8Fb28E498B858d0BcDA06D955B2Cb3f97', oftVersion: 'OFT' },
    ],
  },
  {
    symbol: 'JOE',
    name: 'JOE Token',
    icon: '☕',
    description: 'Trader Joe 多链 DEX 治理代币',
    coingeckoId: 'joe',
    decimals: 18,
    tags: ['defi', 'governance'],
    deployments: [
      { chainEid: 30106, address: '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd', oftVersion: 'OFT' },
      { chainEid: 30110, address: '0x371c7ec6D8039ff7933a2AA28EB827Ffe1F52f07', oftVersion: 'OFT' },
      { chainEid: 30102, address: '0x371c7ec6D8039ff7933a2AA28EB827Ffe1F52f07', oftVersion: 'OFT' },
    ],
  },
  {
    symbol: 'ARB',
    name: 'Arbitrum',
    icon: '🟣',
    description: 'Arbitrum DAO 原生治理代币',
    coingeckoId: 'arbitrum',
    decimals: 18,
    tags: ['governance', 'l2'],
    deployments: [
      { chainEid: 30110, address: '0x912CE59144191C1204E64559FE8253a0e49E6548', oftVersion: 'OFT' },
      { chainEid: 30101, address: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1', oftVersion: 'OFT' },
    ],
  },
  {
    symbol: 'OP',
    name: 'Optimism',
    icon: '🔴',
    description: 'Optimism DAO 治理代币，支持 Superchain',
    coingeckoId: 'optimism',
    decimals: 18,
    tags: ['governance', 'l2'],
    deployments: [
      { chainEid: 30111, address: '0x4200000000000000000000000000000000000042', oftVersion: 'OFT' },
    ],
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    icon: '🔗',
    description: '去中心化预言机网络代币',
    coingeckoId: 'chainlink',
    decimals: 18,
    tags: ['infrastructure'],
    deployments: [
      { chainEid: 30101, address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', oftVersion: 'OFTAdapter' },
      { chainEid: 30110, address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4', oftVersion: 'OFT' },
      { chainEid: 30109, address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39', oftVersion: 'OFT' },
    ],
  },
  {
    symbol: 'GMX',
    name: 'GMX',
    icon: '🔮',
    description: '去中心化永续合约交易所治理代币',
    coingeckoId: 'gmx',
    decimals: 18,
    tags: ['defi', 'perps'],
    deployments: [
      { chainEid: 30110, address: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a', oftVersion: 'OFT' },
      { chainEid: 30106, address: '0x62edc0692BD897D2295872a9FFCac5425011c661', oftVersion: 'OFT' },
    ],
  },
  {
    symbol: 'AAVE',
    name: 'Aave',
    icon: '👻',
    description: '最大的去中心化借贷协议治理代币',
    coingeckoId: 'aave',
    decimals: 18,
    tags: ['defi', 'lending'],
    deployments: [
      { chainEid: 30101, address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', oftVersion: 'OFTAdapter' },
      { chainEid: 30109, address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B', oftVersion: 'OFT' },
      { chainEid: 30110, address: '0xba5DdD1f9d7F570dc94a51479a000E3BCE967196', oftVersion: 'OFT' },
    ],
  },
  {
    symbol: 'CAKE',
    name: 'PancakeSwap',
    icon: '🥞',
    description: 'PancakeSwap 多链 DEX 治理代币',
    coingeckoId: 'pancakeswap-token',
    decimals: 18,
    tags: ['defi', 'dex'],
    deployments: [
      { chainEid: 30102, address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', oftVersion: 'OFT' },
      { chainEid: 30101, address: '0x152649eA73beAb28c5b49B26eb48f7EAD6d4c898', oftVersion: 'OFT' },
      { chainEid: 30110, address: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c', oftVersion: 'OFT' },
    ],
  },
  {
    symbol: 'ZRO',
    name: 'LayerZero',
    icon: '⬡',
    description: 'LayerZero 协议原生治理代币',
    coingeckoId: 'layerzero',
    decimals: 18,
    tags: ['infrastructure', 'governance'],
    deployments: [
      { chainEid: 30101, address: '0x6985884C4392D348587B19cb9eAAf157F13271cd', oftVersion: 'OFT' },
      { chainEid: 30110, address: '0x6985884C4392D348587B19cb9eAAf157F13271cd', oftVersion: 'OFT' },
      { chainEid: 30184, address: '0x6985884C4392D348587B19cb9eAAf157F13271cd', oftVersion: 'OFT' },
      { chainEid: 30111, address: '0x6985884C4392D348587B19cb9eAAf157F13271cd', oftVersion: 'OFT' },
      { chainEid: 30102, address: '0x6985884C4392D348587B19cb9eAAf157F13271cd', oftVersion: 'OFT' },
    ],
  },
]

export function getTokenBySymbol(symbol: string): OFTToken | undefined {
  return OFT_TOKENS.find((t) => t.symbol === symbol)
}

export function getDeploymentByChain(token: OFTToken, eid: number) {
  return token.deployments.find((d) => d.chainEid === eid)
}

export function getChainsForToken(token: OFTToken): number[] {
  return token.deployments.map((d) => d.chainEid)
}

export function getTokensForChain(eid: number): OFTToken[] {
  return OFT_TOKENS.filter((t) => t.deployments.some((d) => d.chainEid === eid))
}
