'use client';

import React, { useEffect } from 'react';
import { useGame } from '@/lib/gameContext';
import { Shield, Heart, Zap, Coins, Gem, LogOut, Crown, User, Keyboard } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, name, level, hp, maxHp, energy, maxEnergy, gold, gems, characterClass, customAvatarUrl, equippedPet, logout } = useGame();

  // Global Numeric Navigation Shortcuts (1-9)
  useEffect(() => {
    if (!isLoggedIn) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      const code = e.code;
      const key = e.key;

      if (code === 'Digit1' || key === '1') router.push('/game');
      else if (code === 'Digit2' || key === '2') router.push('/game/hunt');
      else if (code === 'Digit3' || key === '3') router.push('/game/dungeons');
      else if (code === 'Digit4' || key === '4') router.push('/game/taverna');
      else if (code === 'Digit5' || key === '5') router.push('/game/shop');
      else if (code === 'Digit6' || key === '6') router.push('/game/inventory');
      else if (code === 'Digit7' || key === '7') router.push('/game/forge');
      else if (code === 'Digit8' || key === '8') router.push('/game/ranking');
      else if (code === 'Digit9' || key === '9') router.push('/game/settings');
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const hpPercent = Math.min(100, Math.max(0, (hp / maxHp) * 100));
  const energyPercent = Math.min(100, Math.max(0, (energy / maxEnergy) * 100));

  const avatarSrc = customAvatarUrl || `/avatars/${characterClass.toLowerCase()}.png`;

  return (
    <header className="sticky top-0 z-50 bg-[#060403]/95 border-b border-[#3a2810] backdrop-blur-md px-4 py-2.5 shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Character Avatar */}
        <Link href="/game" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c8972a] via-[#f0a830] to-[#8338ec] p-0.5 shadow-[0_0_15px_rgba(200,151,42,0.4)] transition-all overflow-hidden flex items-center justify-center">
            <img src={avatarSrc} alt={name} className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-cinzel font-bold text-sm text-[#ffe082] tracking-wider">
              <span>{name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3a2810] text-[#c8972a] border border-[#4a3418]">
                Lvl {level}
              </span>
              {equippedPet && (
                <span title={`Pet Ativo: ${equippedPet.name}`} className="text-xs">
                  {equippedPet.icon}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#8a7852] font-semibold">{characterClass} • Dungeon & Crown</p>
          </div>
        </Link>

        {/* Status Bars: HP & Energy */}
        <div className="flex items-center gap-4 flex-1 max-w-xs sm:max-w-md">
          {/* HP Bar */}
          <div className="flex-1">
            <div className="flex justify-between text-[11px] font-bold text-[#d4c59a] mb-1">
              <span className="flex items-center gap-1 text-red-400">
                <Heart className="w-3.5 h-3.5 fill-red-500/20" /> HP
              </span>
              <span>{hp}/{maxHp}</span>
            </div>
            <div className="h-2.5 w-full bg-[#150f08] rounded-full border border-[#4a3418] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-700 via-red-500 to-rose-400 transition-all duration-300"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          {/* Energy Bar */}
          <div className="flex-1">
            <div className="flex justify-between text-[11px] font-bold text-[#d4c59a] mb-1">
              <span className="flex items-center gap-1 text-amber-400">
                <Zap className="w-3.5 h-3.5 fill-amber-500/20" /> EP
              </span>
              <span>{energy}/{maxEnergy}</span>
            </div>
            <div className="h-2.5 w-full bg-[#150f08] rounded-full border border-[#4a3418] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-300"
                style={{ width: `${energyPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Currencies & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#150f08] border border-[#3a2810] px-2.5 py-1 rounded-md text-xs font-bold text-[#ffe082]">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{gold.toLocaleString('pt-BR')}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#150f08] border border-[#3a2810] px-2.5 py-1 rounded-md text-xs font-bold text-cyan-300">
            <Gem className="w-4 h-4 text-cyan-400" />
            <span>{gems}</span>
          </div>

          <button
            onClick={logout}
            title="Sair do Jogo"
            className="p-1.5 text-[#8a7852] hover:text-red-400 hover:bg-red-950/30 rounded border border-transparent hover:border-red-900/50 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
