'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGame, Quest, Pet } from '@/lib/gameContext';
import { Coffee, CheckCircle2, Award, Coins, Gem, Sparkles, Heart, Zap, Flame, UserPlus, Shield } from 'lucide-react';

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

      {/* Banquet Rest Card */}
      <div className="medieval-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-[#060403] border border-[#816835] flex items-center justify-center text-3xl">
            🍗
          </div>
          <div>
            <h2 className="font-cinzel text-lg font-bold text-[#ffe082]">Banquete da Taverna</h2>
            <p className="text-xs text-[#8a7852]">Restaure todo o seu HP ({maxHp}) e Energia ({maxEnergy}) por apenas 20 Moedas de Ouro.</p>
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

      {/* Contratar Companheiros (DPS Automático - Reino do Aço) */}
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
            {quests.map((q) => {
              const progressPercent = Math.min(100, Math.max(0, (q.currentCount / q.targetCount) * 100));

              return (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    q.isClaimed
                      ? 'bg-[#060403]/60 border-[#2a1e08] opacity-60'
                      : q.isCompleted
                      ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_12px_rgba(240,168,48,0.3)]'
                      : 'bg-[#060403] border-[#3a2810]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel text-xs font-bold text-[#ffe082]">{q.title}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase ${q.category === 'principal' ? 'bg-purple-950 text-purple-300 border-purple-800' : 'bg-amber-950 text-amber-300 border-amber-800'}`}>
                        {q.category}
                      </span>
                    </div>

                    {q.isClaimed && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Concluída
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#8a7852]">{q.description}</p>

                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] font-bold text-[#d4c59a] mb-1">
                      <span>Progresso da Caça</span>
                      <span>{q.currentCount} / {q.targetCount}</span>
                    </div>
                    <div className="h-2 w-full bg-[#150f08] rounded-full overflow-hidden border border-[#3a2810]">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#150f08] flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-bold">
                      <span className="text-amber-400 flex items-center gap-0.5">🪙 +{q.rewardGold}</span>
                      <span className="text-yellow-300 flex items-center gap-0.5">⭐ +{q.rewardExp} XP</span>
                      {q.rewardGems && <span className="text-cyan-300 flex items-center gap-0.5">💎 +{q.rewardGems}</span>}
                    </div>

                    {q.isCompleted && !q.isClaimed && (
                      <button
                        onClick={() => claimQuestReward(q.id)}
                        className="px-3 py-1 rounded bg-[#c8972a] hover:bg-[#f0a830] text-black text-[10px] font-cinzel font-bold shadow-md"
                      >
                        Resgatar Recompensa
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Santuário de Pets & Companheiros */}
        <div className="medieval-card p-5 space-y-4">
          <div className="pb-2 border-b border-[#3a2810]">
            <h2 className="font-cinzel text-base font-bold text-[#ffe082] flex items-center gap-2">
              🐾 Santuário de Companheiros (Pets)
            </h2>
            <p className="text-[10px] text-[#8a7852]">Pets auxiliam nas batalhas ativamente com curas, dano e escudos.</p>
          </div>

          <div className="space-y-3">
            {availablePets.map((pet) => {
              const isEquipped = equippedPet?.id === pet.id;

              return (
                <div
                  key={pet.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isEquipped
                      ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_12px_rgba(131,56,236,0.3)]'
                      : 'bg-[#060403] border-[#3a2810] hover:border-[#816835]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1 bg-[#150f08] rounded border border-[#3a2810]">{pet.icon}</span>
                      <div>
                        <div className="font-cinzel text-xs font-bold text-[#ffe082]">{pet.name}</div>
                        <p className="text-[10px] text-[#8a7852]">{pet.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#150f08] flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400">Preço: {pet.price} Ouro</span>

                    {isEquipped ? (
                      <span className="text-[10px] px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-700 font-bold">
                        Pet Equipado
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (!buyPet(pet)) {
                            equipPet(pet);
                          }
                        }}
                        className="px-3 py-1 rounded bg-[#c8972a] hover:bg-[#f0a830] text-black text-[10px] font-cinzel font-bold"
                      >
                        Equipar / Adotar
                      </button>
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
