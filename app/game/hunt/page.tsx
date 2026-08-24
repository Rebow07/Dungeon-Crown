'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGame, Monster, Item, HuntLog } from '@/lib/gameContext';
import { Swords, Shield, Heart, Zap, Award, Coins, Sparkles, RefreshCw, AlertCircle, CheckCircle2, Play, Square, Repeat, Hammer, ZapOff, Keyboard } from 'lucide-react';

const MONSTERS: Monster[] = [
  {
    id: 'mob_goblin',
    name: 'Goblin Espião',
    level: 1,
    hp: 40,
    maxHp: 40,
    atk: 10,
    def: 2,
    expReward: 25,
    goldReward: 15,
    image: '👺',
    drops: [
      { id: 'mat_goblin_iron', name: 'Ferro de Goblin', description: 'Fragmento de metal bruto.', type: 'Material', rarity: 'Comum', levelReq: 1, stats: {}, iconName: 'Hammer', price: 15 },
      { id: 'pot_hp_small', name: 'Poção de Vida Menor', description: 'Restaura 50 HP.', type: 'Consumível', rarity: 'Comum', levelReq: 1, stats: {}, iconName: 'FlaskConical', price: 25 }
    ]
  },
  {
    id: 'mob_shadow_wolf',
    name: 'Lobo das Sombras',
    level: 2,
    hp: 75,
    maxHp: 75,
    atk: 18,
    def: 5,
    expReward: 45,
    goldReward: 30,
    image: '🐺',
    drops: [
      { id: 'mat_shadow_leather', name: 'Couro Sombrio', description: 'Pele resistente de lobo.', type: 'Material', rarity: 'Incomum', levelReq: 2, stats: {}, iconName: 'Shield', price: 35 }
    ]
  },
  {
    id: 'mob_orc_warrior',
    name: 'Orc Berserker',
    level: 4,
    hp: 140,
    maxHp: 140,
    atk: 32,
    def: 12,
    expReward: 85,
    goldReward: 65,
    image: '👹',
    drops: [
      { id: 'wpn_orc_axe', name: 'Machado Brutal de Orc', description: 'Machado pesado forjado por orcs.', type: 'Arma', rarity: 'Incomum', levelReq: 3, stats: { atk: 18, str: 4 }, iconName: 'Axe', price: 120 }
    ]
  },
  {
    id: 'mob_dragon',
    name: 'Dragão de Fogo Ancestral',
    level: 6,
    hp: 280,
    maxHp: 280,
    atk: 55,
    def: 25,
    expReward: 200,
    goldReward: 180,
    image: '🐉',
    drops: [
      { id: 'mat_dragon_scale', name: 'Escama de Dragão', description: 'Escama reluzente elemental.', type: 'Material', rarity: 'Épico', levelReq: 5, stats: {}, iconName: 'Flame', price: 120 }
    ]
  }
];

