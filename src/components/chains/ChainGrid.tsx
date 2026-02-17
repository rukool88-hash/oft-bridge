'use client'

import { SUPPORTED_CHAINS } from '@/config/chains'
import { getTokensForChain } from '@/config/tokens'
import { cn } from '@/lib/utils'

const CHAIN_TVL: Record<number, string> = {
  30101: '$1.2B',
  30110: '$890M',
  30111: '$420M',
  30109: '$310M',
  30102: '$780M',
  30106: '$290M',
  30184: '$510M',
  30214: '$95M',
  30183: '$120M',
  30181: '$88M',
  30165: '$250M',
  30217: '$65M',
  30112: '$140M',
  30151: '$45M',
}

export function ChainGrid({ maxChains = 10 }: { maxChains?: number }) {
  const chains = SUPPORTED_CHAINS.slice(0, maxChains)

  return (
    <div>
      <div className="section-label">支持的链</div>
      <div className="grid grid-cols-2 gap-2">
        {chains.map((chain) => {
          const tokenCount = getTokensForChain(chain.eid).length
          const tvl = CHAIN_TVL[chain.eid] ?? '—'
          return (
            <div
              key={chain.eid}
              className="bg-surface border border-[rgba(255,255,255,0.07)] rounded-xl
                         p-3 flex items-center gap-2.5
                         hover:border-[rgba(99,179,237,0.2)] transition-colors"
            >
              <span className="text-xl w-7 text-center shrink-0">{chain.logo}</span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{chain.name}</div>
                <div className="text-[11px] text-[#6b7280] mt-0.5">
                  {tokenCount} 代币 · {tvl}
                </div>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
