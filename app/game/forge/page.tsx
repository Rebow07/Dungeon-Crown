'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame, EXPANDED_RECIPES, CraftingRecipe } from '@/lib/gameContext';
import { Hammer, Sparkles, Coins, CheckCircle2, AlertTriangle, Shield, Flame } from 'lucide-react';

export default function ForgePage() {
  const router = useRouter();
  const { isLoggedIn, inventory, gold, craftItem } = useGame();

  const [selectedRecipe, setSelectedRecipe] = useState<CraftingRecipe>(EXPANDED_RECIPES[0]);
  const [craftStatus, setCraftStatus] = useState<{ success: boolean; msg: string } | null>(null);

  if (!isLoggedIn) {
    if (typeof window !== 'undefined') router.push('/');
    return null;
  }

  const checkRequirements = (recipe: CraftingRecipe) => {
    const hasGold = gold >= recipe.goldCost;
    const materialsStatus = recipe.requiredMaterials.map((req) => {
      const invItem = inventory.find((i) => i.id === req.itemId);
      const currentCount = invItem?.quantity || 0;
      return {
        ...req,
        currentCount,
        isMet: currentCount >= req.count
      };
    });

    const allMaterialsMet = materialsStatus.every((m) => m.isMet);
    return { hasGold, materialsStatus, canCraft: hasGold && allMaterialsMet };
  };

  const handleCraft = () => {
    const success = craftItem(selectedRecipe);
    if (success) {
      setCraftStatus({
        success: true,
        msg: `⚒️ Forja lendária concluída com sucesso! ${selectedRecipe.resultItem.name} foi adicionado ao seu inventário!`
      });
    } else {
      setCraftStatus({
        success: false,
        msg: '⚠️ Falha na forja: Recursos ou ouro insuficientes!'
      });
    }
  };

  const reqCheck = checkRequirements(selectedRecipe);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-3 border-b border-[#3a2810]">
        <h1 className="font-cinzel text-2xl font-bold text-[#ffe082] flex items-center gap-2">
          <Hammer className="w-6 h-6 text-amber-400" /> Bigorna do Armeiro Rúnico
        </h1>
        <p className="text-xs text-[#8a7852]">Combine materiais raros de masmorras e caçadas para forjar equipamentos lendários de conjunto.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recipe Selection List */}
        <div className="space-y-3">
          <h2 className="font-cinzel text-xs font-bold text-[#8a7852] uppercase tracking-wider">
            Receitas Disponíveis:
          </h2>

          {EXPANDED_RECIPES.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => {
                setSelectedRecipe(recipe);
                setCraftStatus(null);
              }}
              className={`medieval-card p-3 cursor-pointer transition-all ${
                selectedRecipe.id === recipe.id
                  ? 'border-[#f0a830] bg-[#2a1e08]/90 shadow-[0_0_15px_rgba(200,151,42,0.4)]'
                  : 'hover:border-[#816835] hover:bg-[#150f08]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl p-2 bg-[#060403] rounded border border-[#3a2810]">
                  {recipe.resultItem.type === 'Arma' ? '🗡️' : '🥋'}
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-xs text-[#ffe082]">{recipe.resultItem.name}</h3>
                  <span className="text-[10px] text-amber-400 font-bold">{recipe.resultItem.rarity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Crafting Workbench */}
        <div className="md:col-span-2 space-y-4">
          <div className="medieval-card p-6">
            <div className="flex items-center gap-4 pb-4 border-b border-[#3a2810]">
              <div className="text-4xl p-3 bg-[#060403] rounded-lg border border-[#816835]">
                {selectedRecipe.resultItem.type === 'Arma' ? '🗡️' : '🥋'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel text-xl font-bold text-[#ffe082]">{selectedRecipe.resultItem.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                    {selectedRecipe.resultItem.rarity}
                  </span>
                </div>
                <p className="text-xs text-[#8a7852] mt-0.5">{selectedRecipe.resultItem.description}</p>
              </div>
            </div>

            {/* Requisitos de Materiais */}
            <div className="mt-4 space-y-3">
              <h4 className="font-cinzel text-xs font-bold text-[#d4c59a] uppercase tracking-wider">
                Materiais Necessários para Forjar:
              </h4>

              <div className="space-y-2">
                {/* Cost in Gold */}
                <div className="flex items-center justify-between p-2.5 rounded bg-[#060403] border border-[#3a2810]">
                  <div className="flex items-center gap-2 text-xs text-[#ffe082] font-bold">
                    <Coins className="w-4 h-4 text-amber-400" /> Custo em Ouro
                  </div>
                  <span className={`text-xs font-bold ${reqCheck.hasGold ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedRecipe.goldCost} Ouro (Possui: {gold})
                  </span>
                </div>

                {/* Material list */}
                {reqCheck.materialsStatus.map((mat) => (
                  <div
                    key={mat.itemId}
                    className="flex items-center justify-between p-2.5 rounded bg-[#060403] border border-[#3a2810]"
                  >
                    <div className="flex items-center gap-2 text-xs text-[#ffe082]">
                      <Sparkles className="w-4 h-4 text-purple-400" /> {mat.name}
                    </div>
                    <span className={`text-xs font-bold ${mat.isMet ? 'text-emerald-400' : 'text-red-400'}`}>
                      {mat.currentCount} / {mat.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status Message */}
              {craftStatus && (
                <div
                  className={`p-3 rounded-lg border text-xs font-bold mt-3 ${
                    craftStatus.success
                      ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                      : 'bg-red-950/40 border-red-900 text-red-300'
                  }`}
                >
                  {craftStatus.msg}
                </div>
              )}

              {/* Craft Button */}
              <div className="pt-4">
                <button
                  onClick={handleCraft}
                  disabled={!reqCheck.canCraft}
                  className="medieval-btn py-3 px-6 text-sm w-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Hammer className="w-5 h-5" /> Forjar Item Relíquia
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
