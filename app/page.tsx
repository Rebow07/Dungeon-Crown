'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/lib/gameContext';
import { CharacterCreationModal } from '@/components/CharacterCreationModal';
import { Crown, UserCheck, Lock, Mail, Store, Coffee, ShieldAlert, Repeat, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { login, isLoggedIn } = useGame();

  const [email, setEmail] = useState('loureiro934@gmail.com');
  const [password, setPassword] = useState('Tk11072208!');
  const [isCharModalOpen, setIsCharModalOpen] = useState(false);

  if (isLoggedIn) {
    router.push('/game');
    return null;
  }

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    setIsCharModalOpen(true);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center relative px-2">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#c8972a]/10 rounded-full blur-[140px]" />
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 animate-float">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#150f08] border border-[#816835] text-[#c8972a] text-xs font-bold font-cinzel mb-4 shadow-md">
          <Crown className="w-3.5 h-3.5 text-amber-400" /> DUNGEON & CROWN: WEB CHRONICLES
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black tracking-wider text-[#ffe082] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] mb-3 uppercase">
          Dungeon & Crown
        </h1>
        <p className="font-cinzel text-xs sm:text-sm tracking-[0.3em] uppercase text-[#c8972a] font-bold mb-3">
          Web Chronicles
        </p>
        <p className="text-[#8a7852] text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          O RPG Idle Medieval definitivo. Batalhas táticas com Dado D20 em Masmorras, Caça Automática, Pets Companheiros e Mercado de Mercadores.
        </p>
      </div>

      {/* Main Auth Form Card - Clean Authentication Only */}
      <div className="w-full max-w-md medieval-card p-6 sm:p-8 animate-auth-glow mb-12">
        <div className="text-center mb-6">
          <h2 className="font-cinzel text-xl font-bold text-[#ffe082] mb-1">
            Entrar no Reino
          </h2>
          <p className="text-xs text-[#8a7852]">
            Insira seu e-mail e senha de aventureiro para acessar sua conta
          </p>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-cinzel font-bold text-[#d4c59a] mb-1">E-mail de Acesso</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8a7852] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="loureiro934@gmail.com"
                className="w-full bg-[#060403] border border-[#3a2810] focus:border-[#c8972a] rounded py-2.5 pl-9 pr-3 text-sm text-[#ffe082] outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-cinzel font-bold text-[#d4c59a] mb-1">Senha Secreta</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8a7852] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#060403] border border-[#3a2810] focus:border-[#c8972a] rounded py-2.5 pl-9 pr-3 text-sm text-[#ffe082] outline-none transition-colors"
              />
            </div>
          </div>

          <button type="submit" className="w-full medieval-btn py-3.5 text-sm mt-2">
            <UserCheck className="w-4 h-4" /> Entrar no Jogo
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-[#3a2810] text-center">
          <p className="text-xs text-[#8a7852]">
            A criação de personagem e escolha de avatar acontecem dentro do jogo após o login.
          </p>
        </div>
      </div>

      {/* Character Creation Modal Component */}
      <CharacterCreationModal
        isOpen={isCharModalOpen}
        onClose={() => {
          setIsCharModalOpen(false);
          router.push('/game');
        }}
      />

      {/* Feature Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl w-full">
        <div className="medieval-card p-3.5 text-center">
          <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
          <h3 className="font-cinzel text-xs font-bold text-[#ffe082]">Combate Dado D20</h3>
          <p className="text-[10px] text-[#8a7852] mt-0.5">Role o Dado D20 em Masmorras para acertos normais, críticos e supremo 20!</p>
        </div>

        <div className="medieval-card p-3.5 text-center">
          <ShieldAlert className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
          <h3 className="font-cinzel text-xs font-bold text-[#ffe082]">Masmorras Dungeons</h3>
          <p className="text-[10px] text-[#8a7852] mt-0.5">Enfrente chefes gigantes para obter relicários rúnicos.</p>
        </div>

        <div className="medieval-card p-3.5 text-center">
          <Coffee className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
          <h3 className="font-cinzel text-xs font-bold text-[#ffe082]">Pets & Taverna</h3>
          <p className="text-[10px] text-[#8a7852] mt-0.5">Missões de caça e fadas/lobos para curar e infligir dano bônus.</p>
        </div>

        <div className="medieval-card p-3.5 text-center">
          <Store className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
          <h3 className="font-cinzel text-xs font-bold text-[#ffe082]">Mercado & Forja</h3>
          <p className="text-[10px] text-[#8a7852] mt-0.5">Compre insumos de NPCs e crie armas lendárias na bigorna.</p>
        </div>
      </div>
    </div>
  );
}
