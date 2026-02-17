import { Navbar } from '@/components/layout/Navbar'
import { SUPPORTED_CHAINS } from '@/config/chains'
import { getTokensForChain } from '@/config/tokens'

export const metadata = {
  title: '链 — OFT Bridge',
}

export default function ChainsPage() {
  return (
    <div className="min-h-screen bg-ambient">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">支持的链</h1>
          <p className="text-[#9ca3af]">
            OFT Bridge 支持 {SUPPORTED_CHAINS.length} 条 EVM 链，通过 LayerZero V2 互联
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUPPORTED_CHAINS.map((chain) => {
            const tokens = getTokensForChain(chain.eid)
            return (
              <div
                key={chain.eid}
                className="card p-5 hover:border-[rgba(99,179,237,0.2)] transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{chain.logo}</span>
                  <div>
                    <div className="font-bold text-lg">{chain.name}</div>
                    <div className="text-sm text-[#9ca3af]">Chain ID: {chain.id}</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 text-success text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    在线
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-surface2 rounded-xl p-3">
                    <div className="text-xs text-[#6b7280] mb-1">LayerZero EID</div>
                    <div className="font-mono font-bold">{chain.eid}</div>
                  </div>
                  <div className="bg-surface2 rounded-xl p-3">
                    <div className="text-xs text-[#6b7280] mb-1">OFT 代币</div>
                    <div className="font-bold">{tokens.length}</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-[#6b7280] mb-1.5">EndpointV2 合约</div>
                  <div className="font-mono text-[11px] text-[#9ca3af] bg-surface2 rounded-lg p-2 truncate">
                    {chain.layerZeroEndpoint}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6b7280]">
                    原生代币: <span className="text-[#9ca3af] font-medium">{chain.nativeCurrency.symbol}</span>
                  </span>
                  <a
                    href={chain.blockExplorer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    区块浏览器 ↗
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
