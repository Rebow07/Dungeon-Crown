'use client';

import React, { useState } from 'react';
import { useGame, CharacterClass } from '@/lib/gameContext';
import { UserCheck, Shield, Sparkles, Flame, CheckCircle2, User } from 'lucide-react';

export interface ClassAvatarInfo {
  className: CharacterClass;
  image: string;
  desc: string;
  icon: string;
  bonus: string;
}

export const CLASS_AVATARS: ClassAvatarInfo[] = [
  {
    className: 'Guerreiro',
    image: '/avatars/guerreiro.png',
    desc: 'Mestre do combate pesado com armadura de placas e espada rúnica.',
    icon: '⚔️',
    bonus: '+Força & +Vitalidade'
  },
  {
    className: 'Mago',
    image: '/avatars/mago.png',
    desc: 'Manipula feitiços arcanos devastadores e runas cósmicas.',
    icon: '🔮',
    bonus: '+Inteligência & +Energia'
  },
  {
    className: 'Arqueiro',
    image: '/avatars/arqueiro.png',
    desc: 'Atacante veloz com arco éfico e alta taxa de acertos críticos.',
    icon: '🏹',
    bonus: '+Agilidade & +Crítico'
  },
  {
    className: 'Paladino',
    image: '/avatars/paladino.png',
    desc: 'Defensor sagrado com escudo radiante e magias de luz.',
    icon: '🛡️',
    bonus: '+Vitalidade & +Defesa'
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CharacterCreationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { name, characterClass, createOrUpdateCharacter } = useGame();

  const [charName, setCharName] = useState(name || 'Loureiro');
  const [selectedClass, setSelectedClass] = useState<CharacterClass>(characterClass || 'Guerreiro');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentAvatarInfo = CLASS_AVATARS.find((c) => c.className === selectedClass) || CLASS_AVATARS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = charName.trim();
    if (trimmed.length < 2) {
      setErrorMsg('O nome do herói deve ter pelo menos 2 caracteres.');
      return;
    }
    setErrorMsg(null);
    const avatarId = `av_${selectedClass.toLowerCase()}`;
    createOrUpdateCharacter(trimmed, selectedClass, avatarId, currentAvatarInfo.image);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="medieval-card w-full max-w-lg p-6 animate-auth-glow space-y-5 my-8">
        <div className="text-center pb-3 border-b border-[#3a2810]">
          <h2 className="font-cinzel text-xl font-bold text-[#ffe082] flex items-center justify-center gap-2">
            <User className="w-5 h-5 text-amber-400" /> Criar Herói estilo D&D
          </h2>
          <p className="text-xs text-[#8a7852]">Escolha o nome de batalha e a classe para carregar a ilustração D&D oficial.</p>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs font-bold" role="alert">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Selected Class Avatar D&D Preview */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#060403] border border-[#816835] text-center">
          <div className="w-24 h-24 rounded-full border-2 border-amber-400 shadow-[0_0_20px_rgba(200,151,42,0.5)] overflow-hidden mb-2">
            <img src={currentAvatarInfo.image} alt={currentAvatarInfo.className} className="w-full h-full object-cover" />
          </div>
          <div className="font-cinzel text-sm font-bold text-[#ffe082] flex items-center gap-1.5">
            <span>{currentAvatarInfo.icon}</span>
            <span>Avatar D&D: {currentAvatarInfo.className}</span>
          </div>
          <p className="text-[10px] text-[#8a7852] mt-0.5 max-w-xs">{currentAvatarInfo.desc}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome do Personagem */}
          <div>
            <label className="block text-xs font-cinzel font-bold text-[#d4c59a] mb-1">Nome do Personagem (2-24 caracteres)</label>
            <input
              type="text"
              required
              maxLength={24}
              value={charName}
              onChange={(e) => {
                setCharName(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Ex: Loureiro"
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
                      ? 'bg-[#2a1e08] border-[#f0a830] text-[#ffe082] shadow-[0_0_12px_rgba(200,151,42,0.4)]'
                      : 'bg-[#060403] border-[#3a2810] text-[#8a7852] hover:border-[#816835]'
                  }`}
                >
                  <img src={c.image} alt={c.className} className="w-9 h-9 rounded-full object-cover border border-[#816835]" />
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

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="medieval-btn-outline text-xs py-2 px-4">
              Cancelar
            </button>
            <button type="submit" className="medieval-btn text-xs py-2 px-6">
              <UserCheck className="w-4 h-4" /> Confirmar Herói
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
