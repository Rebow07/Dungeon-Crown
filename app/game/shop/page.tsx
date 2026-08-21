'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame, Item } from '@/lib/gameContext';
import { Store, Coins, ShoppingBag, ArrowRightLeft, Sparkles, CheckCircle2, Shield } from 'lucide-react';

const SHOP_ITEMS: Item[] = [
  {
    id: 'pot_hp_small',
    name: 'Poção de Vida Menor',
    description: 'Restaura 50 pontos de HP instantaneamente.',
    type: 'Consumível',
    rarity: 'Comum',
    levelReq: 1,
    stats: {},
    iconName: 'FlaskConical',
    price: 30
  },
  {
    id: 'pot_hp_large',
    name: 'Elixir Vitalício Maior',
    description: 'Restaura 150 pontos de HP instantaneamente.',
    type: 'Consumível',
    rarity: 'Incomum',
    levelReq: 3,
    stats: {},
    iconName: 'FlaskConical',
    price: 80
  },
  {
    id: 'crate_mystery_weapon',
    name: 'Crate Misterioso de Armas',
    description: 'Contém uma arma aleatória Rara para o seu nível.',
    type: 'Arma',
    rarity: 'Raro',
    levelReq: 2,
    stats: { atk: 22, str: 5 },
    iconName: 'Package',
    price: 200
  },
  {
    id: 'mat_goblin_iron',
    name: 'Ferro de Goblin',
    description: 'Material de forja importado.',
    type: 'Material',
    rarity: 'Comum',
    levelReq: 1,
    stats: {},
    iconName: 'Hammer',
    price: 25
  }
];

export default function ShopPage() {
  const router = useRouter();
  const { isLoggedIn, gold, buyItemFromShop, inventory, sellItem } = useGame();

  const [shopMsg, setShopMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isLoggedIn) {
    if (typeof window !== 'undefined') router.push('/');
    return null;
  }

  const handleBuy = (item: Item) => {
    const ok = buyItemFromShop(item);
    if (ok) {
      setShopMsg({ success: true, text: `🛒 Comprado: ${item.name} foi adicionado ao seu inventário!` });
    } else {
      setShopMsg({ success: false, text: `⚠️ Ouro insuficiente para comprar ${item.name}!` });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-3 border-b border-[#3a2810]">
        <h1 className="font-cinzel text-2xl font-bold text-[#ffe082] flex items-center gap-2">
          <Store className="w-6 h-6 text-amber-400" /> Mercado do Mercador NPC
        </h1>
        <p className="text-xs text-[#8a7852]">Compre suprimentos essenciais, poções de combate e venda seus espólios por moedas de ouro.</p>
      </div>

      {shopMsg && (
        <div
          className={`p-3 rounded-lg border text-xs font-bold ${
            shopMsg.success ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300' : 'bg-red-950/40 border-red-900 text-red-300'
          }`}
        >
          {shopMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loja de Compras */}
        <div className="medieval-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#3a2810]">
            <h2 className="font-cinzel text-base font-bold text-[#ffe082] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" /> Balcão de Vendas (Comprar)
            </h2>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Coins className="w-4 h-4" /> {gold} Ouro
            </span>
          </div>

          <div className="space-y-3">
            {SHOP_ITEMS.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg bg-[#060403] border border-[#3a2810] hover:border-[#816835] flex items-center justify-between transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel font-bold text-xs text-[#ffe082]">{item.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#150f08] border border-[#3a2810] text-amber-400 uppercase font-bold">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8a7852] mt-0.5">{item.description}</p>
                </div>

                <button
                  onClick={() => handleBuy(item)}
                  disabled={gold < item.price}
                  className="px-3 py-1.5 rounded bg-[#c8972a] hover:bg-[#f0a830] disabled:opacity-40 text-black text-xs font-cinzel font-bold flex items-center gap-1"
                >
                  <Coins className="w-3.5 h-3.5" /> {item.price}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Vender Itens do Inventário */}
        <div className="medieval-card p-5 space-y-4">
          <div className="pb-2 border-b border-[#3a2810]">
            <h2 className="font-cinzel text-base font-bold text-[#ffe082] flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-amber-400" /> Vender Seus Espólios
            </h2>
            <p className="text-[10px] text-[#8a7852]">Venda materiais e equipamentos excedentes do seu inventário por Ouro.</p>
          </div>

          <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
            {inventory.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#6a5a38]">Seu inventário está vazio.</div>
            ) : (
              inventory.map((invItem, idx) => (
                <div
                  key={`${invItem.id}_${idx}`}
                  className="p-3 rounded-lg bg-[#060403] border border-[#3a2810] flex items-center justify-between"
                >
                  <div>
                    <div className="font-cinzel font-bold text-xs text-[#ffe082]">
                      {invItem.name} {invItem.quantity && invItem.quantity > 1 ? `(x${invItem.quantity})` : ''}
                    </div>
                    <p className="text-[10px] text-[#8a7852]">{invItem.description}</p>
                  </div>

                  <button
                    onClick={() => sellItem(invItem)}
                    className="px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-900 border border-amber-800 text-amber-300 text-xs font-bold flex items-center gap-1"
                  >
                    + {invItem.price} 🪙 Vender
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
