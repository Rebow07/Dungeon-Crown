'use client';

import React, { useState } from 'react';
import { useGame, CharacterClass } from '@/lib/gameContext';
import { UserCheck, Shield, Sparkles, Flame, CheckCircle2, User, Upload, Image as ImageIcon } from 'lucide-react';

export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  border: string;
}

export const AVATARS: AvatarOption[] = [
  { id: 'av_paladin', name: 'Paladino Dourado', emoji: '🛡️', border: 'border-amber-500' },
  { id: 'av_mage', name: 'Arquimago Arcano', emoji: '🔮', border: 'border-[#8338ec]' },
  { id: 'av_archer', name: 'Caçadora Élfica', emoji: '🏹', border: 'border-emerald-500' },
  { id: 'av_warrior', name: 'Berserker Nórdico', emoji: '⚔️', border: 'border-red-500' },
  { id: 'av_priest', name: 'Paladino Sagrado', emoji: '✝️', border: 'border-yellow-400' },
  { id: 'av_assassin', name: 'Assassina da Sombra', emoji: '🗡️', border: 'border-purple-600' },
  { id: 'av_druid', name: 'Druida Ancestral', emoji: '🌿', border: 'border-teal-500' },
  { id: 'av_king', name: 'Rei Corado', emoji: '👑', border: 'border-amber-400' }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CharacterCreationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { name, characterClass, avatarId, customAvatarUrl, createOrUpdateCharacter } = useGame();

  const [charName, setCharName] = useState(name || 'Loureiro');
  const [selectedClass, setSelectedClass] = useState<CharacterClass>(characterClass || 'Guerreiro');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(avatarId || 'av_paladin');
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(customAvatarUrl || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const classesList: { name: CharacterClass; desc: string; icon: string; bonus: string }[] = [
    { name: 'Guerreiro', desc: 'Mestre no combate corpo a corpo com alta resistência.', icon: '⚔️', bonus: '+Força & +Vitalidade' },
    { name: 'Mago', desc: 'Manipula feitiços devastadores de longa distância.', icon: '🔮', bonus: '+Inteligência & +Energia' },
    { name: 'Arqueiro', desc: 'Atacante veloz com alta taxa de acertos críticos.', icon: '🏹', bonus: '+Agilidade & +Crítico' },
    { name: 'Paladino', desc: 'Defensor sagrado com ótimo equilíbrio de defesa e HP.', icon: '🛡️', bonus: '+Vitalidade & +Defesa' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('A foto deve ser menor que 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setUploadedPhoto(base64);
      setSelectedAvatar('av_custom');
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = charName.trim();
    if (trimmed.length < 2) {
      setErrorMsg('O nome do herói deve ter pelo menos 2 caracteres.');
      return;
    }
    setErrorMsg(null);
    createOrUpdateCharacter(trimmed, selectedClass, selectedAvatar, selectedAvatar === 'av_custom' ? uploadedPhoto : null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="medieval-card w-full max-w-lg p-6 animate-auth-glow space-y-5 my-8">
        <div className="text-center pb-3 border-b border-[#3a2810]">
          <h2 className="font-cinzel text-xl font-bold text-[#ffe082] flex items-center justify-center gap-2">
            <User className="w-5 h-5 text-amber-400" /> Escolha sua Foto / Avatar
          </h2>
          <p className="text-xs text-[#8a7852]">Selecione um retrato medieval ou envie uma foto personalizada do seu dispositivo.</p>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs font-bold" role="alert">
            ⚠️ {errorMsg}
          </div>
        )}

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

          {/* Upload de Foto Personalizada */}
          <div className="medieval-card p-3 bg-[#060403] border-dashed border-[#816835]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {uploadedPhoto ? (
                  <img src={uploadedPhoto} alt="Foto Personalizada" className="w-12 h-12 rounded-full border-2 border-amber-400 object-cover shadow-md" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#150f08] border border-[#3a2810] flex items-center justify-center text-amber-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="font-cinzel text-xs font-bold text-[#ffe082]">Foto Personalizada</div>
                  <p className="text-[10px] text-[#8a7852]">Envie uma imagem do seu dispositivo (PNG/JPG)</p>
                </div>
              </div>

              <label className="medieval-btn text-xs py-1.5 px-3 cursor-pointer flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Enviar Foto</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Galeria de Avatares Predefinidos */}
          <div>
            <label className="block text-xs font-cinzel font-bold text-[#d4c59a] mb-2">Ou escolha um Retrato Medieval:</label>
            <div className="grid grid-cols-4 gap-2">
              {AVATARS.map((av) => (
                <div
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`p-2.5 rounded-lg bg-[#060403] border text-center cursor-pointer transition-all ${
                    selectedAvatar === av.id
                      ? `${av.border} bg-[#2a1e08] shadow-[0_0_12px_rgba(200,151,42,0.4)] scale-105`
                      : 'border-[#3a2810] hover:border-[#816835]'
                  }`}
                >
                  <div className="text-2xl mb-1">{av.emoji}</div>
                  <div className="text-[9px] font-bold text-[#8a7852] truncate">{av.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Seleção de Classe */}
          <div>
            <label className="block text-xs font-cinzel font-bold text-[#d4c59a] mb-2">Classe de Batalha</label>
            <div className="grid grid-cols-2 gap-2">
              {classesList.map((c) => (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => setSelectedClass(c.name)}
                  className={`p-2.5 rounded border text-left transition-all ${
                    selectedClass === c.name
                      ? 'bg-[#2a1e08] border-[#f0a830] text-[#ffe082] shadow-[0_0_10px_rgba(200,151,42,0.3)]'
                      : 'bg-[#060403] border-[#3a2810] text-[#8a7852] hover:border-[#816835]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-cinzel font-bold text-xs">
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                  </div>
                  <div className="text-[10px] text-[#c8972a] mt-1 font-semibold">{c.bonus}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="medieval-btn-outline text-xs py-2 px-4">
              Cancelar
            </button>
            <button type="submit" className="medieval-btn text-xs py-2 px-6">
              <UserCheck className="w-4 h-4" /> Salvar Herói
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
