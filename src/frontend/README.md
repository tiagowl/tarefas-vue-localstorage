# Frontend — Gerenciador de Tarefas (Vue 3 + TypeScript)

SPA de gerenciamento de tarefas e subtarefas com **status derivado automaticamente**,
filtros, paginação (8/página), visão Lista e Kanban, e persistência em `localStorage`.

Implementa todas as user stories (US-01..US-21) definidas pelo Product Owner, seguindo a
arquitetura em camadas do Arquiteto e os tokens/componentes do Design System (UX).

## Stack

- **Vue 3** (Composition API + `<script setup>`) + **TypeScript** estrito
- **Pinia** para estado
- **Tailwind CSS** com tokens do design system
- **Vite** (build/dev) + **Vitest** (unit/componente) + **Playwright** (E2E)

## Estrutura

```
src/
├── domain/       # TS puro: models, status (US-10), query (filtros/paginação), id, validation
├── data/         # TaskRepository + LocalStorage/InMemory + schema v1 e migrations + preferences
├── stores/       # taskStore (dados) e uiStore (visão, filtros, página)
├── composables/  # useDebounce, useToast
├── components/   # common, task, status, filters, kanban, list, layout
├── assets/       # estilos globais (tokens)
├── App.vue
└── main.ts
tests/
├── unit/         # domain + store
├── component/    # @vue/test-utils
└── e2e/          # Playwright
```

## Configuração

```bash
# 1. Copie as variáveis de ambiente
cp env.example .env      # Windows: Copy-Item env.example .env

# 2. Instale as dependências
npm install
```

## Scripts

```bash
npm run dev         # servidor de desenvolvimento
npm run build       # checagem de tipos + build de produção
npm run preview     # preview do build
npm run test        # testes unitários e de componente (Vitest)
npm run test:e2e    # testes E2E (requer `npx playwright install`)
npm run lint        # ESLint
npm run typecheck   # vue-tsc --noEmit
npm run format      # Prettier
```

## Regra central — status derivado (US-10)

O status **nunca** é editável. É calculado por `domain/status.ts` a partir das subtarefas:

| Condição | Status |
|----------|--------|
| Sem subtarefas ou nenhuma feita | A fazer |
| Ao menos uma feita (e não todas) | Fazendo |
| Todas as subtarefas feitas (≥ 1) | Feito |

O campo `task.status` persistido é apenas **cache de leitura**; a verdade é `subtasks[].done`.

## Persistência

Os dados são salvos em `localStorage` sob um envelope versionado
(`{ schemaVersion, tasks }`) na chave definida por `VITE_STORAGE_KEY`. Mudanças de formato
exigem incremento de versão e uma migration em `src/data/schema.ts` (ADR-006).
