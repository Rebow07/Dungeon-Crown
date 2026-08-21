'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame, Item, EquipmentSlots } from '@/lib/gameContext';
import { Backpack, Shield, Swords, Sparkles, Coins, Coffee, Heart, Zap } from 'lucide-react';

export default function InventoryPage() {
  const router = useRouter();
  const { isLoggedIn, inventory, equipped, equipItem, unequipItem, useItem, sellItem, availablePets, equippedPet, equipPet } = useGame();

  const [activeTab, setActiveTab] = useState<'all' | 'equipment' | 'consumable' | 'material' | 'pets'>('all');

  if (!isLoggedIn) {
    if (typeof window !== 'undefined') router.push('/');
    return null;
  }

  const filteredInventory = inventory.filter((item) => {
    if (activeTab === 'equipment') {
      return ['Arma', 'Elmo', 'Armadura', 'Calça', 'Bota', 'Anel', 'Escudo'].includes(item.type);
    }
    if (activeTab === 'consumable') return item.type === 'Consumível';
    if (activeTab === 'material') return item.type === 'Material';
    return true;
  });

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return 'bg-gray-800 text-gray-300 border-gray-600';
      case 'Incomum': return 'bg-emerald-950 text-emerald-300 border-emerald-700';
      case 'Raro': return 'bg-blue-950 text-blue-300 border-blue-700';
      case 'Épico': return 'bg-purple-950 text-purple-300 border-purple-700';
      case 'Lendário': return 'bg-amber-950 text-amber-300 border-amber-500 shadow-[0_0_10px_rgba(240,168,48,0.4)]';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  const slotsList: { slotKey: keyof EquipmentSlots; label: string; icon: string }[] = [
    { slotKey: 'weapon', label: 'Arma Principal', icon: '⚔️' },
    { slotKey: 'shield', label: 'Escudo / Secundária', icon: '🛡️' },
    { slotKey: 'helmet', label: 'Elmo', icon: '🪖' },
    { slotKey: 'armor', label: 'Peitoral de Armadura', icon: '🥋' },
    { slotKey: 'pants', label: 'Grevas / Calças', icon: '👖' },
    { slotKey: 'boots', label: 'Botas de Combate', icon: '🥾' },
    { slotKey: 'ring', label: 'Anel Mágico', icon: '💍' }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-3 border-b border-[#3a2810]">
        <h1 className="font-cinzel text-2xl font-bold text-[#ffe082] flex items-center gap-2">
          <Backpack className="w-6 h-6 text-amber-400" /> Inventário, Equipamentos & Pets
        </h1>
        <p className="text-xs text-[#8a7852]">Gerencie seus equipamentos equipados, consumíveis e companions de batalha.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Paperdoll Equipped Slots */}
        <div className="medieval-card p-5 space-y-3">
          <h2 className="font-cinzel text-base font-bold text-[#ffe082] pb-2 border-b border-[#3a2810] flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" /> Equipados no Herói
          </h2>

          <div className="space-y-2">
            {slotsList.map(({ slotKey, label, icon }) => {
              const item = equipped[slotKey];

              return (
                <div
                  key={slotKey}
                  className="flex items-center justify-between p-2.5 rounded bg-[#060403] border border-[#3a2810]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl p-1.5 bg-[#150f08] rounded border border-[#4a3418]">{icon}</span>
                    <div>
                      <div className="text-[10px] text-[#8a7852] font-cinzel font-bold uppercase">{label}</div>
                      {item ? (
                        <div className="text-xs font-bold text-[#ffe082]">{item.name}</div>
                      ) : (
                        <div className="text-xs italic text-[#5a4a2a]">Vazio</div>
                      )}
                    </div>
                  </div>

                  {item && (
                    <button
                      onClick={() => unequipItem(slotKey)}
                      className="text-[10px] font-bold text-red-400 hover:text-red-300 px-2 py-1 bg-red-950/30 border border-red-900/50 rounded"
                    >
                      Remover
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Backpack Inventory Items Grid */}
        <div className="md:col-span-2 space-y-4">
          <div className="medieval-card p-5">
            {/* Tabs Filter */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#3a2810]">
              <div className="flex flex-wrap items-center gap-1">
                {(['all', 'equipment', 'consumable', 'material', 'pets'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded text-xs font-cinzel font-bold uppercase transition-all ${
                      activeTab === tab
                        ? 'bg-[#c8972a] text-black shadow-md'
                        : 'bg-[#060403] text-[#8a7852] border border-[#3a2810] hover:text-[#d4c59a]'
                    }`}
                  >
                    {tab === 'all' ? 'Todos' : tab === 'equipment' ? 'Equipamentos' : tab === 'consumable' ? 'Consumíveis' : tab === 'material' ? 'Materiais' : 'Pets Companheiros'}
                  </button>
                ))}
              </div>
            </div>

            {/* Pets Tab View */}
            {activeTab === 'pets' ? (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[300px]">
                {availablePets.map((pet) => {
                  const isEq = equippedPet?.id === pet.id;

                  return (
                    <div key={pet.id} className="p-3.5 rounded-lg bg-[#060403] border border-[#3a2810] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{pet.icon}</span>
                          <div>
                            <h3 className="font-cinzel text-xs font-bold text-[#ffe082]">{pet.name}</h3>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 font-bold">Nível {pet.level}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#8a7852] mt-1">{pet.description}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#150f08] flex items-center justify-between">
                        {isEq ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-800">
                            Equipado
                          </span>
                        ) : (
                          <button
                            onClick={() => equipPet(pet)}
                            className="px-2.5 py-1 rounded bg-[#c8972a] hover:bg-[#f0a830] text-black text-[10px] font-cinzel font-bold"
                          >
                            Equipar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Standard Inventory Grid */
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[300px]">
                {filteredInventory.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center text-[#6a5a38] py-12">
                    <Backpack className="w-10 h-10 mb-2 opacity-50" />
                    <p className="text-xs">Nenhum item nesta categoria.</p>
                  </div>
                ) : (
                  filteredInventory.map((item, idx) => (
                    <div
                      key={`${item.id}_${idx}`}
                      className="p-3 rounded-lg bg-[#060403] border border-[#3a2810] hover:border-[#816835] flex flex-col justify-between transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${getRarityBadge(item.rarity)}`}>
                            {item.rarity}
                          </span>
                          {item.quantity && item.quantity > 1 && (
                            <span className="text-xs font-bold text-amber-400">x{item.quantity}</span>
                          )}
                        </div>

                        <h3 className="font-cinzel text-xs font-bold text-[#ffe082] mt-1">{item.name}</h3>
                        <p className="text-[11px] text-[#8a7852] line-clamp-2 mt-0.5">{item.description}</p>

                        {/* Stats Bonus display */}
                        {Object.keys(item.stats).length > 0 && (
                          <div className="flex flex-wrap gap-2 text-[10px] text-emerald-400 font-bold mt-2 pt-2 border-t border-[#150f08]">
                            {item.stats.atk && <span>⚔️ +{item.stats.atk} Atk</span>}
                            {item.stats.def && <span>🛡️ +{item.stats.def} Def</span>}
                            {item.stats.str && <span>💪 +{item.stats.str} STR</span>}
                            {item.stats.vit && <span>❤️ +{item.stats.vit} VIT</span>}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-3 pt-2 border-t border-[#150f08] flex items-center justify-between gap-2">
                        <div className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                          <Coins className="w-3 h-3" /> {item.price} Ouro
                        </div>

                        <div className="flex items-center gap-1">
                          {['Arma', 'Elmo', 'Armadura', 'Calça', 'Bota', 'Anel', 'Escudo'].includes(item.type) && (
                            <button
                              onClick={() => equipItem(item)}
                              className="px-2.5 py-1 rounded bg-[#c8972a] hover:bg-[#f0a830] text-black text-[10px] font-cinzel font-bold"
                            >
                              Equipar
                            </button>
                          )}

                          {item.type === 'Consumível' && (
                            <button
                              onClick={() => useItem(item)}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-cinzel font-bold"
                            >
                              Usar
                            </button>
                          )}

                          <button
                            onClick={() => sellItem(item)}
                            className="px-2 py-1 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-300 text-[10px] font-bold"
                            title="Vender"
                          >
                            Vender
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
