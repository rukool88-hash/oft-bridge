'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Info, Zap } from 'lucide-react'
import type { BridgeQuote } from '@/types'
import { formatUSD, formatTime } from '@/lib/utils'
import { formatTokenAmount } from '@/lib/contracts/oft'
import { getTokenBySymbol } from '@/config/tokens'

interface QuotePanelProps {
  quote: BridgeQuote | null
  tokenSymbol: string
  fromChainName?: string
  toChainName?: string
}

export function QuotePanel({ quote, tokenSymbol, fromChainName, toChainName }: QuotePanelProps) {
  const token = getTokenBySymbol(tokenSymbol)
  const decimals = token?.decimals ?? 18

  return (
    <AnimatePresence>
      {quote && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="card-surface2 p-4 text-sm flex flex-col gap-2.5">

            {/* Route */}
            <div className="flex items-center justify-between">
              <span className="text-[#9ca3af]">跨链路由</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-gradient-brand flex items-center justify-center">
                  <Zap size={9} className="text-white" />
                </div>
                <span className="font-medium">LayerZero V2 DVN</span>
              </div>
            </div>

            {/* Route visual */}
            <div className="flex items-center gap-2 py-1">
              <span className="text-[11px] text-[#6b7280]">{fromChainName}</span>
              <div className="flex-1 border-t border-dashed border-[rgba(255,255,255,0.1)] relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] text-[#9ca3af] whitespace-nowrap">
                  {formatTime(quote.estimatedTimeSeconds)}
                </div>
              </div>
              <span className="text-[11px] text-[#6b7280]">{toChainName}</span>
            </div>

            <div className="border-t border-[rgba(255,255,255,0.06)]" />

            {/* Fees */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[#9ca3af]">
                LayerZero Fee
                <Info size={11} className="text-[#6b7280]" />
              </div>
              <span className="font-medium">{formatUSD(quote.nativeFeeUSD)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#9ca3af]">目标链 Gas</span>
              <span className="font-medium text-[#9ca3af]">已包含</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#9ca3af]">汇率</span>
              <span className="font-medium">1 {tokenSymbol} = 1 {tokenSymbol}</span>
            </div>

            <div className="border-t border-[rgba(255,255,255,0.06)]" />

            {/* Net receive */}
            <div className="flex items-center justify-between">
              <span className="font-semibold">实际到账</span>
              <span className="font-bold text-success">
                {formatTokenAmount(quote.amountOut, decimals, 6)} {tokenSymbol}
              </span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
