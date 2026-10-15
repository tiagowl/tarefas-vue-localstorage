# Diagramas de Arquitetura — Sistema de Gerenciamento de Tarefas

**Autor:** Arquiteto de Software
**Versão:** 1.0
**Data:** 2026-10-15
**Status:** Proposto para revisão
**Fontes:** `outputs/product-owner/requirements.md`, `outputs/product-owner/user-stories.md`, `outputs/product-owner/backlog.md`, `outputs/product-owner/acceptance-criteria.md`, `outputs/ux/design-system.md`

---

## 1. Visão Geral do Sistema

Aplicação **SPA (Single Page Application)** 100% client-side. Não há backend, API remota,
banco de dados nem autenticação (RES-4, RES-5, §8 do PO). Todo o estado vive na memória do
navegador e é persistido em `localStorage`.

**Características arquiteturais (atributos de qualidade):**

| Atributo | Meta | Origem |
|----------|------|--------|
| Persistência | Dados preservados entre sessões sem servidor | OBJ-4, US-18 |
| Responsividade | Desktop, tablet e mobile sem scroll horizontal | OBJ-5, US-19 |
| Acessibilidade | WCAG 2.1 AA | OBJ-5, design-system §5 |
| Manutenibilidade | Estado centralizado, domínio isolado da UI | RES-1..RES-3 |
| Performance | Lista paginada (8/pág) e Kanban fluido com scroll | RES-6, R-4 |
| Segurança | Sem rede, sem PII em trânsito; dados apenas locais | RES-4, RES-5 |

### 1.1 Estilo arquitetural adotado

**Monólito modular client-side em camadas (Layered SPA)** com separação estrita entre
**domínio**, **dados/persistência** e **apresentação**, mediada por uma store **Pinia**.

Justificativa: o escopo é pequeno, single-user e sem integrações. Microserviços/DDD tático
seriam sobre-engenharia (ver `adrs.md` — ADR-001). Ainda assim, isolamos a **regra de negócio
central** (status derivado, US-10) em um módulo de domínio puro, testável e independente do Vue.

---

## 2. Diagrama de Contexto (C4 — Nível 1)

```mermaid
C4Context
    title Contexto — Gerenciador de Tarefas Local

    Person(user, "Usuário", "Marina, Rafael, Carla ou time pequeno")
    System(app, "Gerenciador de Tarefas (SPA)", "Vue 3 + TS + Pinia + Tailwind, executado no navegador")
    System_Ext(ls, "localStorage", "Armazenamento local do navegador (~5 MB)")

    Rel(user, app, "Usa via navegador (mouse/teclado/touch)")
    Rel(app, ls, "Lê e grava JSON de tarefas/subtarefas")
```

**Fronteira do sistema:** tudo roda no dispositivo do usuário. Não há atores externos,
serviços de terceiros, rede ou backend.

---

## 3. Diagrama de Containers / Camadas (C4 — Nível 2)

```mermaid
flowchart TB
    subgraph Browser["Navegador (fronteira do sistema)"]
        subgraph Presentation["Camada de Apresentação (Vue 3 + Tailwind)"]
            V1["Views: TaskListView · KanbanView"]
            V2["Componentes: TaskCard, TaskForm, SubtaskList,\nStatusBadge, ProgressBar, KanbanColumn,\nFilterBar, Pagination, Modal, Toast, EmptyState"]
        end

        subgraph State["Camada de Estado (Pinia)"]
            S1["useTaskStore\n(state, getters, actions)"]
            S2["useUiStore\n(visão ativa, filtros, página, toasts)"]
        end

        subgraph Domain["Camada de Domínio (TS puro, sem Vue)"]
            D1["StatusDerivationService\nderivarStatus(subtasks)"]
            D2["filterTasks / paginate\n(casos de uso de consulta)"]
            D3["models: Task, Subtask, Status"]
        end

        subgraph Data["Camada de Dados / Persistência"]
            P1["TaskRepository (interface)"]
            P2["LocalStorageTaskRepository"]
            P3["StorageSchema + migrations"]
        end
    end

    LS[("localStorage")]

    V1 --> V2
    V2 --> S1
    V2 --> S2
    V1 --> S1
    S1 --> D1
    S1 --> D2
    S1 --> D3
    S1 --> P1
    P1 -.implementa.-> P2
    P2 --> P3
    P2 -->|getItem/setItem| LS
```

