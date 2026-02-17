'use client'

import { Navbar } from '@/components/layout/Navbar'
import { TxHistory } from '@/components/bridge/TxHistory'
import { useBridgeStore } from '@/store/bridge'
import { getChainByEid } from '@/config/chains'
import { getTokenBySymbol } from '@/config/tokens'
import { getLZScanUrl, getStatusLabel, getStatusColor } from '@/lib/hooks/useLZScan'
import { truncateHash, timeAgo, cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'

export default function HistoryPage() {
  const { transactions } = useBridgeStore()

  return (
    <div className="min-h-screen bg-ambient">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">跨链历史</h1>
          <p className="text-[#9ca3af]">
            {transactions.length > 0
              ? `共 ${transactions.length} 条跨链记录`
              : '暂无跨链记录'}
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">🌐</div>
            <div className="font-bold text-lg mb-2">暂无跨链记录</div>
            <div className="text-[#9ca3af] text-sm">完成第一笔跨链后将在此显示详细记录</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.map((tx) => {
              const srcChain = getChainByEid(tx.srcChainEid)
              const dstChain = getChainByEid(tx.dstChainEid)
              const token = getTokenBySymbol(tx.tokenSymbol)
              const statusLabel = getStatusLabel(tx.status.toUpperCase())
              const statusColor = getStatusColor(tx.status.toUpperCase())

              return (
                <div key={tx.id} className="card p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{token?.icon}</span>
                      <div>
                        <div className="font-bold">
                          {tx.amountIn} {tx.tokenSymbol}
                        </div>
                        <div className="text-sm text-[#9ca3af] mt-0.5">
                          {timeAgo(tx.timestamp)}
                        </div>
                      </div>
                    </div>
                    <span className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-bold',
                      tx.status === 'delivered' ? 'bg-success/10 text-success' :
                      tx.status === 'inflight' ? 'bg-warn/10 text-warn' :
                      tx.status === 'failed' ? 'bg-danger/10 text-danger' : 'bg-white/5 text-[#9ca3af]'
                    )}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 bg-surface2 rounded-xl p-3">
                      <div className="text-[10px] text-[#6b7280] mb-1">FROM</div>
                      <div className="flex items-center gap-1.5">
                        <span>{srcChain?.logo}</span>
                        <span className="font-semibold text-sm">{srcChain?.name}</span>
                      </div>
                    </div>
                    <span className="text-[#6b7280]">→</span>
                    <div className="flex-1 bg-surface2 rounded-xl p-3">
                      <div className="text-[10px] text-[#6b7280] mb-1">TO</div>
                      <div className="flex items-center gap-1.5">
                        <span>{dstChain?.logo}</span>
                        <span className="font-semibold text-sm">{dstChain?.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="font-mono text-[#6b7280]">
                      {truncateHash(tx.srcTxHash, 12, 8)}
                    </div>
                    <a
                      href={getLZScanUrl(tx.srcTxHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-accent hover:underline"
                    >
                      LayerZero Scan
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
