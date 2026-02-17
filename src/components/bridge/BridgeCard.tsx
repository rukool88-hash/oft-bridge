'use client'

import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ArrowLeftRight, Loader2, Settings } from 'lucide-react'
import { ChainSelector } from './ChainSelector'
import { TokenSelector } from './TokenSelector'
import { QuotePanel } from './QuotePanel'
import { useBridgeStore } from '@/store/bridge'
import { useBridge } from '@/lib/hooks/useBridge'
import { getChainByEid } from '@/config/chains'
import { getTokenBySymbol } from '@/config/tokens'
import { formatTokenAmount } from '@/lib/contracts/oft'
import { cn } from '@/lib/utils'

export function BridgeCard() {
  const { isConnected } = useAccount()

  const {
    fromChainEid,
    toChainEid,
    selectedToken,
    amountIn,
    setFromChain,
    setToChain,
    swapChains,
    setToken,
    setAmountIn,
  } = useBridgeStore()

  const {
    quote,
    step,
    balanceFormatted,
    hasAllowance,
    needsApproval,
    canBridge,
    approve,
    send,
  } = useBridge()

  const fromChain = getChainByEid(fromChainEid)
  const toChain = getChainByEid(toChainEid)
  const isLoading = step === 'quoting' || step === 'approving' || step === 'sending'
  const selectedTokenData = getTokenBySymbol(selectedToken)

  const handleMax = useCallback(() => {
    setAmountIn(balanceFormatted)
  }, [balanceFormatted, setAmountIn])

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      if (val === '' || /^\d*\.?\d*$/.test(val)) {
        setAmountIn(val)
      }
    },
    [setAmountIn]
  )

  const bridgeButtonContent = () => {
    if (!isConnected) return null
    if (step === 'approving') return <><Loader2 size={16} className="animate-spin" /> 授权中...</>
    if (step === 'quoting') return <><Loader2 size={16} className="animate-spin" /> 获取报价中...</>
    if (step === 'sending') return <><Loader2 size={16} className="animate-spin" /> 跨链中...</>
    if (step === 'submitted') return '✓ 已提交，等待到账'
    if (!amountIn) return '输入金额'
    if (needsApproval && !hasAllowance) return `授权 ${selectedToken}`
    return `跨链 ${selectedToken}`
  }

  const handleAction = () => {
    if (needsApproval && !hasAllowance) {
      approve()
    } else {
      send()
    }
  }

  return (
    <div className="card w-full">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.07)]">
        <h2 className="font-bold text-base">跨链桥</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-md bg-gradient-brand text-white font-bold">
            LZ V2
          </span>
          <button className="w-8 h-8 rounded-lg bg-surface2 border border-[rgba(255,255,255,0.07)]
                             flex items-center justify-center text-[#9ca3af] hover:text-white transition-colors">
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-4">

        {/* Chain selector row */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2.5 items-center">
          <ChainSelector
            label="From"
            selectedEid={fromChainEid}
            excludeEid={toChainEid}
            onSelect={setFromChain}
          />
          <button
            onClick={swapChains}
            className="w-10 h-10 rounded-full bg-surface2 border border-[rgba(255,255,255,0.07)]
                       flex items-center justify-center text-[#9ca3af] shrink-0
                       hover:border-[rgba(99,179,237,0.4)] hover:text-accent hover:rotate-180
                       transition-all duration-300"
          >
            <ArrowLeftRight size={15} />
          </button>
          <ChainSelector
            label="To"
            selectedEid={toChainEid}
            excludeEid={fromChainEid}
            onSelect={setToChain}
          />
        </div>

        {/* Send amount */}
        <div className="flex flex-col gap-1.5">
          <label className="section-label">发送</label>
          <div className={cn(
            'flex items-center gap-2 bg-surface2 border rounded-xl px-4 py-3.5',
            'transition-colors duration-200',
            'border-[rgba(255,255,255,0.07)] focus-within:border-accent/50'
          )}>
            <TokenSelector
              selectedSymbol={selectedToken}
              chainEid={fromChainEid}
              onSelect={setToken}
            />
            <input
              type="text"
              inputMode="decimal"
              value={amountIn}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="flex-1 bg-transparent border-none outline-none text-right
                         text-xl font-bold placeholder-[#6b7280] min-w-0"
            />
          </div>
          <div className="flex items-center justify-between px-1 text-xs text-[#6b7280]">
            <span>
              余额:{' '}
              <span className="text-[#9ca3af] font-medium">
                {balanceFormatted} {selectedToken}
              </span>
            </span>
            <button
              onClick={handleMax}
              className="px-2 py-0.5 rounded-md bg-accent/15 text-accent text-[11px] font-bold
                         hover:bg-accent/25 transition-colors"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Receive amount */}
        <div className="flex flex-col gap-1.5">
          <label className="section-label">收到（预估）</label>
          <div className="flex items-center gap-2 bg-bg border border-[rgba(255,255,255,0.05)]
                          rounded-xl px-4 py-3.5">
            <div className="flex items-center gap-2 bg-surface border border-[rgba(255,255,255,0.07)]
                            rounded-xl px-3 py-2 shrink-0">
              <span className="text-lg leading-none">
                {selectedTokenData?.icon ?? '?'}
              </span>
              <span className="font-semibold text-sm">{selectedToken}</span>
            </div>
            <div className="flex-1 text-right text-xl font-bold text-[#9ca3af]">
              {quote
                ? formatTokenAmount(quote.amountOut, selectedTokenData?.decimals ?? 18, 6)
                : '—'}
            </div>
          </div>
          <div className="text-xs text-[#6b7280] px-1">
            目标链余额: <span className="text-[#9ca3af] font-medium">0.00 {selectedToken}</span>
          </div>
        </div>

        {/* Quote panel */}
        <QuotePanel
          quote={quote}
          tokenSymbol={selectedToken}
          fromChainName={fromChain?.name}
          toChainName={toChain?.name}
        />

        {/* Action button */}
        {isConnected ? (
          <button
            onClick={handleAction}
            disabled={(!canBridge && step === 'idle') || isLoading}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {bridgeButtonContent()}
          </button>
        ) : (
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button
                onClick={openConnectModal}
                className="btn-primary"
              >
                连接钱包
              </button>
            )}
          </ConnectButton.Custom>
        )}

        {/* Powered by */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#6b7280]">
          <span>Powered by</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-black text-white
                           bg-gradient-to-r from-[#6E3EFF] to-[#4B7BFF]">
            LayerZero
          </span>
          <span>OFT Standard</span>
        </div>

      </div>
    </div>
  )
}