**Regras de dependência (invioláveis):**
- Apresentação → Estado → Domínio → Dados.
- **Domínio não conhece Vue nem Pinia** (TS puro, testável).
- **Domínio não conhece `localStorage`** — depende apenas da interface `TaskRepository`.
- Nenhuma camada superior é acessada de baixo para cima.

---

## 4. Estrutura de Componentes (decomposição da UI)

```mermaid
flowchart LR
    App[App.vue] --> Header[AppHeader]
    App --> Toolbar[FilterBar]
    App --> Switch{ViewSwitch}
    Switch -->|Lista| TL[TaskListView]
    Switch -->|Kanban| KV[KanbanView]

    TL --> List[List]
    List --> Card1[TaskCard]
    List --> Pag[Pagination]
    List --> Empty1[EmptyState]

    KV --> Col1[KanbanColumn: A fazer]
    KV --> Col2[KanbanColumn: Fazendo]
    KV --> Col3[KanbanColumn: Feito]
    Col1 --> Card2[TaskCard]
    Col2 --> Card2
    Col3 --> Card2

    Card1 --> Badge[StatusBadge]
    Card1 --> Prog[ProgressBar]
    Card1 --> Actions[TaskActions Menu]

    Actions --> FormModal[TaskFormModal]
    FormModal --> SubList[SubtaskList]
    SubList --> SubItem[SubtaskItem]

    App --> Toast[ToastHost]
```

**Contratos de componente (resumo; detalhes no design system do UX):**

| Componente | Responsabilidade | Props/entradas | Eventos/saídas |
|-----------|------------------|----------------|----------------|
| `TaskListView` | Lista paginada e filtrada | — | — |
| `KanbanView` | 3 colunas por status derivado | — | — |
| `TaskCard` | Exibe nome, descrição, badge, progresso | `task` | `open`, `edit`, `delete` |
| `TaskFormModal` | Criar/editar tarefa | `mode`, `task?` | `submit`, `cancel` |
| `SubtaskList` | Gerencia subtarefas | `taskId` | `toggle`, `add`, `edit`, `remove` |
| `StatusBadge` | Comunica status (cor+ícone+texto) | `status` | — |
| `ProgressBar` | Indicador K/N acessível | `done`, `total` | — |
| `FilterBar` | Busca por nome + filtro de status | `filters` | `update:filters` |
| `Pagination` | Navegação 8/pág | `page`, `total` | `change` |
| `EmptyState` | Estado vazio com CTA | `title`, `cta?` | `action` |
| `ToastHost` | Feedback não bloqueante | — | — |

---

## 5. Fluxo de Dados

### 5.1 Leitura (bootstrap da aplicação)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant App as App.vue
    participant Store as useTaskStore
    participant Repo as LocalStorageTaskRepository
    participant LS as localStorage

    U->>App: Abre a aplicação
    App->>Store: init()
    Store->>Repo: loadAll()
    Repo->>LS: getItem("tarefas:data:v1")
    alt Dados válidos
        LS-->>Repo: JSON string
        Repo->>Repo: parse + validar schema
        Repo-->>Store: Task[]
    else Ausente / corrompido
        LS-->>Repo: null ou JSON inválido
        Repo->>Repo: aplicar migration / fallback
        Repo-->>Store: [] (vazio) + flag de aviso
    end
    Store-->>App: estado reativo pronto
    App-->>U: renderiza lista/Kanban (ou EmptyState)
```

### 5.2 Escrita — marcar subtarefa como feita e derivar status (US-08 + US-10)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant C as SubtaskItem
    participant Store as useTaskStore
    participant Dom as StatusDerivationService
    participant Repo as LocalStorageTaskRepository
    participant LS as localStorage

    U->>C: Marca subtarefa como feita
    C->>Store: toggleSubtask(taskId, subtaskId)
    Store->>Store: atualiza subtask.done
    Store->>Dom: derivarStatus(task.subtasks)
    Dom-->>Store: "todo" | "doing" | "done"
    Store->>Store: task.status = resultado
    Store->>Repo: saveAll(tasks)
    Repo->>LS: setItem("tarefas:data:v1", JSON)
    Store-->>C: estado reativo atualizado
    C-->>U: UI + Kanban refletem novo status (US-16)
```

**Observação:** o status é **derivado na leitura e recalculado em memória** a cada mutação —
nunca persistido como fonte de verdade editável. Persistir o valor calculado é **cache**, não
verdade (ver `design-patterns.md` §3 e `adrs.md` ADR-004).

### 5.3 Filtro + paginação (US-11..US-14)