export default function HuntPage() {
  const router = useRouter();
  const {
    isLoggedIn,
    energy,
    executeHunt,
    isAutoBattle,
    toggleAutoBattle,
    restInTavern,
    gold,
    equippedPet,
    clickPower,
    clickUpgradeCost,
    upgradeClickPower,
    dps
  } = useGame();

  const [selectedMonster, setSelectedMonster] = useState<Monster>(MONSTERS[0]);
  const [battleLogs, setBattleLogs] = useState<HuntLog[]>([]);
  const [clickDamages, setClickDamages] = useState<{ id: number; dmg: number; x: number; y: number }[]>([]);
  const [clickCount, setClickCount] = useState(0);

  const [repeatOption, setRepeatOption] = useState<number | 'infinite'>(5);
  const [remainingRepeats, setRemainingRepeats] = useState<number>(0);
  const [isRepeating, setIsRepeating] = useState<boolean>(false);

  if (!isLoggedIn) {
    if (typeof window !== 'undefined') router.push('/');
    return null;
  }

  const runSingleBattle = useCallback(() => {
    const res = executeHunt(selectedMonster);
    setBattleLogs(res.logs);
  }, [executeHunt, selectedMonster]);

  const triggerAttackWithFloatingDmg = useCallback((originX?: number, originY?: number) => {
    runSingleBattle();

    const x = originX !== undefined ? originX : 120 + Math.random() * 80;
    const y = originY !== undefined ? originY : 80 + Math.random() * 40;

    const id = Date.now() + Math.random();
    setClickDamages((prev) => [...prev.slice(-5), { id, dmg: clickPower, x, y }]);
    setClickCount((prev) => prev + 1);

    setTimeout(() => {
      setClickDamages((prev) => prev.filter((d) => d.id !== id));
    }, 800);
  }, [runSingleBattle, clickPower]);

  const handleTapMonster = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    triggerAttackWithFloatingDmg(x, y);
  };

  // Keyboard Shortcuts: Press C, Spacebar or Enter to Attack
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      const isAttackKey = e.key === 'c' || e.key === 'C' || e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space' || e.key === 'Enter';
      if (isAttackKey) {
        if (e.key === ' ' || e.code === 'Space') e.preventDefault();
        triggerAttackWithFloatingDmg();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerAttackWithFloatingDmg]);

  const handleStartRepeatHunt = () => {
    if (isRepeating) {
      setIsRepeating(false);
      setRemainingRepeats(0);
      return;
    }
    const count = repeatOption === 'infinite' ? 9999 : repeatOption;
    setRemainingRepeats(count);
    setIsRepeating(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRepeating && remainingRepeats > 0) {
      timer = setInterval(() => {
        if (energy >= 5) {
          runSingleBattle();
          setRemainingRepeats((prev) => {
            const next = prev - 1;
            if (next <= 0) {
              setIsRepeating(false);
              return 0;
            }
            return next;
          });
        } else if (gold >= 20) {
          restInTavern();
        } else {
          setIsRepeating(false);
        }
      }, 2200);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRepeating, remainingRepeats, energy, gold, runSingleBattle, restInTavern]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#3a2810]">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-[#ffe082] flex items-center gap-2">
            <Swords className="w-6 h-6 text-amber-400" /> Caça & Clicker Idle RPG
          </h1>
          <p className="text-xs text-[#8a7852]">Clique no monstro ou aperte <kbd className="px-1 py-0.5 rounded bg-[#3a2810] text-[#ffe082] border border-[#816835] font-mono text-[10px]">C</kbd> / <kbd className="px-1 py-0.5 rounded bg-[#3a2810] text-[#ffe082] border border-[#816835] font-mono text-[10px]">Espaço</kbd> para atacar!</p>
        </div>

        {/* Repeat Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-[#060403] border border-[#3a2810] p-1 rounded-md">
            {[1, 5, 10, 25, 50, 'infinite'].map((opt) => (
              <button
                key={String(opt)}
                onClick={() => setRepeatOption(opt as number | 'infinite')}
                disabled={isRepeating}
                className={`px-2 py-1 rounded text-[10px] font-cinzel font-bold transition-all ${
                  repeatOption === opt
                    ? 'bg-[#c8972a] text-black shadow-sm'
                    : 'text-[#8a7852] hover:text-[#ffe082]'
                }`}
              >
                {opt === 'infinite' ? '♾️ Auto' : `${opt}x`}
              </button>
            ))}
          </div>

          <button
            onClick={handleStartRepeatHunt}
            className={`px-4 py-2 rounded text-xs font-cinzel font-bold flex items-center gap-2 border transition-all ${
              isRepeating
                ? 'bg-amber-500 text-black border-amber-300 shadow-[0_0_15px_rgba(240,168,48,0.5)] animate-pulse'
                : 'bg-[#150f08] text-[#ffe082] border-[#816835] hover:bg-[#2a1e08]'
            }`}
          >
            {isRepeating ? <Square className="w-4 h-4 fill-black" /> : <Repeat className="w-4 h-4" />}
            <span>
              {isRepeating
                ? `Repetindo... (${remainingRepeats > 1000 ? 'Auto' : `${remainingRepeats}x`})`
                : `Repetir Caça (${repeatOption === 'infinite' ? 'Auto' : `${repeatOption}x`})`}
            </span>
          </button>
        </div>
      </div>

      {/* Keyboard Shortcut Banner */}
      <div className="flex items-center gap-2 bg-[#060403] border border-[#816835] px-3 py-2 rounded-lg text-xs text-[#ffe082]">
        <Keyboard className="w-4 h-4 text-amber-400" />
        <span>Atalhos de Caça Rápida: Pressione <kbd className="px-1.5 py-0.5 rounded bg-[#3a2810] text-[#ffe082] border border-[#816835] font-mono text-[10px]">C</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-[#3a2810] text-[#ffe082] border border-[#816835] font-mono text-[10px]">Espaço</kbd> ou <kbd className="px-1.5 py-0.5 rounded bg-[#3a2810] text-[#ffe082] border border-[#816835] font-mono text-[10px]">Enter</kbd> para atacar!</span>
      </div>

      {/* Stats Bar (Click Power & DPS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="medieval-card p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#8a7852] font-cinzel font-bold uppercase">Dano do Clique</div>
            <div className="font-cinzel text-lg font-bold text-amber-400">⚡ {clickPower} Dmg</div>
          </div>
          <button
            onClick={upgradeClickPower}
            disabled={gold < clickUpgradeCost}
            className="px-2.5 py-1 rounded bg-[#c8972a] hover:bg-[#f0a830] disabled:opacity-40 text-black text-[10px] font-cinzel font-bold flex items-center gap-1"
          >
            <Hammer className="w-3 h-3" /> Afiar ({clickUpgradeCost}🪙)
          </button>
        </div>

        <div className="medieval-card p-3">
          <div className="text-[10px] text-[#8a7852] font-cinzel font-bold uppercase">DPS Automático</div>
          <div className="font-cinzel text-lg font-bold text-emerald-400">⚔️ {dps} DPS</div>
        </div>

        <div className="medieval-card p-3 hidden sm:block">
          <div className="text-[10px] text-[#8a7852] font-cinzel font-bold uppercase">Golpes Efetuados</div>
          <div className="font-cinzel text-lg font-bold text-purple-300">💥 {clickCount} Clicks</div>
        </div>
      </div>

      {/* Grid: Monster Selector & Interactive Tap Arena */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monster Selector Column */}
        <div className="space-y-3">
          <h2 className="font-cinzel text-xs font-bold text-[#d4c59a] uppercase tracking-wider">
            Selecione o Alvo de Caça:
          </h2>

          {MONSTERS.map((m) => (
            <div
              key={m.id}
              onClick={() => {
                if (!isRepeating) setSelectedMonster(m);
              }}
              className={`medieval-card p-3 cursor-pointer transition-all ${
                selectedMonster.id === m.id
                  ? 'border-[#f0a830] bg-[#2a1e08]/90 shadow-[0_0_15px_rgba(200,151,42,0.4)]'
                  : 'hover:border-[#816835] hover:bg-[#150f08]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl p-2 bg-[#060403] rounded border border-[#3a2810]">{m.image}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-cinzel font-bold text-sm text-[#ffe082]">{m.name}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3a2810] text-amber-400 font-bold">
                      Lvl {m.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#8a7852] mt-1 font-semibold">
                    <span>❤️ {m.hp} HP</span>
                    <span>⚔️ {m.atk} Atk</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Clicker Tap Arena Area */}
        <div className="md:col-span-2 space-y-4">
          <div className="medieval-card p-6">
            <div className="text-center pb-3 border-b border-[#3a2810]">
              <h3 className="font-cinzel text-xl font-bold text-[#ffe082]">{selectedMonster.name}</h3>
              <p className="text-xs text-[#8a7852]">Clique na imagem do monstro ou pressione <kbd className="px-1 py-0.5 rounded bg-[#3a2810] text-[#ffe082] border border-[#816835]">C</kbd> no teclado para atacar!</p>
            </div>

            {/* Interactive Tap Display Box */}
            <div
              onClick={handleTapMonster}
              className="relative my-4 h-56 rounded-xl bg-gradient-to-b from-[#150f08] to-[#060403] border-2 border-[#816835] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden group hover:border-amber-400 active:scale-[0.98] transition-all shadow-inner"
            >
              <div className="text-7xl group-hover:scale-110 transition-transform duration-100 animate-float">
                {selectedMonster.image}
              </div>
              <p className="text-xs font-cinzel font-bold text-amber-400 mt-2">
                ⚔️ CLIQUE OU PRESSIONE 'C' / ESPAÇO PARA ATACAR
              </p>

              {/* Floating Damage Text Popup Numbers */}
              {clickDamages.map((d) => (
                <span
                  key={d.id}
                  style={{ left: d.x, top: d.y }}
                  className="absolute text-base font-black text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-damage pointer-events-none"
                >
                  -{d.dmg} 💥
                </span>
              ))}
            </div>

            {/* Battle Log Display */}
            <div className="mt-4">
              <h4 className="font-cinzel text-xs font-bold text-[#8a7852] uppercase tracking-wider mb-2">
                Relatório de Combate (Log):
              </h4>

              <div className="h-44 bg-[#060403] border border-[#3a2810] rounded-lg p-3 overflow-y-auto space-y-2 font-mono text-xs">
                {battleLogs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[#6a5a38] text-center italic">
                    Clique no monstro ou aperte 'C' / Espaço para desferir o primeiro golpe!
                  </div>
                ) : (
                  battleLogs.map((log, i) => (
                    <div
                      key={`${log.id}_${i}`}
                      className={`p-2 rounded border text-xs leading-relaxed transition-all ${
                        log.type === 'victory'
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300 font-bold'
                          : log.type === 'defeat'
                          ? 'bg-red-950/40 border-red-900 text-red-300 font-bold'
                          : log.type === 'pet_act'
                          ? 'bg-purple-950/40 border-purple-800 text-purple-200 font-bold'
                          : log.type === 'player_atk'
                          ? 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                          : 'bg-[#150f08] border-[#3a2810] text-[#d4c59a]'
                      }`}
                    >
                      {log.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
