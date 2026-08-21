'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame, Dungeon, HuntLog, Item } from '@/lib/gameContext';
import { D20Dice } from '@/components/D20Dice';
import { ShieldAlert, Swords, Lock, Crown, Award, Coins, Flame, CheckCircle2, Sparkles, Repeat, Square } from 'lucide-react';

export default function DungeonsPage() {
  const router = useRouter();
  const { isLoggedIn, dungeons, executeDungeonD20, energy, restInTavern, gold } = useGame();

  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon>(dungeons[0]);
  const [bossLogs, setBossLogs] = useState<HuntLog[]>([]);
  const [currentBossHp, setCurrentBossHp] = useState<number>(dungeons[0].bossHp);
  const [bossResult, setBossResult] = useState<{
    victory: boolean;
    goldEarned: number;
    expEarned: number;
    bossLoot?: Item;
  } | null>(null);

  if (!isLoggedIn) {
    if (typeof window !== 'undefined') router.push('/');
    return null;
  }

  const handleD20RollComplete = (roll: number, resultType: 'miss' | 'normal' | 'crit' | 'supreme') => {
    const res = executeDungeonD20(selectedDungeon.id, roll, resultType);

    // Calculate D20 Damage applied to Boss HP
    let dmg = 0;
    if (resultType === 'crit') dmg = Math.floor(selectedDungeon.bossAtk * 1.5);
    else if (resultType === 'supreme') dmg = Math.floor(selectedDungeon.bossAtk * 2.5);
    else if (resultType === 'normal') fontDmg: dmg = Math.floor(selectedDungeon.bossAtk * 0.9);

    const actualDmg = resultType === 'miss' ? 0 : Math.max(12, Math.floor(selectedDungeon.bossHp * 0.25 * (resultType === 'supreme' ? 2 : resultType === 'crit' ? 1.4 : 1)));

    const nextBossHp = Math.max(0, currentBossHp - actualDmg);
    setCurrentBossHp(nextBossHp);

    const newLogs = [...res.logs];
    if (nextBossHp <= 0) {
      newLogs.push({
        id: `boss_vic_${Date.now()}`,
        text: `👑 VITÓRIA SUPREMA! Você derrotou ${selectedDungeon.bossName}! Relíquia: ${selectedDungeon.bossDrop.name}!`,
        type: 'victory'
      });
      setBossResult({
        victory: true,
        goldEarned: selectedDungeon.goldReward,
        expEarned: selectedDungeon.expReward,
        bossLoot: selectedDungeon.bossDrop
      });
    }

    setBossLogs((prev) => [...newLogs, ...prev]);
  };

  const handleResetBoss = () => {
    setCurrentBossHp(selectedDungeon.bossHp);
    setBossLogs([]);
    setBossResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-[#3a2810]">
        <h1 className="font-cinzel text-2xl font-bold text-[#ffe082] flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-purple-400" /> Masmorras & Combate Tático Dado D20
        </h1>
        <p className="text-xs text-[#8a7852]">Role o Dado D20 a cada turno para desferir golpes normais, críticos (15-19) ou Nat 20 Supremo!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dungeons List */}
        <div className="space-y-3">
          <h2 className="font-cinzel text-xs font-bold text-[#d4c59a] uppercase tracking-wider">
            Masmorras Desbloqueadas:
          </h2>

          {dungeons.map((d) => (
            <div
              key={d.id}
              onClick={() => {
                if (d.isUnlocked) {
                  setSelectedDungeon(d);
                  setCurrentBossHp(d.bossHp);
                  setBossLogs([]);
                  setBossResult(null);
                }
              }}
              className={`medieval-card p-3.5 transition-all ${
                !d.isUnlocked
                  ? 'opacity-60 cursor-not-allowed border-[#2a1e08]'
                  : selectedDungeon.id === d.id
                  ? 'border-purple-500 bg-[#2a1e08]/90 shadow-[0_0_15px_rgba(131,56,236,0.4)] cursor-pointer'
                  : 'hover:border-[#816835] hover:bg-[#150f08] cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl p-2 bg-[#060403] rounded border border-[#3a2810]">
                  {d.isUnlocked ? d.image : <Lock className="w-6 h-6 text-gray-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-cinzel font-bold text-xs text-[#ffe082]">{d.name}</h3>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                      Lvl {d.recommendedLevel}+
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8a7852] mt-0.5">{d.isUnlocked ? `Chefe: ${d.bossName}` : 'Bloqueada (Complete Missões)'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Dungeon Arena with D20 Roller */}
        <div className="md:col-span-2 space-y-4">
          <div className="medieval-card p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#3a2810]">
              <div className="flex items-center gap-3">
                <div className="text-4xl p-3 bg-[#060403] rounded-lg border border-purple-800">
                  {selectedDungeon.image}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-cinzel text-xl font-bold text-[#ffe082]">{selectedDungeon.bossName}</h3>
                    <Crown className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-xs text-[#8a7852]">{selectedDungeon.description}</p>
                </div>
              </div>

              {currentBossHp <= 0 && (
                <button onClick={handleResetBoss} className="medieval-btn text-xs py-2 px-4">
                  Reiniciar Masmorra
                </button>
              )}
            </div>

            {/* Boss HP Bar */}
            <div className="my-4 p-3 rounded-lg bg-[#060403] border border-purple-800/60">
              <div className="flex justify-between text-xs font-bold text-[#ffe082] mb-1 font-cinzel">
                <span>HP de {selectedDungeon.bossName}</span>
                <span>{currentBossHp} / {selectedDungeon.bossHp} HP</span>
              </div>
              <div className="h-3 w-full bg-[#150f08] rounded-full border border-purple-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-700 via-purple-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, (currentBossHp / selectedDungeon.bossHp) * 100))}%` }}
                />
              </div>
            </div>

            {/* Interactive D20 Roller Component */}
            {currentBossHp > 0 && (
              <div className="my-4 p-4 rounded-lg bg-gradient-to-b from-[#150f08] to-[#060403] border border-[#816835] text-center shadow-lg">
                <h4 className="font-cinzel text-xs font-bold text-amber-300 uppercase mb-2">
                  🎲 Seu Turno: Role o Dado D20 para Atacar!
                </h4>
                <D20Dice onRollComplete={handleD20RollComplete} disabled={energy < 10} />
              </div>
            )}

            {/* Battle Log Display */}
            <div className="mt-4">
              <h4 className="font-cinzel text-xs font-bold text-[#8a7852] uppercase tracking-wider mb-2">
                Relatório de Rodadas da Masmorra:
              </h4>

              <div className="h-48 bg-[#060403] border border-[#3a2810] rounded-lg p-3 overflow-y-auto space-y-2 font-mono text-xs">
                {bossLogs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[#6a5a38] text-center italic">
                    Clique no Dado D20 acima para girar e efetuar o ataque por rodada.
                  </div>
                ) : (
                  bossLogs.map((log, i) => (
                    <div
                      key={`${log.id}_${i}`}
                      className={`p-2 rounded border text-xs leading-relaxed transition-all ${
                        log.type === 'victory'
                          ? 'bg-purple-950/50 border-purple-700 text-purple-200 font-bold'
                          : log.type === 'defeat'
                          ? 'bg-red-950/40 border-red-900 text-red-300 font-bold'
                          : log.type === 'pet_act'
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300 font-bold'
                          : log.type === 'player_atk'
                          ? 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                          : log.type === 'monster_atk'
                          ? 'bg-red-950/20 border-red-900/30 text-red-300'
                          : 'bg-[#150f08] border-[#3a2810] text-[#d4c59a]'
                      }`}
                    >
                      {log.text}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Boss Victory Rewards Summary */}
            {bossResult && bossResult.victory && (
              <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-purple-950/50 to-amber-950/50 border border-purple-500/50 animate-pulse-glow">
                <div className="flex items-center gap-2 font-cinzel font-bold text-purple-300 text-sm mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Masmorra Concluída com Sucesso!
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Coins className="w-4 h-4" /> +{bossResult.goldEarned} Ouro
                  </span>
                  <span className="flex items-center gap-1 text-yellow-300">
                    <Award className="w-4 h-4" /> +{bossResult.expEarned} XP
                  </span>
                  {bossResult.bossLoot && (
                    <span className="text-purple-300 flex items-center gap-1">
                      👑 Relíquia Obtida: {bossResult.bossLoot.name} ({bossResult.bossLoot.rarity})
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
