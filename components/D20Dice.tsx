'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Swords, Crown, Skull } from 'lucide-react';

interface D20DiceProps {
  onRollComplete: (roll: number, resultType: 'miss' | 'normal' | 'crit' | 'supreme') => void;
  disabled?: boolean;
}

export const D20Dice: React.FC<D20DiceProps> = ({ onRollComplete, disabled }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [resultType, setResultType] = useState<'miss' | 'normal' | 'crit' | 'supreme' | null>(null);

  const rollDice = useCallback(() => {
    if (isRolling || disabled) return;

    setIsRolling(true);
    setLastRoll(null);
    setResultType(null);

    let rollCount = 0;
    const interval = setInterval(() => {
      setLastRoll(Math.floor(Math.random() * 20) + 1);
      rollCount++;
      if (rollCount > 12) {
        clearInterval(interval);

        // Final Roll Result Calculation
        const finalVal = Math.floor(Math.random() * 20) + 1;
        setLastRoll(finalVal);

        let type: 'miss' | 'normal' | 'crit' | 'supreme' = 'normal';
        if (finalVal === 1) type = 'miss';
        else if (finalVal >= 15 && finalVal <= 19) type = 'crit';
        else if (finalVal === 20) type = 'supreme';

        setResultType(type);
        setIsRolling(false);
        onRollComplete(finalVal, type);
      }
    }, 80);
  }, [isRolling, disabled, onRollComplete]);

  // Keyboard Accessibility: Spacebar & Enter Key Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && !isRolling && !disabled) {
        // Prevent default spacebar scrolling
        if (e.code === 'Space') e.preventDefault();
        rollDice();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rollDice, isRolling, disabled]);

  const getFaceIcon = (roll: number | null) => {
    if (roll === null) return <Swords className="w-8 h-8 text-amber-400" />;
    if (roll === 1) return <Skull className="w-9 h-9 text-red-500 animate-bounce" />;
    if (roll >= 15 && roll <= 19) return <Swords className="w-9 h-9 text-amber-300" />;
    if (roll === 20) return <Crown className="w-10 h-10 text-yellow-300 animate-pulse" />;
    return <span className="font-cinzel text-2xl font-black text-[#ffe082]">🗡️</span>;
  };

  return (
    <div className="flex flex-col items-center gap-3 py-2" role="region" aria-live="polite">
      {/* 3D D20 Polygon Shape Container */}
      <button
        type="button"
        onClick={rollDice}
        disabled={isRolling || disabled}
        aria-label="Rolar Dado D20"
        className={`w-28 h-28 rounded-2xl bg-gradient-to-br from-[#2a1e08] via-[#150f08] to-[#3a2810] border-2 border-[#816835] shadow-[0_0_25px_rgba(200,151,42,0.4)] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform outline-none focus:ring-2 focus:ring-amber-400 ${
          isRolling ? 'rotate-[720deg] scale-110 border-amber-400' : 'hover:scale-105 hover:border-[#f0a830]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex flex-col items-center justify-center gap-1">
          {getFaceIcon(lastRoll)}
          <span className="font-cinzel font-black text-2xl text-[#ffe082]">
            {lastRoll ? lastRoll : 'D20'}
          </span>
        </div>
      </button>

      {/* Keyboard Hint */}
      <span className="text-[10px] text-[#8a7852] font-semibold">
        💡 Pressione <kbd className="px-1.5 py-0.5 rounded bg-[#3a2810] text-[#ffe082] border border-[#816835]">Espaço</kbd> ou <kbd className="px-1.5 py-0.5 rounded bg-[#3a2810] text-[#ffe082] border border-[#816835]">Enter</kbd> para rolar
      </span>

      {/* Result Type Badge */}
      {resultType && !isRolling && (
        <div
          className={`px-3 py-1 rounded text-xs font-cinzel font-bold border uppercase animate-bounce ${
            resultType === 'miss'
              ? 'bg-red-950 text-red-300 border-red-800'
              : resultType === 'crit'
              ? 'bg-amber-950 text-amber-300 border-amber-500'
              : resultType === 'supreme'
              ? 'bg-purple-950 text-purple-200 border-purple-500 shadow-[0_0_15px_rgba(131,56,236,0.6)]'
              : 'bg-[#150f08] text-emerald-400 border-emerald-800'
          }`}
        >
          {resultType === 'miss'
            ? '💀 Lado 1: Falha (Miss)'
            : resultType === 'crit'
            ? '⚔️ Lado 15-19: Hit Crítico!'
            : resultType === 'supreme'
            ? '🌟 Lado 20: Nat 20 Supremo!'
            : '🗡️ Lado 2-14: Hit Normal'}
        </div>
      )}

      {/* Roll Action Button */}
      <button
        type="button"
        onClick={rollDice}
        disabled={isRolling || disabled}
        className="medieval-btn py-2 px-6 text-xs disabled:opacity-50"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        {isRolling ? 'Rolando Dado...' : 'Rolar Dado D20'}
      </button>
    </div>
  );
};
