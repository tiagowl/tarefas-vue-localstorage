# Guia de Desenvolvimento — Sistema de Gerenciamento de Tarefas

**Autor:** Arquiteto de Software
**Versão:** 1.0
**Data:** 2026-10-15
**Fontes:** `outputs/architect/architecture-diagram.md`, `tech-stack.md`, `design-patterns.md`, `outputs/ux/design-system.md`

Guia prático e prescritivo para o **Frontend Dev**. Define estrutura de código, convenções,
qualidade e fluxo de trabalho.

---

## 1. Estrutura de Pastas

```
src/
├── domain/                    # TS puro (sem vue/pinia)
│   ├── models.ts              # Task, Subtask, Status, TaskFilters
│   ├── status.ts              # deriveStatus (US-10)
│   ├── query.ts               # filterTasks, paginate
│   └── id.ts                  # createId (adapter crypto)
├── data/                      # Persistência
│   ├── TaskRepository.ts      # interface
│   ├── LocalStorageTaskRepository.ts
│   └── schema.ts              # envelope v1 + migrations
├── stores/                    # Pinia
│   ├── taskStore.ts
│   └── uiStore.ts
├── composables/               # lógica reutilizável de UI
│   ├── useDebounce.ts
│   └── useToast.ts
├── components/                # apresentação
│   ├── common/                # BaseModal, BaseButton, BaseInput, ToastHost, EmptyState
│   ├── task/                  # TaskCard, TaskForm, TaskFormModal, SubtaskList, SubtaskItem
│   ├── status/                # StatusBadge, ProgressBar
│   ├── filters/               # FilterBar, SearchInput, StatusFilter
│   ├── kanban/                # KanbanView, KanbanColumn
│   └── list/                  # TaskListView, Pagination
├── assets/                    # estilos globais (tokens Tailwind)
├── App.vue
└── main.ts
tests/
├── unit/                      # Vitest (domain/)
├── component/                 # @vue/test-utils
└── e2e/                       # Playwright
```

**Regra de dependência (ESLint `no-restricted-imports`):**
`domain/` ❌ importa `vue`, `pinia`, `stores/`, `data/`, `components/`.

---

## 2. Convenções de Nomenclatura

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| Componentes (arquivo) | PascalCase `.vue` | `TaskCard.vue`, `StatusBadge.vue` |
| Composables | camelCase prefixo `use` | `useDebounce.ts` |
| Stores | camelCase sufixo `Store` | `taskStore.ts` |
| Módulos/utilitários | camelCase | `status.ts`, `query.ts` |
| Tipos/Interfaces | PascalCase | `Task`, `TaskFilters` |
| Tipos de união | PascalCase | `Status` (`'todo' \| 'doing' \| 'done'`) |
| Variáveis/funções | camelCase | `deriveStatus`, `toggleSubtask` |
| Constantes | SCREAMING_SNAKE_CASE | `PAGE_SIZE`, `STORAGE_KEY` |
| Eventos (emits) | kebab-case | `update:filters`, `open`, `edit` |
| CSS classes (Tailwind) | utilitários + `data-testid` | `class="flex gap-2"` |
| Chaves de storage | `dominio:recurso:vN` | `tarefas:data:v1` |

**Idioma do código:** inglês (identificadores). **Idioma da UI:** português (design system §6).

---

## 3. Convenções de Código

### 3.1 Vue 3
- **Sempre `<script setup lang="ts">`** com Composition API.
- Ordem no SFC: `<script setup>` → `<template>` → `<style>` (se necessário; preferir Tailwind).
- `defineProps`/`defineEmits` **tipados**:
  ```ts
  const props = defineProps<{ task: Task }>();
  const emit = defineEmits<{ open: [id: string]; edit: [id: string]; delete: [id: string] }>();
  ```
- Componentes apresentacionais **não** importam stores (props/eventos apenas).
- `v-for` sempre com `:key` estável (`id`, nunca índice).
- Nunca `v-html` com dados do usuário.

### 3.2 TypeScript
- `strict: true`, proibido `any` (use `unknown` + narrowing quando necessário).
- Tipos explícitos nas APIs públicas (funções de domínio, props, emits, retorno de actions).
- Preferir `interface` para objetos de domínio, `type` para uniões/aliases.
- Sem `as` desnecessário; validar dados externos (JSON do `localStorage`) antes de tipar.

### 3.3 Estilo / Tailwind
- Usar **tokens do design system** (cores `status.*`, `primary`, `danger`), não hex solto.
- Sem CSS inline arbitrário além de utilitários; classes condicionais via helper/computed.
- Mobile-first: classes base para mobile, `md:`/`lg:` para telas maiores.
- Respeitar `prefers-reduced-motion` em transições.

### 3.4 Acessibilidade (obrigatório — US-19, WCAG AA)
- Todo input com `<label>` associado (ou `aria-label`).
- Foco visível (anel 2px) em todos os interativos.
- Modais: foco preso, `Esc` fecha, retorno de foco ao abridor, `role="dialog"`/`aria-modal`.
- Status comunicado por **cor + ícone + texto** (nunca só cor).
- Toasts com `aria-live="polite"`; progresso com `role="progressbar"` + `aria-valuenow/min/max`.
- Alvos de toque ≥ 44px no mobile.

---

## 4. Fluxo de Dados (regra de ouro)

