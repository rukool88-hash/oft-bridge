'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  useAccount,
  usePublicClient,
  useWalletClient,
  useSwitchChain,
  useReadContract,
} from 'wagmi'
import { parseUnits, formatUnits, maxUint256 } from 'viem'
import type { Address } from 'viem'
import { toast } from 'react-hot-toast'
import type { BridgeQuote, BridgeTx, SendParam } from '@/types'
import { OFT_ABI, ERC20_ABI } from '@/lib/contracts/abi'
import {
  buildSendParam,
  formatTokenAmount,
  estimateBridgeTime,
  isAdapterToken,
  getOFTAddress,
  getUnderlyingTokenAddress,
} from '@/lib/contracts/oft'
import { getTokenBySymbol } from '@/config/tokens'
import { getChainByEid } from '@/config/chains'
import { useBridgeStore } from '@/store/bridge'

type BridgeStep = 'idle' | 'approving' | 'quoting' | 'sending' | 'submitted'

export function useBridge() {
  const { address, chainId } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const { switchChainAsync } = useSwitchChain()

  const {
    fromChainEid,
    toChainEid,
    selectedToken: tokenSymbol,
    amountIn,
    slippage,
    addTransaction,
    updateTransactionStatus,
  } = useBridgeStore()

  const [quote, setQuote] = useState<BridgeQuote | null>(null)
  const [step, setStep] = useState<BridgeStep>('idle')
  const [error, setError] = useState<string | null>(null)

  const token = getTokenBySymbol(tokenSymbol)
  const fromChain = getChainByEid(fromChainEid)
  const oftAddress = token ? getOFTAddress(token, fromChainEid) : undefined
  const underlyingAddress = token ? getUnderlyingTokenAddress(token, fromChainEid) : undefined
  const needsApproval = token ? isAdapterToken(token, fromChainEid) : false

  // ─── Parse amount ─────────────────────────────────────────────────────────
  const amountLD = token && amountIn
    ? (() => { try { return parseUnits(amountIn, token.decimals) } catch { return BigInt(0) } })()
    : BigInt(0)

  // ─── ERC-20 allowance ─────────────────────────────────────────────────────
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: underlyingAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && oftAddress ? [address, oftAddress] : undefined,
    query: { enabled: !!address && !!oftAddress && needsApproval },
  })

  const hasAllowance = !needsApproval || (allowance !== undefined && allowance >= amountLD)

  // ─── Token balance ────────────────────────────────────────────────────────
  const { data: balance } = useReadContract({
    address: underlyingAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!underlyingAddress },
  })

  const balanceFormatted = balance && token
    ? formatTokenAmount(balance, token.decimals, 4)
    : '0'

  // ─── Quote ────────────────────────────────────────────────────────────────
  const fetchQuote = useCallback(async () => {
    if (!token || !address || !oftAddress || amountLD === BigInt(0) || !publicClient) return

    setStep('quoting')
    setError(null)

    try {
      const sendParam: SendParam = buildSendParam({
        dstEid: toChainEid,
        recipient: address,
        amountLD,
        slippageBps: slippage,
      })

      const result = await publicClient.readContract({
        address: oftAddress,
        abi: OFT_ABI,
        functionName: 'quoteSend',
        args: [sendParam, false],
      })

      const msgFee = result as { nativeFee: bigint; lzTokenFee: bigint }
      const ethPriceUSD = 3400
      const nativeFeeUSD = Number(formatUnits(msgFee.nativeFee, 18)) * ethPriceUSD
      const minAmountLD = (amountLD * BigInt(10_000 - slippage)) / BigInt(10000)

      setQuote({
        nativeFee: msgFee.nativeFee,
        nativeFeeUSD,
        lzTokenFee: msgFee.lzTokenFee,
        minDstGas: BigInt(200000),
        estimatedTimeSeconds: estimateBridgeTime(fromChainEid, toChainEid),
        exchangeRate: 1,
        amountIn: amountLD,
        amountOut: minAmountLD,
        refundAddress: address,
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to get quote')
    } finally {
      setStep('idle')
    }
  }, [token, address, oftAddress, amountLD, publicClient, toChainEid, fromChainEid, slippage])

  useEffect(() => {
    if (amountLD > BigInt(0)) {
      const timer = setTimeout(fetchQuote, 600)
      return () => clearTimeout(timer)
    } else {
      setQuote(null)
    }
  }, [amountLD, fromChainEid, toChainEid, tokenSymbol, fetchQuote])

  // ─── Approve ──────────────────────────────────────────────────────────────
  const approve = useCallback(async () => {
    if (!walletClient || !underlyingAddress || !oftAddress || !address) {
      toast.error('请先连接钱包')
      return
    }

    setStep('approving')
    const toastId = toast.loading('等待授权确认...')

    try {
      if (chainId !== fromChain?.id) {
        await switchChainAsync({ chainId: fromChain!.id })
      }

      const hash = await walletClient.writeContract({
        address: underlyingAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [oftAddress, maxUint256],
      })

      toast.loading('授权交易处理中...', { id: toastId })
      await publicClient!.waitForTransactionReceipt({ hash })
      await refetchAllowance()
      toast.success('授权成功！', { id: toastId })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '授权失败'
      toast.error(msg, { id: toastId })
      setError(msg)
    } finally {
      setStep('idle')
    }
  }, [walletClient, underlyingAddress, oftAddress, address, chainId, fromChain, switchChainAsync, publicClient, refetchAllowance])

  // ─── Send ─────────────────────────────────────────────────────────────────
  const send = useCallback(async () => {
    if (!walletClient || !oftAddress || !quote || !address || !token) return

    setStep('sending')
    const toastId = toast.loading('等待钱包签名...')

    try {
      if (chainId !== fromChain?.id) {
        toast.loading('切换链中...', { id: toastId })
        await switchChainAsync({ chainId: fromChain!.id })
      }

      const sendParam: SendParam = buildSendParam({
        dstEid: toChainEid,
        recipient: address,
        amountLD,
        slippageBps: slippage,
      })

      toast.loading('发送跨链交易...', { id: toastId })

      const hash = await walletClient.writeContract({
        address: oftAddress,
        abi: OFT_ABI,
        functionName: 'send',
        args: [
          sendParam,
          { nativeFee: quote.nativeFee, lzTokenFee: BigInt(0) },
          address,
        ],
        value: quote.nativeFee,
      })

      toast.loading('等待交易确认...', { id: toastId })
      const receipt = await publicClient!.waitForTransactionReceipt({ hash })
      const guid = (receipt.logs[0]?.topics[1] ?? '0x') as string

      const tx: BridgeTx = {
        id: hash,
        srcChainEid: fromChainEid,
        dstChainEid: toChainEid,
        tokenSymbol,
        amountIn: formatTokenAmount(amountLD, token.decimals, 4),
        amountOut: formatTokenAmount(quote.amountOut, token.decimals, 4),
        sender: address,
        recipient: address,
        srcTxHash: hash,
        status: 'inflight',
        timestamp: Date.now(),
        guid,
      }

      addTransaction(tx)
      setStep('submitted')

      toast.success(
        `跨链成功！${tx.amountIn} ${tokenSymbol} 已从 ${fromChain?.name} 发出`,
        { id: toastId, duration: 6000 }
      )

      // Poll for delivery
      let attempts = 0
      const interval = setInterval(async () => {
        attempts++
        if (attempts > 60) { clearInterval(interval); return }
        try {
          const res = await fetch(`https://scan.layerzero-api.com/v1/messages/tx/${hash}`)
          const data = await res.json()
          const status = data?.data?.[0]?.status?.name
          if (status === 'DELIVERED') {
            updateTransactionStatus(hash, 'delivered')
            clearInterval(interval)
            toast.success(`${tokenSymbol} 已成功到达 ${getChainByEid(toChainEid)?.name}！`)
          } else if (status === 'FAILED') {
            updateTransactionStatus(hash, 'failed')
            clearInterval(interval)
          }
        } catch { /* retry silently */ }
      }, 5000)

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '跨链交易失败'
      toast.error(msg, { id: toastId })
      setError(msg)
      setStep('idle')
    }
  }, [walletClient, oftAddress, quote, address, token, chainId, fromChain, switchChainAsync,
      toChainEid, amountLD, slippage, publicClient, fromChainEid, tokenSymbol,
      addTransaction, updateTransactionStatus])

  return {
    quote,
    step,
    error,
    balanceFormatted,
    hasAllowance,
    needsApproval,
    canBridge: !!address && !!quote && amountLD > BigInt(0) && step === 'idle',
    approve,
    send,
    fetchQuote,
  }
}
