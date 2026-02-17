'use client'

import { useQuery } from '@tanstack/react-query'

// LayerZero Scan V2 API
// https://docs.layerzero.network/v2/developers/evm/technical-reference/lz-scan

const LZ_SCAN_BASE = 'https://scan.layerzero-api.com/v1'

export interface LZScanMessage {
  srcTxHash: string
  dstTxHash?: string
  srcUaAddress: string
  dstUaAddress: string
  srcChainId: number
  dstChainId: number
  srcBlockNumber: number
  dstBlockNumber?: number
  srcBlockTimestamp: number
  status: {
    name: 'INFLIGHT' | 'DELIVERED' | 'FAILED' | 'BLOCKED'
    message?: string
  }
  guid: string
  nonce: number
  srcEid: number
  dstEid: number
}

export interface LZScanResponse {
  data: LZScanMessage[]
  total: number
  page: number
  size: number
}

// ─── Fetch messages for a transaction hash ────────────────────────────────────

export async function fetchMessagesByTxHash(txHash: string): Promise<LZScanMessage[]> {
  const res = await fetch(`${LZ_SCAN_BASE}/messages/tx/${txHash}`, {
    headers: { 'Accept': 'application/json' },
  })
  if (!res.ok) throw new Error(`LZScan API error: ${res.status}`)
  const json: LZScanResponse = await res.json()
  return json.data ?? []
}

// ─── Fetch messages by address ────────────────────────────────────────────────

export async function fetchMessagesByAddress(
  address: string,
  page = 1,
  size = 20
): Promise<LZScanResponse> {
  const params = new URLSearchParams({ address, page: String(page), size: String(size) })
  const res = await fetch(`${LZ_SCAN_BASE}/messages?${params}`, {
    headers: { 'Accept': 'application/json' },
  })
  if (!res.ok) throw new Error(`LZScan API error: ${res.status}`)
  return res.json()
}

// ─── React Query hooks ────────────────────────────────────────────────────────

export function useLZScanMessage(txHash: string | undefined) {
  return useQuery({
    queryKey: ['lz-scan-tx', txHash],
    queryFn: () => fetchMessagesByTxHash(txHash!),
    enabled: !!txHash,
    refetchInterval: (query) => {
      const messages = query.state.data
      if (!messages?.length) return 5000
      const allDelivered = messages.every(
        (m) => m.status.name === 'DELIVERED' || m.status.name === 'FAILED'
      )
      return allDelivered ? false : 5000
    },
    staleTime: 5000,
  })
}

export function useLZScanAddress(address: string | undefined) {
  return useQuery({
    queryKey: ['lz-scan-address', address],
    queryFn: () => fetchMessagesByAddress(address!),
    enabled: !!address,
    refetchInterval: 30_000,
    staleTime: 15_000,
  })
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getLZScanUrl(txHash: string): string {
  return `https://layerzeroscan.com/tx/${txHash}`
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'DELIVERED': return 'text-success'
    case 'INFLIGHT': return 'text-warn'
    case 'FAILED': return 'text-danger'
    case 'BLOCKED': return 'text-danger'
    default: return 'text-text-dim'
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'DELIVERED': return '✓ 已到账'
    case 'INFLIGHT': return '⟳ 传输中'
    case 'FAILED': return '✕ 失败'
    case 'BLOCKED': return '⚠ 已阻止'
    default: return '? 未知'
  }
}
