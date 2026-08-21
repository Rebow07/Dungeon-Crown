---
name: Dungeon & Crown: Web Chronicles
description: Dark Fantasy Impeccable Design System para RPG Medieval Idle & PWA
colors:
  primary: "#c8972a"
  primary-light: "#ffe082"
  primary-gold-bright: "#f0a830"
  primary-gold-muted: "#a66a1a"
  obsidian-bg: "#060403"
  obsidian-dark: "#0d0905"
  panel-bg: "#150f08"
  panel-border: "#3a2810"
  panel-border-amber: "#816835"
  crimson-accent: "#e63946"
  mystic-blue: "#3a86ff"
  purple-mana: "#8338ec"
  emerald-heal: "#2a9d8f"
typography:
  display:
    fontFamily: "Cinzel, serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Lato, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  subbody:
    fontSize: "11px"
    fontWeight: 500
  caption:
    fontSize: "10px"
    fontWeight: 600
  micro:
    fontSize: "9px"
    fontWeight: 700
rounded:
  xs: "3px"
  sm: "4px"
  md: "8px"
  lg: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#000000"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
---

# Design System: Dungeon & Crown: Web Chronicles

## Overview

**Creative North Star: "The Crowned Obsidian Vault"**

Dungeon & Crown é construído sobre uma estética Dark Fantasy imersiva com suporte a seletores de repetição de combate (1x, 5x, 10x, 25x, 50x, Auto). A interface combina texturas de pergaminho escurecido (`#150f08`) com contornos de coroas douradas e detalhes em cristal elemental.

### Key Characteristics:
- **Painéis de Ouro Rúnico:** Molduras e bordas tratadas em degradê dourado com sombras de profundidade.
- **Botões de Repetição Rápida:** Controles visuais para definir contagem de repetição de caça e masmorras.
- **Dado D20 Interativo:** Componente visual por turnos com atalhos de teclado (Espaço/Enter) e região aria-live.
- **Micro-interações Reativas:** Efeitos visuais de corte de lâmina, brilho de mana e popups de dano em combate.
- **Layout PWA Mobile-First:** Elementos dimensionados para fácil navegação por toque em modo portrait.

## Colors

### Primary & Gold Tonal Ramp
- **Gold Primary** (`#c8972a` / `#ffe082`): Destaques principais, botões de ação e títulos de nobreza.
- **Gold Bright** (`#f0a830`): Brilhos ativos, acertos críticos e bordas selecionadas.
- **Gold Muted** (`#a66a1a` / `#816835`): Bordas secundárias e estados desabilitados.

### Secondary
- **Crimson Blood** (`#e63946`): Dano recebido, HP e botões de perigo/ataque.
- **Mystic Blue & Mana Purple** (`#3a86ff` / `#8338ec`): Energia, feitiços e itens épicos.
- **Emerald Heal** (`#2a9d8f`): Habilidades de cura dos pets e ganho de vida.

### Neutral
- **Obsidian Dark** (`#060403` / `#0d0905`): Fundo geral da aplicação e sombras.
- **Ancient Panel** (`#150f08`): Cartões e modais do jogo.
- **Gold Border** (`#3a2810` / `#4a3418`): Divisores e linhas de contorno.

## Typography

**Display Font:** `Cinzel, serif` (Títulos e logotipos).
**Body Font:** `Lato, sans-serif` (Textos e estatísticas).
**Subbody Size:** `11px` (Textos auxiliares e subtítulos de cartões).
**Caption Size:** `10px` (Selos e rótulos de navegação).
**Micro Size:** `9px` (Badges de níveis e pequenos contadores).
