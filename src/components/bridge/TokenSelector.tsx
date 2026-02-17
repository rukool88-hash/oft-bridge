'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Check } from 'lucide-react'
import { OFT_TOKENS, getTokensForChain } from '@/config/tokens'
import { useTokenPrices, formatPrice } from '@/lib/hooks/usePrices'
import { cn } from '@/lib/utils'
import type { OFTToken } from '@/types'

interface TokenSelectorProps {
  selectedSymbol: string
  chainEid?: number  // filter tokens available on this chain
  onSelect: (symbol: string) => void
}

const TAGS = ['全部', 'stablecoin', 'defi', 'governance', 'infrastructure', 'wrapped']

export function TokenSelector({ selectedSymbol, chainEid, onSelect }: TokenSelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('全部')

  const { data: prices } = useTokenPrices()

  const selectedToken = OFT_TOKENS.find((t) => t.symbol === selectedSymbol)

  const availableTokens = useMemo(() => {
    if (!chainEid) return OFT_TOKENS
    return getTokensForChain(chainEid)
  }, [chainEid])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return availableTokens.filter((t) => {
      const matchesQuery =
        !q ||
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q)
      const matchesTag =
        activeTag === '全部' || t.tags?.includes(activeTag)
      return matchesQuery && matchesTag
    })
  }, [availableTokens, query, activeTag])

  const handleSelect = (token: OFTToken) => {
    onSelect(token.symbol)
    setOpen(false)
    setQuery('')
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-surface border border-[rgba(255,255,255,0.07)] rounded-xl
                   px-3 py-2 shrink-0 hover:border-[rgba(99,179,237,0.3)] transition-colors"
      >
        <span className="text-lg leading-none">{selectedToken?.icon ?? '?'}</span>
        <span className="font-semibold text-sm">{selectedSymbol}</span>
        <span className="text-[#6b7280] text-[10px]">▾</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              className="card w-full max-w-md max-h-[75vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.07)]">
                <h3 className="font-bold text-base">选择 OFT 代币</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-lg bg-surface2 border border-[rgba(255,255,255,0.07)]
                             flex items-center justify-center text-[#9ca3af] hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Search */}
              <div className="px-4 pt-3 pb-2 border-b border-[rgba(255,255,255,0.07)]">
                <div className="relative mb-3">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="搜索代币符号或名称..."
                    className="w-full bg-surface2 border border-[rgba(255,255,255,0.07)] rounded-xl
                               pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#6b7280]
                               focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
                {/* Tag filters */}
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={cn(
                        'shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors',
                        activeTag === tag
                          ? 'bg-accent text-white'
                          : 'bg-surface2 text-[#6b7280] hover:text-white'
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Token list */}
              <div className="overflow-y-auto p-3 flex flex-col gap-1">
                {filtered.length === 0 && (
                  <div className="text-center text-[#6b7280] text-sm py-8">
                    未找到匹配代币
                  </div>
                )}
                {filtered.map((token) => {
                  const price = prices?.[token.symbol]
                  const isSelected = token.symbol === selectedSymbol
                  return (
                    <button
                      key={token.symbol}
                      onClick={() => handleSelect(token)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left',
                        'border transition-all duration-150',
                        isSelected
                          ? 'border-accent/50 bg-accent/5'
                          : 'border-transparent hover:bg-surface2 hover:border-[rgba(255,255,255,0.07)]'
                      )}
                    >
                      <span className="text-2xl w-8 text-center">{token.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{token.symbol}</div>
                        <div className="text-[11px] text-[#6b7280] mt-0.5">
                          {token.name} · {token.deployments.length} 条链
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {price && (
                          <div className="text-sm font-semibold">{formatPrice(price.usd)}</div>
                        )}
                        {price?.usd_24h_change !== undefined && (
                          <div className={cn(
                            'text-[11px] mt-0.5',
                            price.usd_24h_change >= 0 ? 'text-success' : 'text-danger'
                          )}>
                            {price.usd_24h_change >= 0 ? '+' : ''}{price.usd_24h_change.toFixed(2)}%
                          </div>
                        )}
                      </div>
                      {isSelected && <Check size={16} className="text-accent shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
