'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Swords, ShieldAlert, Coffee, Store, Backpack, Hammer, Trophy, Settings, MoreHorizontal, X, LucideIcon } from 'lucide-react';
import { useGame } from '@/lib/gameContext';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: boolean;
}

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { isLoggedIn, quests } = useGame();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isLoggedIn) return null;

  const hasCompletedQuest = quests.some((q) => q.isCompleted && !q.isClaimed);

  const primaryNav: NavItem[] = [
    { href: '/game', label: 'Herói', icon: User },
    { href: '/game/hunt', label: 'Caçar / Click', icon: Swords },
    { href: '/game/dungeons', label: 'Dungeons', icon: ShieldAlert },
    { href: '/game/taverna', label: 'Taverna', icon: Coffee, badge: hasCompletedQuest },
    { href: '/game/shop', label: 'Mercado', icon: Store }
  ];

  const secondaryNav: NavItem[] = [
    { href: '/game/inventory', label: 'Inventário', icon: Backpack },
    { href: '/game/forge', label: 'Forja', icon: Hammer },
    { href: '/game/ranking', label: 'Ranking', icon: Trophy },
    { href: '/game/settings', label: 'Ajustes', icon: Settings }
  ];

  const allItems: NavItem[] = [...primaryNav, ...secondaryNav];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#060403]/95 border-t border-[#3a2810] backdrop-blur-md py-1.5 px-3 shadow-[0_-8px_24px_rgba(0,0,0,0.9)]">
      {/* Desktop View (≥640px): Show All Items */}
      <div className="hidden sm:flex max-w-4xl mx-auto items-center justify-between gap-1">
        {allItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-all relative ${
                isActive
                  ? 'text-[#ffe082] bg-[#2a1e08] border border-[#816835] shadow-[0_0_12px_rgba(200,151,42,0.3)]'
                  : 'text-[#8a7852] hover:text-[#d4c59a] hover:bg-[#150f08]'
              }`}
            >
              {item.badge && (
                <span className="absolute top-0.5 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#f0a830] scale-110' : ''} transition-transform`} />
              <span className="text-[10px] font-cinzel font-bold tracking-wider uppercase whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Mobile View (<640px): Primary Tabs + Expandable "Mais" Drawer */}
      <div className="flex sm:hidden items-center justify-between gap-1">
        {primaryNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 flex-1 rounded-lg transition-all relative text-center ${
                isActive
                  ? 'text-[#ffe082] bg-[#2a1e08] border border-[#816835]'
                  : 'text-[#8a7852] hover:text-[#d4c59a]'
              }`}
            >
              {item.badge && (
                <span className="absolute top-0.5 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#f0a830] scale-110' : ''}`} />
              <span className="text-[9px] font-cinzel font-bold uppercase truncate max-w-[50px]">{item.label}</span>
            </Link>
          );
        })}

        {/* More Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 flex-1 rounded-lg transition-all text-center ${
            isMenuOpen || secondaryNav.some((i) => pathname === i.href)
              ? 'text-[#ffe082] bg-[#2a1e08] border border-[#816835]'
              : 'text-[#8a7852] hover:text-[#d4c59a]'
          }`}
        >
          {isMenuOpen ? <X className="w-4 h-4 text-amber-400" /> : <MoreHorizontal className="w-4 h-4" />}
          <span className="text-[9px] font-cinzel font-bold uppercase">Mais</span>
        </button>
      </div>

      {/* Expandable Mobile Popover Menu */}
      {isMenuOpen && (
        <div className="sm:hidden absolute bottom-16 right-3 bg-[#150f08] border border-[#816835] rounded-xl p-2 shadow-2xl space-y-1 w-44 animate-auth-glow">
          <div className="text-[10px] font-cinzel font-bold text-[#8a7852] px-2 py-1 border-b border-[#3a2810] uppercase">
            Menu Expandido
          </div>
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-cinzel font-bold transition-all ${
                  isActive
                    ? 'bg-[#2a1e08] text-[#ffe082] border border-[#816835]'
                    : 'text-[#8a7852] hover:text-[#d4c59a] hover:bg-[#060403]'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};
