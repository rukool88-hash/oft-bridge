# OFT Bridge — LayerZero Omnichain

支持所有 LayerZero OFT 代币的多链跨链桥，基于 LayerZero V2 协议构建。

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| Web3 连接 | wagmi v2 + viem v2 |
| 钱包 UI | RainbowKit v2 |
| 状态管理 | Zustand + React Query |
| 样式 | Tailwind CSS v3 |
| 动画 | Framer Motion |
| 跨链协议 | LayerZero V2 OFT Standard |

## 功能

- ✅ 支持 14+ 条主流 EVM 链（Ethereum、Arbitrum、Base、BNB Chain 等）
- ✅ 支持 12+ 个热门 OFT 代币（USDC、USDT、WETH、ARB、STG、ZRO 等）
- ✅ 实时链上报价（`quoteSend`）
- ✅ 自动处理 `OFTAdapter` 授权流程
- ✅ 实时跟踪跨链消息状态（集成 LayerZero Scan API）
- ✅ 交易历史记录（本地持久化）
- ✅ 多链钱包支持（MetaMask、WalletConnect、Coinbase、Rainbow 等）
- ✅ 响应式移动端布局

## 快速开始

### 1. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入：
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` — 从 [WalletConnect Cloud](https://cloud.walletconnect.com) 获取

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx          # 根布局（Providers）
│   ├── page.tsx            # Bridge 主页
│   ├── tokens/page.tsx     # 代币列表
│   ├── chains/page.tsx     # 链信息
│   └── history/page.tsx    # 交易历史
│
├── components/
│   ├── bridge/
│   │   ├── BridgeCard.tsx      # 核心跨链卡片
│   │   ├── ChainSelector.tsx   # 链选择器（带搜索）
│   │   ├── TokenSelector.tsx   # 代币选择器（带筛选）
│   │   ├── QuotePanel.tsx      # 报价展示
│   │   └── TxHistory.tsx       # 交易历史
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Providers.tsx
│   ├── tokens/
│   │   └── TokenList.tsx
│   ├── chains/
│   │   └── ChainGrid.tsx
│   └── ui/
│       └── StatsBar.tsx
│
├── config/
│   ├── chains.ts           # 链配置 + LayerZero EID 映射
│   ├── tokens.ts           # OFT 代币注册表
│   └── wagmi.ts            # wagmi + RainbowKit 配置
│
├── lib/
│   ├── contracts/
│   │   ├── abi.ts          # OFT V2 + ERC-20 ABI
│   │   └── oft.ts          # quoteSend、buildSendParam 等工具函数
│   ├── hooks/
│   │   ├── useBridge.ts    # 核心 Bridge Hook（quote → approve → send）
│   │   ├── useLZScan.ts    # LayerZero Scan API 集成
│   │   └── usePrices.ts    # CoinGecko 实时价格
│   └── utils/
│       └── index.ts        # cn、格式化等工具
│
├── store/
│   └── bridge.ts           # Zustand 全局状态
│
└── types/
    └── index.ts            # TypeScript 类型定义
```

## 添加新代币

编辑 `src/config/tokens.ts`，在 `OFT_TOKENS` 数组中新增条目：

```typescript
{
  symbol: 'YOUR_TOKEN',
  name: '代币名称',
  icon: '🔥',
  description: '代币描述',
  coingeckoId: 'your-token-coingecko-id',
  decimals: 18,
  tags: ['defi'],
  deployments: [
    { chainEid: 30101, address: '0x...', oftVersion: 'OFT' },
    { chainEid: 30110, address: '0x...', oftVersion: 'OFT' },
  ],
}
```

## 添加新链

编辑 `src/config/chains.ts`，在 `SUPPORTED_CHAINS` 数组中新增条目，并在 `src/config/wagmi.ts` 中添加对应 wagmi chain。

## 生产部署

```bash
npm run build
npm run start
```

或部署到 Vercel：

```bash
npx vercel --prod
```

## 注意事项

- 本项目仅支持 **EVM 兼容链**（LayerZero V2）
- 所有代币地址应通过官方渠道验证，请勿使用未经验证的合约地址
- 建议在主网使用前在测试网（Sepolia、Arbitrum Sepolia 等）充分测试
- LayerZero DVN 费用实时波动，生产环境应增加充足的费用缓冲

## 参考资料

- [LayerZero V2 文档](https://docs.layerzero.network/v2)
- [OFT 标准文档](https://docs.layerzero.network/v2/developers/evm/oft/quickstart)
- [LayerZero Scan](https://layerzeroscan.com)
- [已部署合约地址](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts)
