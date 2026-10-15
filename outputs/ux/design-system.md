# Design System — Sistema de Gerenciamento de Tarefas

**Autor:** UX Designer *(handoff para UI Designer e Frontend Dev)*
**Versão:** 1.0
**Data:** 2026-10-15
**Stack alvo:** Vue 3 + TypeScript + Tailwind CSS (RES-1..RES-3)
**Base:** `wireframes/wireframes.md`, `prototypes/prototypes.md`, `requirements.md` §6.8 / RES-7

> Escopo de **UX** (interação, semântica e acessibilidade). A camada de **identidade visual
> detalhada** (marca, ilustrações, assets) é responsabilidade do **UI Designer** — este
> documento define os tokens e componentes que ambos compartilham.

---

## 1. Princípios

1. **Clareza acima de tudo** — o status do trabalho deve ser legível de relance.
2. **Consistência** — mesmos componentes e tokens em lista, Kanban e modais.
3. **Acessível por padrão** — WCAG 2.1 AA, contraste e navegação por teclado.
4. **Calmo e profissional** — superfícies neutras, cor reservada para significado.
5. **Responsivo** — mobile-first, sem scroll horizontal indevido.

---

## 2. Tokens de Design

### 2.1 Cores (semânticas)

| Token | Uso | Light | Dark |
|-------|-----|-------|------|
| `--color-bg` | Fundo da app | `#F8FAFC` | `#0F172A` |
| `--color-surface` | Cards, modais | `#FFFFFF` | `#1E293B` |
| `--color-border` | Bordas/divisores | `#E2E8F0` | `#334155` |
| `--color-text` | Texto principal | `#0F172A` | `#F1F5F9` |
| `--color-text-muted` | Texto secundário | `#64748B` | `#94A3B8` |
| `--color-primary` | Ações primárias | `#2563EB` | `#3B82F6` |
| `--color-primary-hover` | Hover primário | `#1D4ED8` | `#60A5FA` |
| `--color-danger` | Ações destrutivas | `#DC2626` | `#EF4444` |
| `--color-focus` | Anel de foco | `#2563EB` | `#60A5FA` |

**Cores de status (semântica central — US-10):**

| Status | Token | Cor | Fundo suave | Ícone |
|--------|-------|-----|-------------|-------|
| A fazer | `--status-todo` | `#64748B` | `#F1F5F9` | ○ (círculo vazio) |
| Fazendo | `--status-doing` | `#D97706` | `#FEF3C7` | ◐ (meio) |
| Feito | `--status-done` | `#16A34A` | `#DCFCE7` | ✓ (check) |

> **Acessibilidade:** status nunca é comunicado **apenas** por cor — sempre acompanhado de
> rótulo textual e ícone (achado H-01). Contraste texto/fundo ≥ 4.5:1.

### 2.2 Tipografia

| Token | Tamanho | Peso | Uso |
|-------|---------|------|-----|
| `text-display` | 24px / 1.3 | 700 | Título da página |
| `text-h2` | 20px / 1.35 | 600 | Cabeçalho de coluna Kanban |
| `text-body` | 16px / 1.5 | 400 | Texto de tarefa |
| `text-sm` | 14px / 1.45 | 400 | Metadados, K/N |
| `text-xs` | 12px / 1.4 | 500 | Badges, labels |

- **Família:** `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` (leve, sem web font).
- Números tabulares para contadores `K/N` (evita "pulo" ao atualizar).

### 2.3 Espaçamento (escala de 4px)

| Token | Valor | Uso típico |
|-------|-------|-----------|
| `space-1` | 4px | Gap interno de badge |
| `space-2` | 8px | Gap entre ícone e texto |
| `space-3` | 12px | Padding interno de card |
| `space-4` | 16px | Padding padrão |
| `space-6` | 24px | Separação entre seções |
| `space-8` | 32px | Margem de container |
| `space-12` | 48px | Blocos do estado vazio |

