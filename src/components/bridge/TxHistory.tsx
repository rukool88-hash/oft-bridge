'use client'

import { ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useBridgeStore } from '@/store/bridge'
import { getChainByEid } from '@/config/chains'
import { getTokenBySymbol } from '@/config/tokens'
import { getLZScanUrl, getStatusColor, getStatusLabel, useLZScanMessage } from '@/lib/hooks/useLZScan'
import { truncateHash, timeAgo, copyToClipboard, cn } from '@/lib/utils'
import type { BridgeTx } from '@/types'

// ─── Single TX row ─────────────────────────────────────────────────────────────

function TxRow({ tx }: { tx: BridgeTx }) {
  const [copied, setCopied] = useState(false)
  const srcChain = getChainByEid(tx.srcChainEid)
  const dstChain = getChainByEid(tx.dstChainEid)
  const token = getTokenBySymbol(tx.tokenSymbol)

  // Poll LZScan for live status
  const { data: lzMessages } = useLZScanMessage(
    tx.status === 'inflight' ? tx.srcTxHash : undefined
  )
  const lzStatus = lzMessages?.[0]?.status?.name ?? tx.status.toUpperCase()

  const handleCopy = async () => {
    await copyToClipboard(tx.srcTxHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card-sm p-3.5">
      {/* Top row */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>{srcChain?.logo}</span>
          <span className="text-[#6b7280] text-xs">→</span>
          <span>{dstChain?.logo}</span>
          <span className="text-[#9ca3af] font-medium text-xs">
            {srcChain?.shortName} → {dstChain?.shortName}
          </span>
        </div>
        <StatusBadge status={lzStatus} />
      </div>

      {/* Amount */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-sm">{token?.icon}</span>
        <span className="font-bold">
          {tx.amountIn} {tx.tokenSymbol}
        </span>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between text-[11px] text-[#6b7280]">
        <span>{timeAgo(tx.timestamp)}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-[#9ca3af] transition-colors"
          >
            {copied ? <Check size={10} className="text-success" /> : <Copy size={10} />}
            <span className="font-mono">{truncateHash(tx.srcTxHash, 8, 6)}</span>
          </button>
          <a
            href={getLZScanUrl(tx.srcTxHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const label = getStatusLabel(status)
  const colorClass = getStatusColor(status)
  const bgClass =
    status === 'DELIVERED' ? 'bg-success/10' :
    status === 'INFLIGHT' ? 'bg-warn/10' :
    status === 'FAILED' ? 'bg-danger/10' : 'bg-white/5'

  return (
    <span className={cn('px-2 py-0.5 rounded-md text-[11px] font-bold', bgClass, colorClass)}>
      {label}
    </span>
  )
}

// ─── Transaction history list ─────────────────────────────────────────────────

export function TxHistory() {
  const { transactions, clearTransactions } = useBridgeStore()

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="section-label mb-0">最近交易</div>
        {transactions.length > 0 && (
          <button
            onClick={clearTransactions}
            className="text-[11px] text-[#6b7280] hover:text-[#9ca3af] transition-colors"
          >
            清空
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="card-sm p-6 text-center text-[#6b7280] text-sm">
          <div className="text-2xl mb-2">🌐</div>
          <div>暂无跨链记录</div>
          <div className="text-xs mt-1">完成第一笔跨链后将在此显示</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {transactions.slice(0, 10).map((tx) => (
            <TxRow key={tx.id} tx={tx} />
          ))}
          {transactions.length > 10 && (
            <div className="text-center text-xs text-[#6b7280] py-2">
              + {transactions.length - 10} 条历史记录
            </div>
          )}
        </div>
      )}
    </div>
  )
}
