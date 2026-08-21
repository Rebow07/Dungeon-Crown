'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/lib/gameContext';
import { AVATARS, CharacterCreationModal } from '@/components/CharacterCreationModal';
import { Shield, Swords, Plus, Heart, Zap, Award, Sparkles, Coffee, Backpack, Flame, RefreshCw, Play, Square, Camera, Edit } from 'lucide-react';

export default function GameDashboard() {
  const router = useRouter();
  const {
    isLoggedIn,
    name,
    characterClass,
    avatarId,
    customAvatarUrl,
    level,
    exp,
    maxExp,
    hp,
    maxHp,
    energy,
    maxEnergy,
    stats,
    statPoints,
    allocateStat,
    getStatCost,
    equippedPet,
    totalAtk,
    totalDef,
    gold,
    restInTavern,
    isAutoBattle,
    toggleAutoBattle
  } = useGame();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isLoggedIn) {
    if (typeof window !== 'undefined') router.push('/');
    return null;
  }

  const expPercent = Math.min(100, Math.max(0, (exp / maxExp) * 100));
  const selectedPreset = AVATARS.find((a) => a.id === avatarId);

  const renderStatBox = (statKey: 'str' | 'agi' | 'vit' | 'int', title: string, code: string, desc: string) => {
    const val = stats[statKey];
    const cost = getStatCost(val);
    const canAfford = statPoints >= cost;

    return (
      <div className="flex items-center justify-between bg-[#060403] border border-[#3a2810] p-3 rounded-lg hover:border-[#816835] transition-colors">
        <div>
          <div className="flex items-center gap-2 font-cinzel text-xs font-bold text-[#ffe082]">
            <span>{title} ({code})</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#150f08] border border-[#4a3418] text-[#c8972a]">
              Custo: {cost} pt{cost > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-[10px] text-[#8a7852] mt-0.5">{desc}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-bold text-base text-amber-400 font-cinzel">{val}</span>
          <button
            onClick={() => allocateStat(statKey)}
            disabled={!canAfford}
            className="p-1.5 rounded bg-[#c8972a] hover:bg-[#f0a830] disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-black transition-colors font-bold text-xs flex items-center gap-0.5"
            title={`Custa ${cost} Ponto(s)`}
          >
            <Plus className="w-3.5 h-3.5 font-bold" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner / Character Card */}
      <div className="medieval-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8972a]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            {/* Avatar Photo Display */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#c8972a] via-[#f0a830] to-[#8338ec] p-1 shadow-[0_0_20px_rgba(200,151,42,0.4)] cursor-pointer group transition-transform hover:scale-105"
              title="Clique para alterar foto ou avatar"
            >
              <div className="w-full h-full bg-[#150f08] rounded-full overflow-hidden flex items-center justify-center text-3xl">
                {customAvatarUrl ? (
                  <img src={customAvatarUrl} alt={name} className="w-full h-full object-cover rounded-full" />
                ) : selectedPreset ? (
                  <span>{selectedPreset.emoji}</span>
                ) : (
                  <span>⚔️</span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 p-1 rounded-full bg-[#c8972a] text-black shadow-md">
                <Camera className="w-3 h-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-cinzel text-2xl font-bold text-[#ffe082]">{name}</h1>
                <span className="px-2 py-0.5 rounded bg-[#3a2810] border border-[#816835] text-xs font-bold text-[#f0a830]">
                  Lvl {level}
                </span>
                {equippedPet && (
                  <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-purple-200 text-xs font-bold flex items-center gap-1">
                    <span>{equippedPet.icon}</span> {equippedPet.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8a7852] font-semibold mt-0.5">{characterClass} • Dungeon & Crown</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="medieval-btn-outline text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" /> Alterar Foto / Avatar
            </button>

            <button
              onClick={toggleAutoBattle}
              className={`px-3 py-2 rounded text-xs font-cinzel font-bold flex items-center gap-1.5 border transition-all ${
                isAutoBattle
                  ? 'bg-amber-500 text-black border-amber-300 shadow-[0_0_15px_rgba(240,168,48,0.5)] animate-pulse'
                  : 'bg-[#150f08] text-[#ffe082] border-[#816835] hover:bg-[#2a1e08]'
              }`}
            >
              {isAutoBattle ? <Square className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-[#ffe082]" />}
              <span>{isAutoBattle ? 'Auto-Idle Ativo' : 'Ativar Auto-Idle'}</span>
            </button>

            <button
              onClick={restInTavern}
              disabled={gold < 20 || (hp === maxHp && energy === maxEnergy)}
              className="medieval-btn text-xs py-2 px-3 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-300" /> Banquete (20 Ouro)
            </button>
          </div>
        </div>

        {/* Experience Bar */}
        <div className="mt-6 pt-4 border-t border-[#3a2810]">
          <div className="flex justify-between text-xs font-bold text-[#d4c59a] mb-1 font-cinzel">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Award className="w-4 h-4" /> Experiência (XP)
            </span>
            <span>{exp} / {maxExp} XP ({expPercent.toFixed(1)}%)</span>
          </div>
          <div className="h-3 w-full bg-[#060403] rounded-full border border-[#4a3418] overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-300 rounded-full transition-all duration-500"
              style={{ width: `${expPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Progressive Stat Allocation & Combat Power */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Atributos do Personagem com Custo Progressivo */}
        <div className="medieval-card p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#3a2810]">
            <div>
              <h2 className="font-cinzel text-base font-bold text-[#ffe082] flex items-center gap-2">
                ⚡ Pontos de Atributos
              </h2>
              <p className="text-[10px] text-[#8a7852]">Alocar custos progressivos conforme o atributo sobe.</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#2a1e08] border border-[#816835] text-xs font-cinzel font-bold text-amber-400">
              {statPoints} Pontos Disponíveis
            </span>
          </div>

          <div className="space-y-3">
            {renderStatBox('str', 'Força', 'STR', 'Aumenta Ataque Físico e Dano Crítico')}
            {renderStatBox('agi', 'Agilidade', 'AGI', 'Aumenta Taxa Crítica e Velocidade')}
            {renderStatBox('vit', 'Vitalidade', 'VIT', 'Aumenta Vida (HP) e Defesa Base')}
            {renderStatBox('int', 'Inteligência', 'INT', 'Aumenta Energia (EP) e Feitiços')}
          </div>
        </div>

        {/* Resumo de Poder de Combate */}
        <div className="medieval-card p-5 space-y-4">
          <div className="pb-2 border-b border-[#3a2810]">
            <h2 className="font-cinzel text-base font-bold text-[#ffe082] flex items-center gap-2">
              ⚔️ Poder Total de Batalha
            </h2>
            <p className="text-[10px] text-[#8a7852]">Combinado de estatísticas, equipamentos e pet ativo.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#060403] border border-[#3a2810] p-3 rounded-lg text-center">
              <span className="text-xs text-[#8a7852] font-cinzel font-bold uppercase">Ataque Total</span>
              <div className="font-cinzel text-2xl font-bold text-amber-400 mt-1">⚔️ {totalAtk}</div>
            </div>

            <div className="bg-[#060403] border border-[#3a2810] p-3 rounded-lg text-center">
              <span className="text-xs text-[#8a7852] font-cinzel font-bold uppercase">Defesa Total</span>
              <div className="font-cinzel text-2xl font-bold text-blue-400 mt-1">🛡️ {totalDef}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Character Creation Modal triggerable anytime */}
      <CharacterCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