### 2.4 Raio, sombra e movimento

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | 6px | Badges, inputs |
| `radius-md` | 10px | Cards, botões |
| `radius-lg` | 16px | Modais |
| `shadow-sm` | `0 1px 2px rgba(15,23,42,.08)` | Cards em repouso |
| `shadow-md` | `0 8px 24px rgba(15,23,42,.12)` | Hover, dropdown |
| `shadow-lg` | `0 20px 48px rgba(15,23,42,.22)` | Modais |
| `duration-fast` | 150ms | Check, hover |
| `duration-base` | 250ms | Migração de card |
| `easing-standard` | `cubic-bezier(.4,0,.2,1)` | Padrão |
| `reduced-motion` | — | Respeitar `prefers-reduced-motion` |

### 2.5 Grid e breakpoints

| Breakpoint | Largura | Container | Colunas Kanban |
|------------|---------|-----------|----------------|
| `sm` | ≥ 640px | 100% – 32px | abas/scroll |
| `md` | ≥ 768px | 100% – 48px | 3 estreitas |
| `lg` | ≥ 1024px | 960px | 3 amplas |
| `xl` | ≥ 1280px | 1120px | 3 amplas + respiro |

---

## 3. Componentes (especificação)

### 3.1 Button

| Variante | Uso | Estilo base |
|----------|-----|-------------|
| Primary | Ação principal ("Salvar", "+ Nova") | Fundo `--color-primary`, texto branco |
| Secondary | Cancelar / neutro | Borda `--color-border`, texto principal |
| Danger | Excluir | Fundo/texto `--color-danger` |
| Ghost | Ações de ícone (`⋮`, `×`) | Sem fundo até hover |

- Alturas: 40px (padrão), 36px (compacto), 32px (ícone).
- Estados: default, hover, active, focus (anel 2px `--color-focus`), disabled (opacidade .5), loading (spinner + texto).
- Alvo de toque ≥ 44px no mobile.

### 3.2 Input / Textarea

- Label visível acima do campo; `*` indica obrigatório.
- Estados: default, focus (borda + anel), error (borda `--color-danger` + mensagem), disabled.
- Mensagem de erro com ícone, texto e `aria-describedby`.
- Textarea com auto-grow (opcional) e contador quando houver limite.

### 3.3 Badge de Status (`StatusBadge`)

```
┌────────────┐   props: status = todo | doing | done
│ ✓  Feito    │   → cor de fundo suave + texto + ícone
└────────────┘   aria-label="Status: Feito"
```
- Consistente em card, detalhe e Kanban.
- Nunca apenas cor.

### 3.4 Card de Tarefa (`TaskCard`)

- Conteúdo: nome, descrição (1–2 linhas, truncada), `StatusBadge`, progresso `K/N`, barra.
- Ações em hover/focus: `⋮` (Editar/Excluir).
- Card clicável → detalhes; foco por teclado (`Enter`/`Space`).
- `role`, `tabindex` e rótulos acessíveis.

### 3.5 Barra de Progresso (`ProgressBar`)

- Derivada de `feitas/total` (US-09).
- Sem subtarefas → indicador neutro `0/0`, sem barra colorida.
- `role="progressbar"`, `aria-valuenow/min/max`.

### 3.6 Coluna Kanban (`KanbanColumn`)

- Cabeçalho: título + contagem `(n)` (US-17).
- Corpo: lista de `TaskCard`; estado vazio "Nenhuma tarefa aqui".
- Empilhável em mobile; mantém badge visível.

### 3.7 Modal / Dialog

- Overlay `rgba(15,23,42,.5)`; superfície `radius-lg`, `shadow-lg`.
- Foco preso dentro; `Esc` fecha; retorno de foco ao abridor.
- `role="dialog"` `aria-modal="true"` com `aria-labelledby`.

### 3.8 Toast (`Toast`)

