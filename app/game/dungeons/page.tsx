'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame, Dungeon, HuntLog, Item } from '@/lib/gameContext';
import { D20Dice } from '@/components/D20Dice';
import { ShieldAlert, Swords, Lock, Crown, Award, Coins, Flame, CheckCircle2, Sparkles, Repeat, Square, Compass, Layers, Shield } from 'lucide-react';

interface StageEnemy {
  stageNum: number;
  name: string;
  isBoss: boolean;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  image: string;
}

export default function DungeonsPage() {
  const router = useRouter();
  const { isLoggedIn, dungeons, executeDungeonD20, energy, restInTavern, gold, totalAtk, totalDef } = useGame();

  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon>(dungeons[0]);

  // Procedural Dungeon Stages State
  const [totalStages, setTotalStages] = useState<number>(4);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [stagesList, setStagesList] = useState<StageEnemy[]>([]);
  const [currentEnemyHp, setCurrentEnemyHp] = useState<number>(100);

  // Turn Pacing State
  const [isEnemyTurn, setIsEnemyTurn] = useState<boolean>(false);
  const [turnStatusText, setTurnStatusText] = useState<string>('🎲 Seu Turno: Role o Dado D20!');
  const [bossLogs, setBossLogs] = useState<HuntLog[]>([]);
  const [bossResult, setBossResult] = useState<{
    victory: boolean;
    goldEarned: number;
    expEarned: number;
    bossLoot?: Item;
  } | null>(null);

  // Initialize or Generate Stages for Selected Dungeon
  const initializeDungeonRun = (dung: Dungeon) => {
    setSelectedDungeon(dung);

    // Random number of stages (3 to 6 stages)
    const numStages = Math.floor(Math.random() * 3) + 3;
    setTotalStages(numStages);
    setCurrentStageIndex(0);
    setBossLogs([]);
    setBossResult(null);

    const generatedStages: StageEnemy[] = [];
    const minionTypes = [
      { name: 'Goblin Sentinela', image: '👺', scale: 0.35 },
      { name: 'Esqueleto Morto-Vivo', image: '💀', scale: 0.5 },
      { name: 'Lobo das Cavernas', image: '🐺', scale: 0.6 },
      { name: 'Orc Guarda de Elite', image: '👹', scale: 0.75 }
    ];

    for (let i = 0; i < numStages - 1; i++) {
      const minion = minionTypes[i % minionTypes.length];
      const mHp = Math.max(40, Math.floor(dung.bossHp * minion.scale));
      generatedStages.push({
        stageNum: i + 1,
        name: minion.name,
        isBoss: false,
        hp: mHp,
        maxHp: mHp,
        atk: Math.max(10, Math.floor(dung.bossAtk * minion.scale)),
        def: Math.max(3, Math.floor(dung.bossDef * minion.scale)),
        image: minion.image
      });
    }

    // Final Stage is the Dungeon Boss
    generatedStages.push({
      stageNum: numStages,
      name: dung.bossName,
      isBoss: true,
      hp: dung.bossHp,
      maxHp: dung.bossHp,
      atk: dung.bossAtk,
      def: dung.bossDef,
      image: dung.image
    });

    setStagesList(generatedStages);
    setCurrentEnemyHp(generatedStages[0].hp);
    setTurnStatusText('🎲 Seu Turno: Role o Dado D20 para Atacar!');
  };

  useEffect(() => {
    if (dungeons.length > 0) {
      initializeDungeonRun(dungeons[0]);
    }
  }, []);

  if (!isLoggedIn) {
    if (typeof window !== 'undefined') router.push('/');
    return null;
  }

  const currentEnemy = stagesList[currentStageIndex] || {
    stageNum: 1,
    name: selectedDungeon.bossName,
    isBoss: true,
    hp: selectedDungeon.bossHp,
    maxHp: selectedDungeon.bossHp,
    atk: selectedDungeon.bossAtk,
    def: selectedDungeon.bossDef,
    image: selectedDungeon.image
  };

  // Turn-Based Procedural Attack Handler
  const handleD20RollComplete = (roll: number, resultType: 'miss' | 'normal' | 'crit' | 'supreme') => {
    if (isEnemyTurn) return;

    // Player Damage Calculation
    let mult = 1.0;
    if (resultType === 'crit') mult = 1.8;
    else if (resultType === 'supreme') mult = 2.5;

    const actualDmg = resultType === 'miss' ? 0 : Math.max(15, Math.floor((totalAtk - currentEnemy.def * 0.3) * mult));
    const nextEnemyHp = Math.max(0, currentEnemyHp - actualDmg);
    setCurrentEnemyHp(nextEnemyHp);

    const logList: HuntLog[] = [];

    // Player Attack Log
    if (resultType === 'miss') {
      logList.push({ id: `p_miss_${Date.now()}`, text: `💀 ROLAGEM D20: Lado 1 (Caveira)! Seu ataque errou! (0 Dano)`, type: 'info' });
    } else {
      logList.push({
        id: `p_hit_${Date.now()}`,
        text: `🎲 ROLAGEM D20: Lado ${roll}! Você causou ${actualDmg} de dano a ${currentEnemy.name}${resultType === 'supreme' ? ' 🌟 NAT 20 SUPREMO!' : resultType === 'crit' ? ' ⚔️ CRÍTICO!' : ''}!`,
        type: 'player_atk'
      });
    }

    setBossLogs((prev) => [...logList, ...prev]);

    // Check if Enemy Defeated
    if (nextEnemyHp <= 0) {
      if (currentEnemy.isBoss) {
        // Dungeon Final Boss Cleared!
        setBossLogs((prev) => [
          {
            id: `vic_final_${Date.now()}`,
            text: `👑 VITÓRIA SUPREMA NA MASMORRA! Derrotou o Chefe ${selectedDungeon.bossName}! Loot: ${selectedDungeon.bossDrop.name}!`,
            type: 'victory'
          },
          ...prev
        ]);
        setBossResult({
          victory: true,
          goldEarned: selectedDungeon.goldReward,
          expEarned: selectedDungeon.expReward,
          bossLoot: selectedDungeon.bossDrop
        });
      } else {
        // Stage Cleared -> Advance to Next Stage!
        setBossLogs((prev) => [
          {
            id: `stage_vic_${Date.now()}`,
            text: `🏆 Fase ${currentStageIndex + 1} de ${totalStages} Concluída! Derrotou ${currentEnemy.name}. Avançando...`,
            type: 'victory'
          },
          ...prev
        ]);

        setIsEnemyTurn(true);
        setTurnStatusText(`✨ Fase Cleared! Avançando para a Fase ${currentStageIndex + 2}...`);

        setTimeout(() => {
          const nextIdx = currentStageIndex + 1;
          setCurrentStageIndex(nextIdx);
          setCurrentEnemyHp(stagesList[nextIdx].hp);
          setIsEnemyTurn(false);
          setTurnStatusText('🎲 Seu Turno: Role o Dado D20!');
        }, 1500);
      }
      return;
    }

    // Tactical Enemy Turn Pacing Delay (1.2s delay for Enemy Counter-Attack)
    setIsEnemyTurn(true);
    setTurnStatusText(`🛡️ Turno de ${currentEnemy.name}: Atacando...`);

    setTimeout(() => {
      let enemyDmg = Math.max(1, Math.floor((currentEnemy.atk - totalDef * 0.3) * (0.85 + Math.random() * 0.3)));
      setBossLogs((prev) => [
        {
          id: `e_atk_${Date.now()}`,
          text: `👹 ${currentEnemy.name} contra-atacou desferindo ${enemyDmg} de Dano!`,
          type: 'monster_atk'
        },
        ...prev
      ]);
      setIsEnemyTurn(false);
      setTurnStatusText('🎲 Seu Turno: Role o Dado D20!');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-[#3a2810]">
        <h1 className="font-cinzel text-2xl font-bold text-[#ffe082] flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-purple-400" /> Masmorras & Combate Tático Dado D20
        </h1>
        <p className="text-xs text-[#8a7852]">Batalhas cadenciadas em Fases por turnos. Role o D20 e aguarde a vez do inimigo contra-atacar.</p>
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
                  initializeDungeonRun(d);
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

        {/* Selected Dungeon Arena with Procedural Stages */}
        <div className="md:col-span-2 space-y-4">
          <div className="medieval-card p-6">
            {/* Dungeon Header & Restart */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#3a2810]">
              <div className="flex items-center gap-3">
                <div className="text-4xl p-3 bg-[#060403] rounded-lg border border-purple-800">
                  {currentEnemy.image}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-cinzel text-xl font-bold text-[#ffe082]">{currentEnemy.name}</h3>
                    {currentEnemy.isBoss && <Crown className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-xs text-[#8a7852]">{selectedDungeon.name} • {selectedDungeon.description}</p>
                </div>
              </div>

              <button onClick={() => initializeDungeonRun(selectedDungeon)} className="medieval-btn-outline text-xs py-2 px-3 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> Nova Exploração
              </button>
            </div>

            {/* Procedural Stage Progress Tracker Bar */}
            <div className="my-4 p-3 rounded-lg bg-[#060403] border border-[#3a2810]">
              <div className="flex items-center justify-between text-xs font-bold text-[#ffe082] mb-2 font-cinzel">
                <span className="flex items-center gap-1.5 text-purple-400">
                  <Layers className="w-4 h-4" /> Progresso da Masmorra: Fase {currentStageIndex + 1} de {totalStages}
                </span>
                <span className="text-[10px] text-amber-400">
                  {currentEnemy.isBoss ? '👑 CHEFE FINAL' : `Inimigo ${currentStageIndex + 1}`}
                </span>
              </div>

              {/* Visual Stage Nodes */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
                {stagesList.map((stg, idx) => (
                  <div
                    key={stg.stageNum}
                    className={`flex-1 min-w-[50px] p-1.5 rounded text-center border text-[10px] font-bold font-cinzel transition-all ${
                      idx < currentStageIndex
                        ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                        : idx === currentStageIndex
                        ? 'bg-purple-950 border-purple-500 text-purple-200 shadow-[0_0_10px_rgba(131,56,236,0.5)]'
                        : 'bg-[#150f08] border-[#3a2810] text-gray-500'
                    }`}
                  >
                    <div>{stg.isBoss ? '👑 Chefe' : `Fase ${stg.stageNum}`}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enemy HP Bar */}
            <div className="my-4 p-3 rounded-lg bg-[#060403] border border-purple-800/60">
              <div className="flex justify-between text-xs font-bold text-[#ffe082] mb-1 font-cinzel">
                <span>HP de {currentEnemy.name}</span>
                <span>{currentEnemyHp} / {currentEnemy.maxHp} HP</span>
              </div>
              <div className="h-3 w-full bg-[#150f08] rounded-full border border-purple-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-700 via-purple-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, (currentEnemyHp / currentEnemy.maxHp) * 100))}%` }}
                />
              </div>
            </div>

            {/* Turn Status Indicator */}
            <div className="text-center text-xs font-bold text-amber-300 font-cinzel bg-[#150f08] p-2 rounded border border-[#3a2810] mb-3">
              {turnStatusText}
            </div>

            {/* Interactive D20 Roller Component */}
            {currentEnemyHp > 0 && !bossResult?.victory && (
              <div className="my-4 p-4 rounded-lg bg-gradient-to-b from-[#150f08] to-[#060403] border border-[#816835] text-center shadow-lg">
                <D20Dice onRollComplete={handleD20RollComplete} disabled={isEnemyTurn || energy < 5} />
              </div>
            )}

            {/* Battle Log Display */}
            <div className="mt-4">
              <h4 className="font-cinzel text-xs font-bold text-[#8a7852] uppercase tracking-wider mb-2">
                Relatório de Rodadas da Masmorra:
              </h4>

              <div className="h-44 bg-[#060403] border border-[#3a2810] rounded-lg p-3 overflow-y-auto space-y-2 font-mono text-xs">
                {bossLogs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[#6a5a38] text-center italic">
                    Role o Dado D20 para iniciar o primeiro turno na Fase 1!
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
              <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-purple-950/50 to-amber-950/50 border border-purple-500/50 animate-pulse">
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
