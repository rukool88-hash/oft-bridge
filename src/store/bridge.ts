import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { BridgeTx, BridgeState } from '@/types'

interface BridgeStore extends BridgeState {
  transactions: BridgeTx[]
  setFromChain: (eid: number) => void
  setToChain: (eid: number) => void
  swapChains: () => void
  setToken: (symbol: string) => void
  setAmountIn: (amount: string) => void
  setRecipient: (address: string) => void
  setSlippage: (bps: number) => void
  addTransaction: (tx: BridgeTx) => void
  updateTransactionStatus: (id: string, status: BridgeTx['status'], dstTxHash?: `0x${string}`) => void
  clearTransactions: () => void
}

export const useBridgeStore = create<BridgeStore>()(
  persist(
    (set, get) => ({
      fromChainEid: 30101,
      toChainEid: 30110,
      selectedToken: 'USDC',
      amountIn: '',
      recipient: '',
      slippage: 50,
      transactions: [],

      setFromChain: (eid) => {
        const { toChainEid } = get()
        if (eid === toChainEid) {
          set({ fromChainEid: eid, toChainEid: get().fromChainEid })
        } else {
          set({ fromChainEid: eid })
        }
      },

      setToChain: (eid) => {
        const { fromChainEid } = get()
        if (eid === fromChainEid) {
          set({ toChainEid: eid, fromChainEid: get().toChainEid })
        } else {
          set({ toChainEid: eid })
        }
      },

      swapChains: () => {
        const { fromChainEid, toChainEid } = get()
        set({ fromChainEid: toChainEid, toChainEid: fromChainEid })
      },

      setToken: (symbol) => set({ selectedToken: symbol, amountIn: '' }),
      setAmountIn: (amount) => set({ amountIn: amount }),
      setRecipient: (address) => set({ recipient: address }),
      setSlippage: (bps) => set({ slippage: bps }),

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions].slice(0, 50),
        })),

      updateTransactionStatus: (id, status, dstTxHash) =>
        set((state) => ({
          transactions: state.transactions.map((tx): BridgeTx =>
            tx.id === id
              ? { ...tx, status, ...(dstTxHash ? { dstTxHash } : {}) }
              : tx
          ),
        })),

      clearTransactions: () => set({ transactions: [] }),
    }),
    {
      name: 'oft-bridge-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        fromChainEid: state.fromChainEid,
        toChainEid: state.toChainEid,
        selectedToken: state.selectedToken,
        slippage: state.slippage,
        transactions: state.transactions,
      }),
    }
  )
)
