import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
  mainnet, arbitrum, optimism, polygon, bsc, avalanche,
  base, scroll, linea, mantle, zkSync, fantom,
} from 'wagmi/chains'

// Custom chain definitions for chains not in wagmi/chains
const mantlePacific = {
  id: 169,
  name: 'Manta Pacific',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://pacific-rpc.manta.network/http'] } },
  blockExplorers: { default: { name: 'MantaScan', url: 'https://pacific-explorer.manta.network' } },
} as const

export const wagmiConfig = getDefaultConfig({
  appName: 'OFT Bridge',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'YOUR_PROJECT_ID',
  chains: [
    mainnet,
    arbitrum,
    optimism,
    polygon,
    bsc,
    avalanche,
    base,
    scroll,
    linea,
    mantle,
    zkSync,
    fantom,
    mantlePacific,
  ],
  ssr: true,
})
