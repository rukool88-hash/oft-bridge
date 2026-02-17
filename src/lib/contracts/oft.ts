import { pad, parseUnits, type Address } from 'viem'
import type { SendParam } from '@/types'
import type { OFTToken } from '@/types'
import { getDeploymentByChain } from '@/config/tokens'

// ─── Address encoding ─────────────────────────────────────────────────────────

export function addressToBytes32(address: Address): `0x${string}` {
  return pad(address, { size: 32 }) as `0x${string}`
}

// ─── Options encoding ─────────────────────────────────────────────────────────

/**
 * Build executor options for standard OFT send.
 * @param gasLimit - gas for lzReceive on dst chain (default 200000)
 */
export function buildExecutorOptions(gasLimit: bigint = BigInt(200000)): `0x${string}` {
  const workerID = 1
  const gasLimitHex = gasLimit.toString(16).padStart(32, '0')
  return `0x0003${workerID.toString(16).padStart(2, '0')}01${gasLimitHex}` as `0x${string}`
}

// ─── SendParam builder ────────────────────────────────────────────────────────

export function buildSendParam(params: {
  dstEid: number
  recipient: Address
  amountLD: bigint
  slippageBps?: number
  gasLimit?: bigint
}): SendParam {
  const {
    dstEid,
    recipient,
    amountLD,
    slippageBps = 50,
    gasLimit = BigInt(200000),
  } = params

  const minAmountLD = (amountLD * BigInt(10000 - slippageBps)) / BigInt(10000)

  return {
    dstEid,
    to: addressToBytes32(recipient),
    amountLD,
    minAmountLD,
    extraOptions: buildExecutorOptions(gasLimit),
    composeMsg: '0x',
    oftCmd: '0x',
  }
}

// ─── Amount helpers ───────────────────────────────────────────────────────────

export function parseTokenAmount(amount: string, decimals: number): bigint {
  try {
    return parseUnits(amount, decimals)
  } catch {
    return BigInt(0)
  }
}

export function formatTokenAmount(
  amount: bigint,
  decimals: number,
  displayDecimals = 6
): string {
  if (amount === BigInt(0)) return '0'
  const divisor = BigInt(10 ** decimals)
  const whole = amount / divisor
  const fractional = amount % divisor
  const fractionalStr = fractional
    .toString()
    .padStart(decimals, '0')
    .slice(0, displayDecimals)
  const trimmed = fractionalStr.replace(/0+$/, '')
  return trimmed ? `${whole}.${trimmed}` : whole.toString()
}

// ─── Bridge time estimate ─────────────────────────────────────────────────────

export function estimateBridgeTime(srcEid: number, dstEid: number): number {
  const blockTimes: Record<number, number> = {
    30101: 12,
    30110: 0.25,
    30111: 2,
    30109: 2,
    30102: 3,
    30106: 2,
    30184: 2,
    30214: 3,
    30183: 2,
    30181: 2,
    30165: 1,
  }
  const srcBlock = blockTimes[srcEid] ?? 3
  const dstBlock = blockTimes[dstEid] ?? 3
  return Math.round(Math.max(srcBlock * 10, 10) + dstBlock * 5 + 5)
}

// ─── Token deployment checks ──────────────────────────────────────────────────

export function isAdapterToken(token: OFTToken, eid: number): boolean {
  return getDeploymentByChain(token, eid)?.oftVersion === 'OFTAdapter'
}

export function getOFTAddress(token: OFTToken, eid: number): Address | undefined {
  return getDeploymentByChain(token, eid)?.address
}

export function getUnderlyingTokenAddress(
  token: OFTToken,
  eid: number
): Address | undefined {
  const dep = getDeploymentByChain(token, eid)
  return dep?.underlyingToken ?? dep?.address
}