```mermaid
flowchart LR
    A["tasks (store)"] --> B["filterTasks(tasks, {nome, status})"]
    B --> C["resultado filtrado"]
    C --> D["paginate(resultado, page, size=8)"]
    D --> E["página visível"]
    F["mudança de filtro"] --> G["reset page = 1"]
    G --> D
```

Getters Pinia encadeados garantem que a paginação **sempre** opera sobre o subconjunto
filtrado (critério de aceitação US-14) e que qualquer alteração de filtro reinicia a página.

---

## 6. Modelo de Dados (tipos TypeScript)

```ts
// domain/models.ts — TS puro, sem dependências de framework
export type Status = 'todo' | 'doing' | 'done';

export interface Subtask {
  id: string;        // UUID/crypto.randomUUID()
  title: string;     // obrigatório, não-vazio após trim
  done: boolean;
}

export interface Task {
  id: string;
  title: string;       // obrigatório
  description?: string; // opcional
  subtasks: Subtask[];
  status: Status;      // derivado (cache); nunca editável pela UI
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
}

export interface TaskFilters {
  name: string;         // busca textual case-insensitive
  status: Status | 'all';
}

export interface AppStateV1 {
  schemaVersion: 1;
  tasks: Task[];
}
```

**Chave de armazenamento:** `tarefas:data:v1` (ver `adrs.md` ADR-006 — estratégia de
versionamento/migração, ponto a validar em §10 do PO).

---

## 7. Integrações

| Integração | Tipo | Direção | Observações |
|-----------|------|---------|-------------|
| `localStorage` (Web Storage API) | Interna ao navegador | Leitura/Escrita | Única dependência de persistência (RES-4) |
| `crypto.randomUUID()` | Web API | Geração de ID | Fallback para `Date.now()+random` em navegadores antigos |
| Sistema de arquivos | — | — | **Não há** (sem upload/export no MVP, §8) |
| Serviços externos / backend | — | — | **Não há** (RES-5) |

Nenhuma integração de rede, portanto não há gateway/API layer, autenticação, CORS ou
tratamento de latência a projetar no MVP.

---

## 8. Navegação e Roteamento

MVP é **single-view com alternância Lista/Kanban** (US-21). Duas abordagens (decisão em
`adrs.md` ADR-007):

- **Escolhida:** estado de visão em Pinia (`useUiStore.activeView`) + troca de componente
  (sem roteador). Mais simples, preserva filtros naturalmente.
- Reservado: `vue-router` para deep-linking futuro, fora do MVP.

---

## 9. Tratamento de Erros e Resiliência

| Cenário | Estratégia | Referência |
|---------|-----------|------------|
| `localStorage` indisponível (modo privado/cheio) | Capturar exceção, iniciar vazio em memória, exibir aviso | US-18 (critério de aceitação) |
| JSON corrompido | Validar schema; se inválido, isolar dados e iniciar vazio com aviso | US-18, R-2 |
| Limite ~5 MB excedido | Detectar `QuotaExceededError`; avisar via toast; documentar limite | R-1 |
| Nome vazio/whitespace | Validação na UI + guarda no domínio; bloqueia persistência | US-01, US-03 |

---

## 10. Rastreabilidade Requisitos → Arquitetura

| Requisito | Componente(s) arquitetural(is) |
|-----------|-------------------------------|
| US-01..US-04 (CRUD Task) | `TaskFormModal`, `TaskCard`, `useTaskStore`, `TaskRepository` |
| US-05..US-09 (CRUD Subtask + progresso) | `SubtaskList`, `ProgressBar`, `useTaskStore` |
| US-10 (status derivado) | `StatusDerivationService` (domínio) |
| US-11..US-14 (filtros/paginação) | `FilterBar`, `Pagination`, getters da store |
| US-15..US-17 (Kanban) | `KanbanView`, `KanbanColumn` |
| US-18 (persistência) | `LocalStorageTaskRepository`, `StorageSchema` |
| US-19..US-21 (UX/responsivo/visões) | Camada de apresentação + design system |

---

## 11. Handoff

| Entregável desta arquitetura | Consumidor |
|------------------------------|-----------|
| Estrutura de camadas e de pastas | **Frontend Dev** |
| Interface `TaskRepository` e schema v1 | **Frontend Dev** / **Tester** |
| Contratos de componente | **UI Designer** / **Frontend Dev** |
| Estratégia de migração do `localStorage` | **Frontend Dev** (validar com PO) |
| Pontos a validar (§10 PO) | **PO** + **Arquiteto** |

**Próximos artefatos relacionados:** `tech-stack.md`, `design-patterns.md`,
`development-guidelines.md`, `adrs.md`.
