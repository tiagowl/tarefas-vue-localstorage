# Registros de Decisão Arquitetural (ADRs) — Sistema de Gerenciamento de Tarefas

**Autor:** Arquiteto de Software
**Versão:** 1.0
**Data:** 2026-10-15
**Formato:** Contexto → Decisão → Consequências (template do prompt do Arquiteto, item 5)

> ADRs são **imutáveis**. Mudanças criam um novo registro que substitui o anterior
> (status `Substituído por ADR-xxx`).

---

## Índice

| ADR | Título | Status |
|-----|--------|--------|
| [ADR-001](#adr-001) | Monólito modular client-side em camadas | Aceito |
| [ADR-002](#adr-002) | Vue 3 + Composition API + TypeScript estrito | Aceito |
| [ADR-003](#adr-003) | Pinia como fonte única de estado | Aceito |
| [ADR-004](#adr-004) | Status derivado por função pura (domínio) | Aceito |
| [ADR-005](#adr-005) | Tailwind CSS com tokens do design system | Aceito |
| [ADR-006](#adr-006) | Persistência em `localStorage` com envelope versionado | Aceito |
| [ADR-007](#adr-007) | Alternância Lista/Kanban sem roteador | Aceito |
| [ADR-008](#adr-008) | Repository explícito em vez de plugin de persistência | Aceito |
| [ADR-009](#adr-009) | Domínio isolado e sem `any` | Aceito |
| [ADR-010](#adr-010) | Vite + Vitest + Playwright para build e testes | Aceito |

---

<a id="adr-001"></a>
## ADR-001 — Monólito modular client-side em camadas

**Status:** Aceito

### Contexto
O produto é single-user, sem backend, sem integrações e com escopo pequeno (RES-4, RES-5, §8).
Há uma única regra de negócio relevante (status derivado, US-10). Opções como microserviços,
DDD tático completo ou backend dedicado foram levantadas pelo template (expertise do agente).

### Decisão
Adotar um **monólito modular client-side em camadas** (apresentação → estado → domínio →
dados), com a regra central isolada em um módulo de domínio puro.

### Consequências
- ✅ Simplicidade operacional: um único artefato de build; sem infraestrutura.
- ✅ Domínio testável sem DOM; fronteiras claras para evoluir.
- 🟡 Se o produto migrar para nuvem/multiusuário, exige novo desenho (backend + sincronização).
- 🟡 Disciplina de camadas depende de lint (ver `development-guidelines.md` §1).

---

<a id="adr-002"></a>
## ADR-002 — Vue 3 + Composition API + TypeScript estrito

**Status:** Aceito

### Contexto
RES-1 exige Vue 3 + TypeScript. O time precisa de reatividade granular e segurança de tipos para
reduzir bugs em regras condicionais (status).

### Decisão
Vue 3 com **Composition API** (`<script setup lang="ts">`) em TypeScript **strict** (`vue-tsc`).

### Consequências
- ✅ Tipos fortes em props/emits/stores; menos erros em runtime.
- ✅ Tree-shaking e boa performance.
- 🟡 `strict` exige validação de dados externos (JSON do `localStorage`) antes de tipar.
- 🟡 Curva inicial para devs de Options API (mitigável; stack mainstream).

---

<a id="adr-003"></a>
## ADR-003 — Pinia como fonte única de estado

**Status:** Aceito

### Contexto
RES-2 define Pinia. O estado compartilhado (tarefas, filtros, visão, página) precisa ser
reativo e previsível entre lista e Kanban (US-21).

### Decisão
Duas stores: `useTaskStore` (dados e mutações) e `useUiStore` (visão, filtros, paginação).
Componentes apresentacionais **não** acessam stores diretamente.

### Consequências
- ✅ Fonte única de verdade; filtros sobrevivem à troca de visão.
- ✅ Devtools e ações explícitas; testável.
- 🟡 Exige disciplina para não vazar estado de UI para a store de dados.

---

<a id="adr-004"></a>
## ADR-004 — Status derivado por função pura (domínio)

**Status:** Aceito

### Contexto
A regra central (US-10) é calculada a partir das subtarefas e **nunca** editável. Duplicá-la em
lista, Kanban e filtros geraria divergência. O PO levantou ambiguidade para "sem subtarefas"
(§10) e exige cobertura de testes.

### Decisão
Implementar `deriveStatus(subtasks): Status` como **função pura** em `domain/status.ts`,
chamada exclusivamente pela store. O campo `task.status` persistido é **cache** de leitura, não
fonte de verdade (a verdade é `subtasks[].done`).

**Regra:** sem subtarefas → `todo`; nenhuma feita → `todo`; parcial → `doing`; todas → `done`.

### Consequências
- ✅ Comportamento idêntico em todos os pontos; 100% testável.
- ✅ Resolve a ambiguidade do PO (sem subtarefas = "A fazer").
- 🟡 Requer recálculo em toda mutação de subtarefa (custo desprezível).

---

<a id="adr-005"></a>
## ADR-005 — Tailwind CSS com tokens do design system

**Status:** Aceito

### Contexto
RES-3 define Tailwind; RES-7/OBJ-5 exigem UI elegante, consistente e acessível. O UX já entregou
tokens (cores semânticas, tipografia, espaçamento, status).

### Decisão
Usar Tailwind estendido com os **tokens do design system** — em especial
`colors.status.todo/doing/done` — evitando valores hex soltos e bibliotecas de componentes.

### Consequências
- ✅ Contrato visual único; consistência lista/Kanban/modais.
- ✅ Acessibilidade reforçada (status por cor + ícone + texto).
- 🟡 Filas de classes condicionais exigem helpers/computed para legibilidade.

---

<a id="adr-006"></a>
## ADR-006 — Persistência em `localStorage` com envelope versionado

**Status:** Aceito

### Contexto
RES-4 exige `localStorage`; US-18 exige restauração entre sessões e tolerância a dados
corrompidos; §10 do PO pede estratégia de migração/versionamento. `localStorage` tem limite ~5 MB
(R-1).

### Decisão
Persistir um **envelope** `{ schemaVersion, tasks }` sob a chave `tarefas:data:v1`. Leitura
valida o schema; dados inválidos → inicia vazio com aviso. Mudanças de forma exigem bump de
versão + migration.

### Consequências
- ✅ Evolução segura do schema sem perda de dados.
- ✅ Tratamento de corrupção/indisponibilidade (não quebra a app).
- 🟡 Limite de ~5 MB permanece; documentar e sinalizar `QuotaExceededError` (R-1, R-2).
- 🟡 Toda alteração de estrutura passa a exigir atualização deste ADR.

---

<a id="adr-007"></a>
## ADR-007 — Alternância Lista/Kanban sem roteador

**Status:** Aceito

### Contexto
US-21 exige alternar entre Lista e Kanban mantendo dados e filtros. `vue-router` adicionaria
dependência e complexidade de deep-linking não exigida no MVP.

### Decisão
Controlar a visão ativa via `useUiStore.activeView` (`'list' | 'kanban'`) e troca condicional de
componente. Sem `vue-router` no MVP.

### Consequências
- ✅ Simplicidade; filtros/estado preservados naturalmente.
- 🟡 Sem URLs compartilháveis/back-button por view (aceitável no MVP).
- 🟡 Introduzir `vue-router` no futuro exige refatorar a navegação (baixo custo).

---

<a id="adr-008"></a>
## ADR-008 — Repository explícito em vez de plugin de persistência

**Status:** Aceito

### Contexto
Alternativas: `pinia-plugin-persistedstate` (persistência automática) ou repositório explícito.
O plugin acopla o formato do estado ao mecanismo de armazenamento e dificulta migrações/mock.

### Decisão
Definir a interface `TaskRepository` com implementação `LocalStorageTaskRepository`. A store
depende da **interface**, não de `localStorage`.

### Consequências
- ✅ Testes com repositório in-memory; troca futura por IndexedDB/API sem tocar no domínio.
- ✅ Versionamento/migração explícitos (ADR-006).
- 🟡 Mais código que o plugin (aceitável: controle e testabilidade).

---

<a id="adr-009"></a>
## ADR-009 — Domínio isolado e sem `any`

**Status:** Aceito

### Contexto
A regra de negócio central precisa ser confiável e testável. `vue-tsc` e ESLint permitem impor
fronteiras.

### Decisão
`domain/` é TS puro (sem `vue`/`pinia`/`data`/`components`), com `strict` e proibição de `any`
(use `unknown` + narrowing). Restrição aplicada via `no-restricted-imports` e
`@typescript-eslint/no-explicit-any`.

### Consequências
- ✅ Domínio testável em milissegundos (Vitest, sem DOM).
- ✅ Refatorações seguras; bugs de tipo detectados em build.
- 🟡 Requer validadores para dados externos (JSON).

---

<a id="adr-010"></a>
## ADR-010 — Vite + Vitest + Playwright para build e testes

**Status:** Aceito

### Contexto
Necessário build rápido, HMR e estratégia de testes por nível (domínio, componente, E2E).

### Decisão
**Vite** (build/dev), **Vitest** + **@vue/test-utils** (unitário/componente) e **Playwright**
(E2E dos fluxos críticos), com **vue-tsc** para checagem de tipos.

### Consequências
- ✅ Integração nativa Vite/Vitest; execução rápida; fluxos críticos cobertos (US-10, US-18).
- ✅ CI simples: `lint` + `typecheck` + `test`.
- 🟡 Duas ferramentas de teste (Vitest e Playwright) exigem alinhamento com o Tester.

---

## Anexo — ADRs em aberto / a validar (com o PO)

| Tema | Origem | Encaminhamento |
|------|--------|----------------|
| Estratégia de migração do schema | §10 PO | Formalizada no ADR-006; validar na US-18 |
| Comportamento "sem subtarefas" | §10 PO / US-10 | Resolvido no ADR-004 (→ "A fazer") |
| Gerenciador de pacotes (npm/pnpm/yarn) | — | Definir com DevOps |
| Metas de cobertura de testes | — | Alinhar com Tester |
| Virtualização do Kanban (R-4) | Risco baixo | Só se performance degradar; fora do MVP |

---

## Handoff

| Decisão | Consumidor principal |
|---------|---------------------|
| ADR-001..ADR-010 | **Frontend Dev**, **Tester**, **DevOps**, **PO** |
| Anexo (a validar) | **PO** + **Arquiteto** |
