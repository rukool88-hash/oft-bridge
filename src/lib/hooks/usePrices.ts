'use client'

import { useQuery } from '@tanstack/react-query'
import { OFT_TOKENS } from '@/config/tokens'
import type { TokenPrice } from '@/types'

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

export async function fetchTokenPrices(coingeckoIds: string[]): Promise<Record<string, TokenPrice>> {
  if (!coingeckoIds.length) return {}

  const ids = coingeckoIds.join(',')
  const res = await fetch(
    `${COINGECKO_BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
    { next: { revalidate: 60 } }
  )

  if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`)
  const data = await res.json()

  return Object.fromEntries(
    coingeckoIds.map((id) => {
      const token = OFT_TOKENS.find((t) => t.coingeckoId === id)
      return [
        token?.symbol ?? id,
        {
          symbol: token?.symbol ?? id,
          usd: data[id]?.usd ?? 0,
          usd_24h_change: data[id]?.usd_24h_change,
          last_updated: Date.now(),
        } satisfies TokenPrice,
      ]
    })
  )
}

export function useTokenPrices() {
  const ids = OFT_TOKENS.filter((t) => t.coingeckoId).map((t) => t.coingeckoId!)

  return useQuery({
    queryKey: ['token-prices', ids],
    queryFn: () => fetchTokenPrices(ids),
    staleTime: 60_000,
    refetchInterval: 60_000,
    initialData: {} as Record<string, TokenPrice>,
  })
}

export function useTokenPrice(symbol: string) {
  const { data: prices } = useTokenPrices()
  return prices?.[symbol]
}

export function formatPrice(price: number): string {
  if (price < 0.001) return `$${price.toFixed(6)}`
  if (price < 1) return `$${price.toFixed(4)}`
  if (price < 100) return `$${price.toFixed(2)}`
  if (price < 10_000) return `$${price.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return `$${(price / 1000).toFixed(1)}K`
}
