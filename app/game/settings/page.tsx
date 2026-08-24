'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame, CharacterClass } from '@/lib/gameContext';
import { CLASS_AVATARS } from '@/components/CharacterCreationModal';
import { Settings, User, RefreshCw, Volume2, Shield, Sparkles, CheckCircle2, Flame, Trophy } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { isLoggedIn, name, characterClass, createOrUpdateCharacter, resetStats, statPoints, level, gold, clickPower, dps } = useGame();

  const [charName, setCharName] = useState(name);
  const [selectedClass, setSelectedClass] = useState<CharacterClass>(characterClass);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  if (!isLoggedIn) {
    if (typeof window !== 'undefined') router.push('/');
    return null;
  }

  const currentAvatarInfo = CLASS_AVATARS.find((c) => c.className === selectedClass) || CLASS_AVATARS[0];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = charName.trim();
    if (trimmed.length < 2) return;

    const avatarId = `av_${selectedClass.toLowerCase()}`;
    createOrUpdateCharacter(trimmed, selectedClass, avatarId, currentAvatarInfo.image);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-3 border-b border-[#3a2810]">
        <h1 className="font-cinzel text-2xl font-bold text-[#ffe082] flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" /> Configurações do Herói & Perfil D&D
        </h1>
        <p className="text-xs text-[#8a7852]">Altere seu nome, troque de classe para carregar o retrato D&D correspondente e resete pontos de atributo.</p>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Perfil e Retrato D&D atualizados com sucesso!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile & Class D&D Selection Form */}
        <div className="md:col-span-2 medieval-card p-5 space-y-4">
          <h2 className="font-cinzel text-base font-bold text-[#ffe082] pb-2 border-b border-[#3a2810] flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" /> Editar Perfil & Classe D&D
          </h2>

          {/* D&D Class Avatar Preview */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#060403] border border-[#816835]">
            <div className="w-20 h-20 rounded-full border-2 border-amber-400 shadow-[0_0_15px_rgba(200,151,42,0.4)] overflow-hidden">
              <img src={currentAvatarInfo.image} alt={currentAvatarInfo.className} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-cinzel text-sm font-bold text-[#ffe082] flex items-center gap-1.5">
                <span>{currentAvatarInfo.icon}</span>
                <span>Retrato D&D: {currentAvatarInfo.className}</span>
              </div>
              <p className="text-[11px] text-[#8a7852] mt-0.5">{currentAvatarInfo.desc}</p>
              <div className="text-[10px] text-amber-400 font-semibold mt-1">{currentAvatarInfo.bonus}</div>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Nome do Personagem */}
            <div>
              <label className="block text-xs font-cinzel font-bold text-[#d4c59a] mb-1">Nome do Personagem</label>
              <input
                type="text"
                required
                maxLength={24}
                value={charName}
                onChange={(e) => setCharName(e.target.value)}
                className="w-full bg-[#060403] border border-[#3a2810] focus:border-[#c8972a] rounded py-2 px-3 text-sm text-[#ffe082] outline-none transition-colors"
              />
            </div>

            {/* Seleção de Classe D&D */}
            <div>
              <label className="block text-xs font-cinzel font-bold text-[#d4c59a] mb-2">Escolha a Classe & Retrato D&D</label>
              <div className="grid grid-cols-2 gap-2">
                {CLASS_AVATARS.map((c) => (
                  <button
                    type="button"
                    key={c.className}
                    onClick={() => setSelectedClass(c.className)}
                    className={`p-2.5 rounded-lg border text-left transition-all flex items-center gap-2.5 ${
                      selectedClass === c.className
                        ? 'bg-[#2a1e08] border-[#f0a830] text-[#ffe082] shadow-[0_0_10px_rgba(200,151,42,0.3)]'
                        : 'bg-[#060403] border-[#3a2810] text-[#8a7852] hover:border-[#816835]'
                    }`}
                  >
                    <img src={c.image} alt={c.className} className="w-8 h-8 rounded-full object-cover border border-[#816835]" />
                    <div>
                      <div className="font-cinzel font-bold text-xs flex items-center gap-1">
                        <span>{c.icon}</span>
                        <span>{c.className}</span>
                      </div>
                      <div className="text-[9px] text-[#c8972a] font-semibold">{c.bonus}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="medieval-btn text-xs py-2.5 px-6">
                Salvar Alterações de Perfil
              </button>
            </div>
          </form>
        </div>

        {/* Reset Atributos & Preferências */}
        <div className="space-y-4">
          <div className="medieval-card p-5 space-y-3">
            <h3 className="font-cinzel text-sm font-bold text-[#ffe082] pb-2 border-b border-[#3a2810] flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-400" /> Resetar Atributos
            </h3>
            <p className="text-xs text-[#8a7852]">
              Reembolsa todos os pontos de atributo alocados para montar uma nova build.
            </p>
            <button
              onClick={resetStats}
              className="w-full medieval-btn-outline text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Redefinir Atributos
            </button>
          </div>

          <div className="medieval-card p-5 space-y-3">
            <h3 className="font-cinzel text-sm font-bold text-[#ffe082] pb-2 border-b border-[#3a2810] flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400" /> Preferências do Jogo
            </h3>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8a7852]">Efeitos Visuais e Sons</span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-3 py-1 rounded text-[10px] font-bold border transition-colors ${
                  soundEnabled ? 'bg-emerald-950 border-emerald-700 text-emerald-200' : 'bg-gray-900 border-gray-700 text-slate-300'
                }`}
              >
                {soundEnabled ? 'Ativado' : 'Desativado'}
              </button>
            </div>
          </div>

          <div className="medieval-card p-5 space-y-2 text-xs">
            <h3 className="font-cinzel text-sm font-bold text-[#ffe082] mb-2 border-b border-[#3a2810] pb-1">
              Resumo da Conta
            </h3>
            <div className="flex justify-between">
              <span className="text-[#8a7852]">Nível do Herói:</span>
              <span className="font-bold text-amber-400">Lvl {level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a7852]">Dano do Clique:</span>
              <span className="font-bold text-[#ffe082]">{clickPower}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a7852]">DPS Automático:</span>
              <span className="font-bold text-emerald-400">{dps} DPS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
