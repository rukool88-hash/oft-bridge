'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Check } from 'lucide-react'
import { SUPPORTED_CHAINS } from '@/config/chains'
import { getTokensForChain } from '@/config/tokens'
import { cn } from '@/lib/utils'
import type { SupportedChain } from '@/types'

interface ChainSelectorProps {
  selectedEid: number
  excludeEid?: number
  onSelect: (eid: number) => void
  label: string
}

export function ChainSelector({ selectedEid, excludeEid, onSelect, label }: ChainSelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selectedChain = SUPPORTED_CHAINS.find((c) => c.eid === selectedEid)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return SUPPORTED_CHAINS.filter(
      (c) =>
        c.eid !== excludeEid &&
        (c.name.toLowerCase().includes(q) ||
          c.shortName.toLowerCase().includes(q) ||
          String(c.eid).includes(q))
    )
  }, [query, excludeEid])

  const handleSelect = useCallback(
    (chain: SupportedChain) => {
      onSelect(chain.eid)
      setOpen(false)
      setQuery('')
    },
    [onSelect]
  )

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left bg-surface2 border border-[rgba(255,255,255,0.07)] rounded-xl p-3
                   hover:border-[rgba(99,179,237,0.4)] transition-colors duration-200 relative"
      >
        <span className="block text-[10px] uppercase tracking-widest text-[#6b7280] mb-1.5 font-semibold">
          {label}
        </span>
        <div className="flex items-center gap-2 pr-6">
          <span className="text-xl leading-none">{selectedChain?.logo}</span>
          <div>
            <div className="text-sm font-semibold">{selectedChain?.name ?? '选择链'}</div>
            <div className="text-[11px] text-[#6b7280] mt-0.5">EID: {selectedChain?.eid}</div>
          </div>
        </div>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-xs">▾</span>
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
                <h3 className="font-bold text-base">选择{label === 'From' ? '源' : '目标'}链</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-lg bg-surface2 border border-[rgba(255,255,255,0.07)]
                             flex items-center justify-center text-[#9ca3af]
                             hover:text-white hover:border-[rgba(99,179,237,0.3)] transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Search */}
              <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.07)]">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="搜索链名称或 EID..."
                    className="w-full bg-surface2 border border-[rgba(255,255,255,0.07)] rounded-xl
                               pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#6b7280]
                               focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
              </div>

              {/* List */}
              <div className="overflow-y-auto p-3 flex flex-col gap-1">
                {filtered.length === 0 && (
                  <div className="text-center text-[#6b7280] text-sm py-8">未找到匹配的链</div>
                )}
                {filtered.map((chain) => {
                  const tokenCount = getTokensForChain(chain.eid).length
                  const isSelected = chain.eid === selectedEid
                  return (
                    <button
                      key={chain.eid}
                      onClick={() => handleSelect(chain)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left',
                        'border transition-all duration-150',
                        isSelected
                          ? 'border-accent/50 bg-accent/5'
                          : 'border-transparent hover:bg-surface2 hover:border-[rgba(255,255,255,0.07)]'
                      )}
                    >
                      <span className="text-2xl leading-none w-8 text-center">{chain.logo}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{chain.name}</div>
                        <div className="text-[11px] text-[#6b7280] mt-0.5">
                          EID: {chain.eid} · {tokenCount} 个 OFT 代币
                        </div>
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
