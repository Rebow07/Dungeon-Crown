'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGame, Quest, Pet } from '@/lib/gameContext';
import { Coffee, CheckCircle2, Award, Coins, Gem, Sparkles, Heart, Zap, Flame, UserPlus, Shield, Keyboard } from 'lucide-react';

export default function TavernaPage() {
  const router = useRouter();
  const {
    isLoggedIn,
    quests,
    claimQuestReward,
    restInTavern,
    gold,
    hp,
    maxHp,
    energy,
    maxEnergy,
    availablePets,
    equippedPet,
    buyPet,
    equipPet,
    companionsCount,
    hireCompanion,
    dps
  } = useGame();

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const restRef = useRef(restInTavern);
  const hpRef = useRef(hp);
  const maxHpRef = useRef(maxHp);
  const energyRef = useRef(energy);
  const maxEnergyRef = useRef(maxEnergy);
  const goldRef = useRef(gold);

  useEffect(() => {
    restRef.current = restInTavern;
    hpRef.current = hp;
    maxHpRef.current = maxHp;
    energyRef.current = energy;
    maxEnergyRef.current = maxEnergy;
    goldRef.current = gold;
  });

  // Keyboard shortcut listener: Press T or B to rest in Tavern
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      const code = e.code;
      const key = e.key ? e.key.toLowerCase() : '';

      const isTKey = code === 'KeyT' || key === 't';
      const isBKey = code === 'KeyB' || key === 'b';

      if (isTKey || isBKey) {
        if (goldRef.current < 20) {
          setToastMsg('🪙 Ouro insuficiente para o Banquete (necessário 20 Ouro)!');
        } else if (hpRef.current >= maxHpRef.current && energyRef.current >= maxEnergyRef.current) {
          setToastMsg('🍗 Seu HP e Energia já estão 100% cheios!');
        } else {
          restRef.current();
          setToastMsg('🍗 Banquete servido! HP e Energia 100% restaurados!');
        }

        setTimeout(() => setToastMsg(null), 2500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isLoggedIn) {
    if (typeof window !== 'undefined') router.push('/');
    return null;
  }

  const costArcher = Math.floor(50 * Math.pow(1.4, companionsCount.archers));
  const costKnight = Math.floor(250 * Math.pow(1.4, companionsCount.knights));
  const costMage = Math.floor(1000 * Math.pow(1.4, companionsCount.mages));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-3 border-b border-[#3a2810]">
        <h1 className="font-cinzel text-2xl font-bold text-[#ffe082] flex items-center gap-2">
          <Coffee className="w-6 h-6 text-amber-400" /> Taverna & Guilda de Mercenários
        </h1>
        <p className="text-xs text-[#8a7852]">Contrate guerreiros para aumentar seu DPS Automático, desfrute de banquetes e aceite contratos.</p>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-lg bg-amber-950/80 border border-amber-500 text-[#ffe082] text-xs font-bold flex items-center gap-2 animate-pulse">
          <Keyboard className="w-4 h-4 text-amber-400" /> {toastMsg}
        </div>
      )}

      {/* Banquet Rest Card */}
      <div className="medieval-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-[#060403] border border-[#816835] flex items-center justify-center text-3xl">
            🍗
          </div>
          <div>
            <h2 className="font-cinzel text-lg font-bold text-[#ffe082]">Banquete da Taverna</h2>
            <p className="text-xs text-[#8a7852]">Restaure todo o seu HP ({maxHp}) e Energia ({maxEnergy}) por apenas 20 Moedas de Ouro.</p>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
              <Keyboard className="w-3 h-3 text-amber-400" />
              <span>Atalho no teclado: Pressione <kbd className="px-1 py-0.2 bg-[#3a2810] text-[#ffe082] border border-[#816835] font-mono">T</kbd> ou <kbd className="px-1 py-0.2 bg-[#3a2810] text-[#ffe082] border border-[#816835] font-mono">B</kbd></span>
            </div>
          </div>
        </div>

        <button
          onClick={restInTavern}
          disabled={gold < 20 || (hp === maxHp && energy === maxEnergy)}
          className="medieval-btn text-xs py-2.5 px-6 whitespace-nowrap disabled:opacity-50"
        >
          <Coffee className="w-4 h-4" /> Desfrutar Banquete (20 Ouro)
        </button>
      </div>

      {/* Contratar Companheiros (DPS Automático) */}
      <div className="medieval-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#3a2810]">
          <div>
            <h2 className="font-cinzel text-base font-bold text-[#ffe082] flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-400" /> Guilda de Mercenários (Contratar DPS)
            </h2>
            <p className="text-[10px] text-[#8a7852]">Mercenários geram dano contínuo automático por segundo em todas as batalhas.</p>
          </div>

          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-[#060403] px-3 py-1 rounded border border-[#3a2810]">
            ⚡ DPS Total: {dps} / seg
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Arqueiro */}
          <div className="p-3.5 rounded-lg bg-[#060403] border border-[#3a2810] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-cinzel font-bold text-xs text-[#ffe082]">Contratar Arqueiro</span>
                <span className="text-[10px] font-bold text-emerald-400">+2 DPS</span>
              </div>
              <p className="text-[10px] text-[#8a7852]">Atiradores ágeis de suporte. Possui: {companionsCount.archers}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#150f08] flex items-center justify-between">
              <span className="text-[10px] text-amber-400 font-bold">🪙 {costArcher}</span>
              <button
                onClick={() => hireCompanion('archers')}
                disabled={gold < costArcher}
                className="px-3 py-1 rounded bg-[#c8972a] hover:bg-[#f0a830] disabled:opacity-40 text-black text-[10px] font-cinzel font-bold"
              >
                Recrutar
              </button>
            </div>
          </div>

          {/* Cavaleiro */}
          <div className="p-3.5 rounded-lg bg-[#060403] border border-[#3a2810] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-cinzel font-bold text-xs text-[#ffe082]">Recrutar Cavaleiro</span>
                <span className="text-[10px] font-bold text-emerald-400">+10 DPS</span>
              </div>
              <p className="text-[10px] text-[#8a7852]">Guerreiro blindado de vanguarda. Possui: {companionsCount.knights}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#150f08] flex items-center justify-between">
              <span className="text-[10px] text-amber-400 font-bold">🪙 {costKnight}</span>
              <button
                onClick={() => hireCompanion('knights')}
                disabled={gold < costKnight}
                className="px-3 py-1 rounded bg-[#c8972a] hover:bg-[#f0a830] disabled:opacity-40 text-black text-[10px] font-cinzel font-bold"
              >
                Recrutar
              </button>
            </div>
          </div>

          {/* Mago */}
          <div className="p-3.5 rounded-lg bg-[#060403] border border-[#3a2810] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-cinzel font-bold text-xs text-[#ffe082]">Contratar Mago</span>
                <span className="text-[10px] font-bold text-emerald-400">+50 DPS</span>
              </div>
              <p className="text-[10px] text-[#8a7852]">Feiticeiro arcano devastador. Possui: {companionsCount.mages}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#150f08] flex items-center justify-between">
              <span className="text-[10px] text-amber-400 font-bold">🪙 {costMage}</span>
              <button
                onClick={() => hireCompanion('mages')}
                disabled={gold < costMage}
                className="px-3 py-1 rounded bg-[#c8972a] hover:bg-[#f0a830] disabled:opacity-40 text-black text-[10px] font-cinzel font-bold"
              >
                Recrutar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Quests Board & Pets Sanctuary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quadro de Missões */}
        <div className="medieval-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#3a2810]">
            <h2 className="font-cinzel text-base font-bold text-[#ffe082] flex items-center gap-2">
              📜 Quadro de Missões & Contratos
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#060403] border border-[#3a2810] text-amber-400 font-bold">
              {quests.filter((q) => q.isCompleted && !q.isClaimed).length} Recompensas Pendentes
            </span>
          </div>

          <div className="space-y-3">
            {quests.map((q) => (
              <div
                key={q.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  q.isClaimed
                    ? 'bg-[#060403]/60 border-[#3a2810] opacity-60'
                    : q.isCompleted
                    ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_12px_rgba(200,151,42,0.3)]'
                    : 'bg-[#060403] border-[#3a2810]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-cinzel font-bold text-xs text-[#ffe082] flex items-center gap-1.5">
                      <span>{q.category === 'principal' ? '⭐' : '🎯'}</span>
                      <span>{q.title}</span>
                    </h3>
                    <p className="text-[10px] text-[#8a7852] mt-0.5">{q.description}</p>
                  </div>

                  {q.isClaimed ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#150f08] text-gray-500 font-bold">Resgatado</span>
                  ) : q.isCompleted ? (
                    <button
                      onClick={() => claimQuestReward(q.id)}
                      className="medieval-btn text-[10px] py-1 px-3"
                    >
                      <Award className="w-3 h-3 text-amber-300" /> Resgatar
                    </button>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#150f08] border border-[#3a2810] text-amber-400 font-bold">
                      {q.currentCount}/{q.targetCount}
                    </span>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-[#150f08] flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2 font-bold text-amber-400">
                    <span>🪙 +{q.rewardGold}</span>
                    <span>🌟 +{q.rewardExp} XP</span>
                    {q.rewardGems && <span className="text-cyan-300">💎 +{q.rewardGems}</span>}
                  </div>
                  {q.unlockDungeonId && (
                    <span className="text-purple-400 font-bold flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3" /> Libera Masmorra
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Santuário de Pets */}
        <div className="medieval-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#3a2810]">
            <h2 className="font-cinzel text-base font-bold text-[#ffe082] flex items-center gap-2">
              🐾 Santuário de Pets Companheiros
            </h2>
            {equippedPet && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-200 font-bold">
                Ativo: {equippedPet.name}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {availablePets.map((pet) => {
              const isEquipped = equippedPet?.id === pet.id;
              return (
                <div
                  key={pet.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isEquipped
                      ? 'bg-purple-950/40 border-purple-600 shadow-[0_0_12px_rgba(131,56,236,0.4)]'
                      : 'bg-[#060403] border-[#3a2810] hover:border-[#816835]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl p-2 bg-[#150f08] rounded border border-[#3a2810]">{pet.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-cinzel font-bold text-xs text-[#ffe082]">{pet.name}</h3>
                        <span className="text-[10px] text-[#8a7852] font-semibold">🪙 {pet.price} Ouro</span>
                      </div>
                      <p className="text-[10px] text-[#8a7852] mt-0.5">{pet.description}</p>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#150f08] flex items-center justify-between">
                    <span className="text-[10px] text-purple-300 font-bold uppercase">{pet.type}</span>
                    {isEquipped ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Equipado
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => buyPet(pet)}
                          disabled={gold < pet.price}
                          className="medieval-btn text-[10px] py-1 px-3 disabled:opacity-40"
                        >
                          Adquirir
                        </button>
                        <button
                          onClick={() => equipPet(pet)}
                          className="medieval-btn-outline text-[10px] py-1 px-2.5"
                        >
                          Equipar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
