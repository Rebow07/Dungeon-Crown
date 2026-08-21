'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame, CharacterClass } from '@/lib/gameContext';
import { AVATARS } from '@/components/CharacterCreationModal';
import { Settings, User, RefreshCw, Volume2, Shield, Sparkles, CheckCircle2, Flame, Trophy, Upload, Image as ImageIcon } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { isLoggedIn, name, characterClass, avatarId, customAvatarUrl, createOrUpdateCharacter, resetStats, statPoints, level, gold, clickPower, dps } = useGame();

  const [charName, setCharName] = useState(name);
  const [selectedClass, setSelectedClass] = useState<CharacterClass>(characterClass);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(avatarId);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(customAvatarUrl || null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  if (!isLoggedIn) {
    if (typeof window !== 'undefined') router.push('/');
    return null;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setUploadedPhoto(base64);
      setSelectedAvatar('av_custom');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    createOrUpdateCharacter(charName.trim(), selectedClass, selectedAvatar, selectedAvatar === 'av_custom' ? uploadedPhoto : null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const classesList: { name: CharacterClass; bonus: string }[] = [
    { name: 'Guerreiro', bonus: '+Força & +Vitalidade' },
    { name: 'Mago', bonus: '+Inteligência & +Energia' },
    { name: 'Arqueiro', bonus: '+Agilidade & +Crítico' },
    { name: 'Paladino', bonus: '+Vitalidade & +Defesa' }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-3 border-b border-[#3a2810]">
        <h1 className="font-cinzel text-2xl font-bold text-[#ffe082] flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" /> Configurações do Herói & Perfil
        </h1>
        <p className="text-xs text-[#8a7852]">Altere seu nome, troque de avatar ou envie uma foto do computador, resete pontos de atributo e ajuste preferências de jogo.</p>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-700 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" /> Perfil e Foto do Avatar salvos com sucesso!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile & Avatar Editing Form */}
        <div className="md:col-span-2 medieval-card p-5 space-y-4">
          <h2 className="font-cinzel text-base font-bold text-[#ffe082] pb-2 border-b border-[#3a2810] flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" /> Escolha sua Foto ou Avatar
          </h2>

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

            {/* Upload de Foto Personalizada */}
            <div className="medieval-card p-3 bg-[#060403] border-dashed border-[#816835]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {uploadedPhoto ? (
                    <img src={uploadedPhoto} alt="Foto Personalizada" className="w-14 h-14 rounded-full border-2 border-amber-400 object-cover shadow-md" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#150f08] border border-[#3a2810] flex items-center justify-center text-amber-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <div className="font-cinzel text-xs font-bold text-[#ffe082]">Foto Personalizada</div>
                    <p className="text-[10px] text-[#8a7852]">Carregue uma imagem/foto do seu dispositivo</p>
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
              <label className="block text-xs font-cinzel font-bold text-[#d4c59a] mb-2">Ou selecione um Retrato Medieval:</label>
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
              <label className="block text-xs font-cinzel font-bold text-[#d4c59a] mb-2">Classe Principal</label>
              <div className="grid grid-cols-2 gap-2">
                {classesList.map((c) => (
                  <button
                    type="button"
                    key={c.name}
                    onClick={() => setSelectedClass(c.name)}
                    className={`p-2 rounded border text-left transition-all ${
                      selectedClass === c.name
                        ? 'bg-[#2a1e08] border-[#f0a830] text-[#ffe082]'
                        : 'bg-[#060403] border-[#3a2810] text-[#8a7852]'
                    }`}
                  >
                    <div className="font-cinzel font-bold text-xs">{c.name}</div>
                    <div className="text-[9px] text-[#c8892a]">{c.bonus}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="medieval-btn text-xs py-2.5 px-6">
                Salvar Foto e Perfil
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
                className={`px-3 py-1 rounded text-[10px] font-bold border ${
                  soundEnabled ? 'bg-emerald-950 border-emerald-700 text-emerald-300' : 'bg-gray-900 border-gray-700 text-gray-400'
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