- Variantes: success (verde), error (vermelho), info (neutro).
- Posição: inferior-direita (desktop), topo (mobile); auto-dismiss 4s (erro: manual).
- Empilháveis (máx. 3); `aria-live="polite"`.

### 3.9 Filtros e Busca

- `SearchInput` com ícone de lupa, botão `×` quando preenchido.
- `StatusFilter` (select) + **chips** de filtros ativos (achado H-04) + "Limpar".
- Combinação AND.

### 3.10 Paginação (`Pagination`)

- `‹ Anterior` · "Página X de Y" · `Próxima ›`.
- Setas desabilitadas nos limites; reinicia p/ página 1 ao filtrar (US-14).

### 3.11 Estados (EmptyState / Skeleton)

- `EmptyState`: ícone/ilustração + título + descrição + CTA.
- `Skeleton`: cards/colunas com shimmer; respeita `prefers-reduced-motion`.

---

## 4. Padrões de Layout

- **Header fixo** com título, seletor de visão e ação primária.
- **Toolbar** de filtros/ busca apenas na visão Lista (Kanban usa os mesmos filtros, sem a toolbar visual — decisão a validar).
- **Densidade:** confortável (público amplo: Carla e Rafael).
- **Alinhamento:** tudo na grade de 4px; cards com sombra sutil.

---

## 5. Acessibilidade (checklist WCAG 2.1 AA)

- [ ] Contraste texto ≥ 4.5:1; UI/ícones ≥ 3:1.
- [ ] Todo controle acessível por **teclado** (Tab/Shift+Tab, Enter/Space).
- [ ] Foco visível (anel de 2px) em todos os elementos interativos.
- [ ] Modais com foco preso e `aria-modal`.
- [ ] Status comunicado por texto + ícone, não só cor.
- [ ] `aria-live` em toasts e contadores de progresso.
- [ ] Labels associados (`<label for>` / `aria-label`).
- [ ] Textos alternativos em ícones/ilustrações significativas.
- [ ] Alvos de toque ≥ 44×44px no mobile.
- [ ] Respeitar `prefers-reduced-motion`.
- [ ] Zoom até 200% sem perda de conteúdo/funcionalidade.

---

## 6. Conteúdo e Tom de Voz

- **Direto e encorajador.** Verbos de ação ("Criar", "Salvar", "Concluir").
- Mensagens de erro orientam a correção ("Nome é obrigatório.").
- Portugal/Brasil: português neutro, "tarefa"/"subtarefa".
- Evitar jargão técnico para Carla (persona secundária não técnica).

---

## 7. Handoff e Governança

| Entregável | Responsável | Destino |
|-----------|-------------|---------|
| Tokens (cores, tipografia, espaçamento) | UX → UI Designer | `Tailwind config` |
| Componentes e estados | UX + UI Designer | Frontend Dev |
| Identidade visual/ilustrações | UI Designer | Frontend Dev |
| Checklist de acessibilidade | UX | Frontend Dev + Tester |

**Versionamento:** alterações de token/componente exigem atualização deste documento e
revisão de acessibilidade antes do merge.

---

## Anexo A — Mapeamento Token → Tailwind (exemplo ilustrativo)

```js
// tailwind.config.js (ilustrativo — implementação é do Frontend Dev)
export default {
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        primary: { DEFAULT: '#2563EB', hover: '#1D4ED8' },
        danger: '#DC2626',
        status: { todo: '#64748B', doing: '#D97706', done: '#16A34A' },
      },
      borderRadius: { sm: '6px', md: '10px', lg: '16px' },
    },
  },
}
```

## Anexo B — Relação com os requisitos do PO

- §6.8 UX/UI e RES-7 → acessibilidade, consistência e responsividade.
- Objetivo OBJ-5 (WCAG AA) → §5 deste documento.
- US-10 (status derivado) → §2.1 e §3.3.
- US-19/20/21 → §3.4, §3.8, §3.11 e §4.