```
Componente (apresentação)  --emits-->  View/Container
View/Container             --action--> Pinia Store
Pinia Store                --chama---> domain/ (puro)
Pinia Store                --persiste-> TaskRepository -> localStorage
Store (reativo)            --props---> Componente
```

- **Nunca** acessar `localStorage` fora de `data/`.
- **Nunca** calcular status fora de `domain/status.ts`.
- **Nunca** guardar filtros/página dentro de componentes (vive no `uiStore`).

---

## 5. Padrões Obrigatórios (ver `design-patterns.md`)

- Repository para persistência.
- `deriveStatus` como função pura única (US-10).
- Pinia como fonte única de verdade.
- Presentational vs Container.
- Immutable updates em remoções.
- Envelope `schemaVersion` + migrations para o `localStorage`.

---

## 6. Qualidade de Código

### 6.1 Scripts npm (referência)
```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint . --ext .ts,.vue --max-warnings=0",
    "format": "prettier --write .",
    "typecheck": "vue-tsc --noEmit"
  }
}
```

### 6.2 ESLint (regras essenciais)
- `vue/multi-word-component-names`: erro.
- `@typescript-eslint/no-explicit-any`: erro.
- `@typescript-eslint/no-unused-vars`: erro.
- `no-restricted-imports`: bloqueia `vue`/`pinia`/`stores`/`data` dentro de `domain/`.
- `vue/no-v-html`: erro.

### 6.3 Prettier
- `singleQuote: true`, `semi: true`, `printWidth: 100`, `trailingComma: 'all'`.

### 6.4 Definition of Done (global, do PO)
- [ ] Critérios de aceitação atendidos.
- [ ] Sem erros no console.
- [ ] `npm run lint` e `npm run typecheck` sem erros.
- [ ] Testes da regra de status (US-10) verdes.
- [ ] Responsividade validada (desktop/tablet/mobile).
- [ ] Acessibilidade revisada (checklist design system §5).

---

## 7. Estratégia de Testes

| Nível | Ferramenta | Foco | Exemplos |
|-------|-----------|------|----------|
| Unitário | Vitest | `domain/` puro | `deriveStatus` (todos os casos de US-10); `filterTasks` (case-insensitive, AND); `paginate` (8/pág, última parcial) |
| Componente | Vitest + @vue/test-utils | Componentes isolados | `StatusBadge` (texto+ícone+aria), `ProgressBar` (0/0), `Pagination` (limites) |
| Integração | Vitest | Store + Repository (in-memory) | actions persistem; filtro reinicia página |
| E2E | Playwright | Fluxos críticos | criar→subtarefa→status muda→Kanban move; reload persiste (US-18) |

**Cobertura mínima:** `domain/status.ts` = **100%** (regra central). Demais metas a alinhar
com o Tester.

**Teste-chave (exemplo):**
```ts
// tests/unit/status.spec.ts
import { describe, it, expect } from 'vitest';
import { deriveStatus } from '@/domain/status';

const s = (done: boolean) => ({ id: 'x', title: 't', done });

describe('deriveStatus (US-10)', () => {
  it('sem subtarefas => todo', () => expect(deriveStatus([])).toBe('todo'));
  it('nenhuma feita => todo', () => expect(deriveStatus([s(false), s(false)])).toBe('todo'));
  it('parcial => doing', () => expect(deriveStatus([s(true), s(false)])).toBe('doing'));
  it('todas feitas => done', () => expect(deriveStatus([s(true), s(true)])).toBe('done'));
});
```

---

## 8. Git & Fluxo de Trabalho

| Item | Convenção |
|------|-----------|
| Branch | `feature/US-xx-descricao`, `fix/descricao`, `chore/descricao` |
| Commits | Conventional Commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:` |
| Escopo | Um commit coeso; referenciar a US quando aplicável |
| Merge | PR revisado por Arquiteto/par; CI verde (lint + typecheck + test) |
| Proibido | Commit de segredos; `--force` em branch compartilhada |

---

## 9. Tratamento de Erros

- Persistência: `try/catch` no Repository; `QuotaExceededError` → toast de erro (R-1).
- Leitura: JSON inválido → iniciar vazio com aviso, sem quebrar a UI (US-18).
- Validação: nome vazio/whitespace bloqueado na UI **e** no domínio (US-01/US-03).
- Sem `console.log` em produção para dados do usuário.

---

## 10. Checklist de Pull Request

- [ ] Atende aos critérios de aceitação da US.
- [ ] Respeita as camadas e padrões (`design-patterns.md`).
- [ ] Sem `any`, sem `v-html`, sem acesso direto a `localStorage`.
- [ ] Acessibilidade mínima garantida (labels, foco, status cor+ícone).
- [ ] Testes adicionados/atualizados (esp. US-10).
- [ ] `lint`, `typecheck` e `test` verdes.
- [ ] Sem erros no console do navegador.

---

## 11. Handoff e Referências

| Documento | Para |
|-----------|------|
| `architecture-diagram.md` | Entender camadas e fluxos |
| `tech-stack.md` | Versões e setup |
| `design-patterns.md` | Como implementar cada parte |
| `adrs.md` | Por que cada decisão foi tomada |
| `outputs/ux/design-system.md` | Tokens e componentes de UI |
| `outputs/product-owner/*` | Requisitos e critérios de aceitação |
