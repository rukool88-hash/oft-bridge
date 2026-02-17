'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Bridge' },
  { href: '/tokens', label: '代币' },
  { href: '/chains', label: '链' },
  { href: '/history', label: '历史' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 glass border-b border-[rgba(255,255,255,0.07)] bg-bg/85">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-[1.05rem] tracking-tight shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-base">
            ⬡
          </div>
          <span>OmniRoute</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150',
                pathname === href
                  ? 'text-white bg-surface2'
                  : 'text-[#9ca3af] hover:text-white hover:bg-surface2/50'
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Wallet connect */}
        <div className="shrink-0">
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus="avatar"
          />
        </div>
      </div>
    </nav>
  )
}
