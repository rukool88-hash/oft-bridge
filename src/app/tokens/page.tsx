import { Navbar } from '@/components/layout/Navbar'
import { OFT_TOKENS } from '@/config/tokens'
import { SUPPORTED_CHAINS } from '@/config/chains'

export const metadata = {
  title: '代币 — OFT Bridge',
  description: '所有支持的 LayerZero OFT 代币',
}

export default function TokensPage() {
  return (
    <div className="min-h-screen bg-ambient">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">OFT 代币</h1>
          <p className="text-[#9ca3af]">
            所有支持 LayerZero OFT 标准的代币，可在 {SUPPORTED_CHAINS.length}+ 条链之间自由跨链
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {OFT_TOKENS.map((token) => (
            <div
              key={token.symbol}
              className="card p-5 hover:border-[rgba(99,179,237,0.2)] transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{token.icon}</span>
                <div>
                  <div className="font-bold">{token.symbol}</div>
                  <div className="text-sm text-[#9ca3af]">{token.name}</div>
                </div>
              </div>

              <p className="text-xs text-[#6b7280] mb-4">{token.description}</p>

              <div className="flex items-center justify-between">
                <div className="text-xs text-[#6b7280]">
                  <span className="font-semibold text-[#9ca3af]">{token.deployments.length}</span> 条链
                </div>
                <div className="flex flex-wrap gap-1">
                  {token.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold
                                 bg-accent/10 text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chain logos */}
              <div className="flex gap-1 mt-3 flex-wrap">
                {token.deployments.map((dep) => {
                  const chain = SUPPORTED_CHAINS.find((c) => c.eid === dep.chainEid)
                  return chain ? (
                    <span key={dep.chainEid} className="text-base" title={chain.name}>
                      {chain.logo}
                    </span>
                  ) : null
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
