'use client'

import { OFT_TOKENS } from '@/config/tokens'
import { useTokenPrices, formatPrice } from '@/lib/hooks/usePrices'
import { useBridgeStore } from '@/store/bridge'
import { cn } from '@/lib/utils'

export function TokenList() {
  const { data: prices } = useTokenPrices()
  const { selectedToken, setToken } = useBridgeStore()

  return (
    <div>
      <div className="section-label">热门 OFT 代币</div>
      <div className="flex flex-col gap-2">
        {OFT_TOKENS.slice(0, 8).map((token) => {
          const price = prices?.[token.symbol]
          const isSelected = token.symbol === selectedToken
          return (
            <button
              key={token.symbol}
              onClick={() => setToken(token.symbol)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl text-left',
                'border transition-all duration-150',
                isSelected
                  ? 'border-accent/50 bg-accent/5'
                  : 'bg-surface border-[rgba(255,255,255,0.07)] hover:border-[rgba(99,179,237,0.3)] hover:bg-surface2'
              )}
            >
              <span className="text-2xl w-8 text-center">{token.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{token.name}</div>
                <div className="text-[11px] text-[#6b7280] mt-0.5">
                  {token.symbol} · {token.deployments.length} 条链
                </div>
              </div>
              <div className="text-right shrink-0">
                {price ? (
                  <>
                    <div className="text-sm font-semibold">{formatPrice(price.usd)}</div>
                    {price.usd_24h_change !== undefined && (
                      <div className={cn(
                        'text-[11px] mt-0.5',
                        price.usd_24h_change >= 0 ? 'text-success' : 'text-danger'
                      )}>
                        {price.usd_24h_change >= 0 ? '+' : ''}
                        {price.usd_24h_change.toFixed(2)}%
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-[#6b7280]">—</div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
