import { Navbar } from '@/components/layout/Navbar'
import { StatsBar } from '@/components/ui/StatsBar'
import { BridgeCard } from '@/components/bridge/BridgeCard'
import { TokenList } from '@/components/tokens/TokenList'
import { ChainGrid } from '@/components/chains/ChainGrid'
import { TxHistory } from '@/components/bridge/TxHistory'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ambient">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10">

        {/* Stats */}
        <StatsBar />

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6 items-start">

          {/* Left sidebar */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            <TokenList />
            <ChainGrid maxChains={8} />
          </div>

          {/* Center: Bridge card */}
          <div className="order-1 lg:order-2 max-w-md mx-auto w-full lg:max-w-none">
            <BridgeCard />
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-6 order-3">
            <TxHistory />

            {/* LZScan link */}
            <a
              href="https://layerzeroscan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-4 flex items-center gap-3 hover:border-[rgba(99,179,237,0.3)]
                         transition-colors group text-sm text-[#9ca3af]"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shrink-0">
                ⬡
              </div>
              <div>
                <div className="font-semibold text-white">LayerZero Scan</div>
                <div className="text-xs text-[#6b7280] mt-0.5">追踪跨链消息状态</div>
              </div>
              <span className="ml-auto text-[#6b7280] group-hover:text-accent transition-colors">↗</span>
            </a>
          </div>

        </div>
      </main>
    </div>
  )
}
