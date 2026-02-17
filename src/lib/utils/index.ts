import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── className utility ────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Address formatting ───────────────────────────────────────────────────────

export function truncateAddress(address: string, start = 6, end = 4): string {
  if (!address) return ''
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export function truncateHash(hash: string, start = 10, end = 6): string {
  if (!hash) return ''
  return `${hash.slice(0, start)}...${hash.slice(-end)}`
}

// ─── Number formatting ────────────────────────────────────────────────────────

export function formatNumber(value: number, decimals = 2): string {
  if (value === 0) return '0'
  if (value < 0.001) return value.toExponential(2)
  if (value < 1) return value.toFixed(4)
  if (value < 1_000) return value.toFixed(decimals)
  if (value < 1_000_000) return `${(value / 1_000).toFixed(2)}K`
  if (value < 1_000_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  return `${(value / 1_000_000_000).toFixed(2)}B`
}

export function formatUSD(value: number): string {
  if (value === 0) return '$0.00'
  if (value < 0.01) return `<$0.01`
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `~${seconds}s`
  const minutes = Math.floor(seconds / 60)
  return `~${minutes}m`
}

// ─── Date formatting ──────────────────────────────────────────────────────────

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s 前`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  return `${days}天前`
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function isValidAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address)
}

export function isValidAmount(amount: string): boolean {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0
}

// ─── Copy to clipboard ───────────────────────────────────────────────────────

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
