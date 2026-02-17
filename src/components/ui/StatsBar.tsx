'use client'

import { SUPPORTED_CHAINS } from '@/config/chains'
import { OFT_TOKENS } from '@/config/tokens'

const STATS = [
  {
    value: '$4.72B',
    label: '总跨链量 (TVL)',
    change: '+3.2% 今日',
    positive: true,
  },
  {
    value: String(SUPPORTED_CHAINS.length) + '+',
    label: '支持链数',
    change: '持续新增',
    positive: true,
  },
  {
    value: String(OFT_TOKENS.length) + '+',
    label: 'OFT 代币',
    change: '标准代币',
    positive: true,
  },
  {
    value: '~12s',
    label: '平均跨链时间',
    change: '快速确认',
    positive: true,
  },
]

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[rgba(255,255,255,0.07)]
                    border border-[rgba(255,255,255,0.07)] rounded-2xl overflow-hidden mb-8">
      {STATS.map((stat, i) => (
        <div key={i} className="bg-surface px-5 py-4">
          <div className="text-2xl font-bold tracking-tight mb-0.5">{stat.value}</div>
          <div className="text-xs text-[#6b7280]">{stat.label}</div>
          <div className={`text-xs mt-1 ${stat.positive ? 'text-success' : 'text-danger'}`}>
            {stat.change}
          </div>
        </div>
      ))}
    </div>
  )
}
