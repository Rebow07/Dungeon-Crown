'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/lib/gameContext';
import { Trophy, Medal, Crown, Swords, Shield, Star, Flame } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  guild: string;
  charClass: string;
  level: number;
  combatPower: number;
  pvpWins: number;
  isCurrentPlayer?: boolean;
}

export default function RankingPage() {
  const router = useRouter();
  const { isLoggedIn, name, characterClass, level, totalAtk, totalDef, pvpWins } = useGame();

  if (!isLoggedIn) {
    if (typeof window !== 'undefined') router.push('/');
    return null;
  }

  const currentPlayerCP = Math.floor(totalAtk * 1.5 + totalDef * 2);

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: 'Sir_Arthur', guild: 'Cavaleiros Távola', charClass: 'Guerreiro', level: 24, combatPower: 840, pvpWins: 142 },
    { rank: 2, name: 'Valeria_Arcana', guild: 'Ordem dos Magos', charClass: 'Mago', level: 22, combatPower: 790, pvpWins: 118 },
    { rank: 3, name: 'Legolas_Sombra', guild: 'Patrulha da Floresta', charClass: 'Arqueiro', level: 20, combatPower: 710, pvpWins: 95 },
    {
      rank: 4,
      name: `${name} (Você)`,
      guild: 'Guardões de Dreht',
      charClass: characterClass,
      level: level,
      combatPower: currentPlayerCP,
      pvpWins: pvpWins,
      isCurrentPlayer: true
    },
    { rank: 5, name: 'Paladino_Galahad', guild: 'Cavaleiros Távola', charClass: 'Paladino', level: 18, combatPower: 620, pvpWins: 81 },
    { rank: 6, name: 'Thorin_Escudo', guild: 'Clã da Montanha', charClass: 'Guerreiro', level: 16, combatPower: 580, pvpWins: 64 },
    { rank: 7, name: 'Morgana_Fey', guild: 'Ordem dos Magos', charClass: 'Mago', level: 15, combatPower: 540, pvpWins: 50 }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-3 border-b border-[#3a2810]">
        <h1 className="font-cinzel text-2xl font-bold text-[#ffe082] flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" /> Hall da Fama — Ranking de Aventureiros
        </h1>
        <p className="text-xs text-[#8a7852]">Os campeões mais renomados dos Reinos de Dreht ordenados por Nível e Poder de Combate.</p>
      </div>

      {/* Podium Top 3 Highlight */}
      <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto my-6">
        {/* 2nd Place */}
        <div className="medieval-card p-4 text-center mt-4 border-slate-600/50">
          <div className="text-2xl mb-1">🥈</div>
          <div className="font-cinzel text-xs font-bold text-slate-300">{leaderboard[1].name}</div>
          <div className="text-[10px] text-[#8a7852] font-semibold">Lvl {leaderboard[1].level} • {leaderboard[1].charClass}</div>
          <div className="mt-2 text-xs font-bold text-amber-400">{leaderboard[1].combatPower} CP</div>
        </div>

        {/* 1st Place */}
        <div className="medieval-card p-4 text-center border-amber-500 shadow-[0_0_20px_rgba(240,168,48,0.3)] bg-gradient-to-b from-[#2a1e08] to-[#150f08]">
          <Crown className="w-6 h-6 text-amber-400 mx-auto mb-1 animate-pulse" />
          <div className="font-cinzel text-sm font-bold text-[#ffe082]">{leaderboard[0].name}</div>
          <div className="text-[10px] text-amber-300 font-semibold">Lvl {leaderboard[0].level} • {leaderboard[0].charClass}</div>
          <div className="mt-2 text-sm font-bold text-amber-400">{leaderboard[0].combatPower} CP</div>
        </div>

        {/* 3rd Place */}
        <div className="medieval-card p-4 text-center mt-6 border-amber-900/50">
          <div className="text-2xl mb-1">🥉</div>
          <div className="font-cinzel text-xs font-bold text-amber-600">{leaderboard[2].name}</div>
          <div className="text-[10px] text-[#8a7852] font-semibold">Lvl {leaderboard[2].level} • {leaderboard[2].charClass}</div>
          <div className="mt-2 text-xs font-bold text-amber-400">{leaderboard[2].combatPower} CP</div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="medieval-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0d0905] border-b border-[#3a2810] text-[11px] font-cinzel text-[#8a7852] uppercase">
                <th className="p-3 text-center">Posição</th>
                <th className="p-3">Aventureiro</th>
                <th className="p-3">Guilda</th>
                <th className="p-3 text-center">Nível</th>
                <th className="p-3 text-center">Poder (CP)</th>
                <th className="p-3 text-center">Vitórias PvP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1208] text-xs">
              {leaderboard.map((player) => (
                <tr
                  key={player.rank}
                  className={`transition-colors ${
                    player.isCurrentPlayer
                      ? 'bg-[#2a1e08] font-bold border border-[#816835] text-[#ffe082]'
                      : 'hover:bg-[#1a1208] text-[#d4c59a]'
                  }`}
                >
                  <td className="p-3 text-center font-cinzel font-bold">
                    {player.rank === 1 ? '🥇 1º' : player.rank === 2 ? '🥈 2º' : player.rank === 3 ? '🥉 3º' : `${player.rank}º`}
                  </td>
                  <td className="p-3">
                    <div className="font-cinzel font-bold flex items-center gap-1.5">
                      {player.name}
                      {player.isCurrentPlayer && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          VOCÊ
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#8a7852]">{player.charClass}</div>
                  </td>
                  <td className="p-3 text-[#8a7852]">{player.guild}</td>
                  <td className="p-3 text-center font-bold text-amber-400">Lvl {player.level}</td>
                  <td className="p-3 text-center font-bold text-[#ffe082]">{player.combatPower} CP</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">⚔️ {player.pvpWins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
