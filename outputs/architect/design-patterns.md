# Padrões de Design — Sistema de Gerenciamento de Tarefas

**Autor:** Arquiteto de Software
**Versão:** 1.0
**Data:** 2026-10-15
**Fontes:** `outputs/product-owner/requirements.md` (§5 regra central), `outputs/architect/architecture-diagram.md`

Este documento descreve **como** implementar cada responsabilidade usando padrões testáveis e
idiomáticos de Vue 3 + TypeScript. Não é uma coleção decorativa: cada padrão resolve um
problema concreto do produto.

---

## 1. Mapa de Padrões Aplicados

| # | Padrão | Problema que resolve | Onde |
|---|--------|----------------------|------|
| 1 | **Layered Architecture** | Separar UI, estado, domínio e dados | Estrutura geral |
| 2 | **Repository** | Isolar a persistência (`localStorage`) do domínio | Camada de dados |
| 3 | **Strategy (função pura)** | Regra de status derivado (US-10) sem `if/else` espalhado | `StatusDerivationService` |
| 4 | **Store (Pinia) como fonte única** | Estado global previsível e reativo | `useTaskStore` |
| 5 | **Composable** | Reuso de lógica de UI (debounce, toasts, validação) | `src/composables/` |
| 6 | **Adapter/Factory** | Fallback de `crypto.randomUUID` e factory de IDs | `domain/id.ts` |
| 7 | **Command/Action** | Mutação de estado atômica e auditável | ações da store |
| 8 | **Presentational vs Container** | Componentes "burros" reutilizáveis na lista e no Kanban | Componentes |
| 9 | **Component/Compound (Vue slots)** | Modais e cards flexíveis | `TaskFormModal`, `TaskCard` |
| 10 | **Immutable Update** | Reatividade confiável no Pinia | mutações da store |
| 11 | **Schema Versioning + Migration** | Evoluir o `localStorage` sem perder dados | `storage/` |

---

## 2. Layered Architecture (referência)

```
src/
├── domain/            # TS puro — SEM import de vue/pinia
│   ├── models.ts
│   ├── status.ts          # derivação de status (US-10)
│   ├── id.ts              # factory/adaptor de id
│   └── query.ts           # filterTasks, paginate
├── data/
│   ├── TaskRepository.ts      # interface
│   ├── LocalStorageTaskRepository.ts
│   └── schema.ts              # versão + migrations
├── stores/
│   ├── taskStore.ts
│   └── uiStore.ts
├── composables/
│   ├── useDebounce.ts
│   └── useToast.ts
├── components/ ...    # apresentação
├── views/ ...
└── App.vue
```

**Regra de ouro:** `domain/` não importa de `stores/`, `components/` nem `data/`. Isso torna a
regra central do produto testável em milissegundos, sem DOM.

---

## 3. Strategy — Derivação de Status (US-10)

O coração do produto. Implementado como **função pura** que mapeia `Subtask[] → Status`.
Evita `if/else` duplicado em lista, Kanban e filtros.

```ts
// domain/status.ts
import type { Status, Subtask } from './models';

export const deriveStatus = (subtasks: Subtask[]): Status => {
  if (subtasks.length === 0) return 'todo';           // sem subtarefas => A fazer
  const done = subtasks.filter(s => s.done).length;
  if (done === 0) return 'todo';                       // nenhuma feita => A fazer
  if (done === subtasks.length) return 'done';         // todas feitas => Feito
  return 'doing';                                      // parcial => Fazendo
};
```

**Casos extremos cobertos (critérios do PO):**
| Cenário (acceptance-criteria US-10) | Entrada | Saída |
|-------------------------------------|---------|-------|
| Sem subtarefas | `[]` | `todo` |
| Nenhuma feita | `[{done:false},{done:false}]` | `todo` |
| Parcial | `[{done:true},{done:false}]` | `doing` |
| Todas feitas | `[{done:true}]` | `done` |
| Desmarca de "Feito" | `[{done:true}]` → `[{done:false}]` | `doing` (ou `todo` se nenhuma) |

**Regras:**
- O status **nunca** é definido por input do usuário; só por `deriveStatus`.
- Persistir `task.status` é **cache** para leitura; a verdade é `subtasks[].done`.

---

## 4. Repository — Isolamento da Persistência (RES-4, US-18)

Permite trocar `localStorage` por IndexedDB/API no futuro **sem tocar** em store ou domínio
(Dependency Inversion).

```ts
// data/TaskRepository.ts
import type { Task } from '@/domain/models';

export interface TaskRepository {
  loadAll(): Task[];
  saveAll(tasks: Task[]): void;
  clear(): void;
}
```

```ts
// data/LocalStorageTaskRepository.ts
import type { TaskRepository } from './TaskRepository';
import type { Task } from '@/domain/models';
import { loadFromStorage, saveToStorage } from './schema';

const KEY = 'tarefas:data:v1';

export class LocalStorageTaskRepository implements TaskRepository {
  loadAll(): Task[] {
    try {
      return loadFromStorage(KEY);
    } catch {
      return []; // US-18: corrompido/indisponível => inicia vazio
    }
  }

  saveAll(tasks: Task[]): void {
    try {
      saveToStorage(KEY, tasks);
    } catch (e) {
      // QuotaExceededError (R-1): sinalizar à UI via store/toast
      throw e;
    }
  }

  clear(): void {
    localStorage.removeItem(KEY);
  }
}
```

**Benefícios:** o `Tester` pode injetar um `InMemoryTaskRepository` nos testes; o domínio
nunca menciona `localStorage`.

---

## 5. Store (Pinia) como Fonte Única

### 5.1 `useTaskStore` — tarefas e subtarefas

```ts
// stores/taskStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task, Subtask, Status } from '@/domain/models';
import { deriveStatus } from '@/domain/status';
import { createId } from '@/domain/id';
import type { TaskRepository } from '@/data/TaskRepository';

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  let repo: TaskRepository;

  function init(repository: TaskRepository) {
    repo = repository;
    tasks.value = repository.loadAll();
  }

  function persist() {
    repo.saveAll(tasks.value);
  }

  function addTask(title: string, description?: string) {
    const now = new Date().toISOString();
    tasks.value.push({
      id: createId(),
      title: title.trim(),
      description: description?.trim() || undefined,
      subtasks: [],
      status: 'todo',
      createdAt: now,
      updatedAt: now,
    });
    persist();
  }

  function updateTask(id: string, patch: Partial<Pick<Task, 'title' | 'description'>>) {
    const t = tasks.value.find(x => x.id === id);
    if (!t) return;
    Object.assign(t, patch, { updatedAt: new Date().toISOString() });
    recomputeStatus(t);
    persist();
  }

  function removeTask(id: string) {
    tasks.value = tasks.value.filter(t => t.id !== id); // remove subtarefas em cascata
    persist();
  }

  function addSubtask(taskId: string, title: string) {
    const t = tasks.value.find(x => x.id === taskId);
    if (!t) return;
    t.subtasks.push({ id: createId(), title: title.trim(), done: false });
    recomputeStatus(t);
    persist();
  }

  function toggleSubtask(taskId: string, subtaskId: string) {
    const t = tasks.value.find(x => x.id === taskId);
    const s = t?.subtasks.find(x => x.id === subtaskId);
    if (!t || !s) return;
    s.done = !s.done;
    recomputeStatus(t);
    persist();
  }

  function removeSubtask(taskId: string, subtaskId: string) {
    const t = tasks.value.find(x => x.id === taskId);
    if (!t) return;
    t.subtasks = t.subtasks.filter(s => s.id !== subtaskId);
    recomputeStatus(t);
    persist();
  }

  function recomputeStatus(t: Task) {
    t.status = deriveStatus(t.subtasks);       // Strategy pura
    t.updatedAt = new Date().toISOString();
  }

  return {
    tasks, init,
    addTask, updateTask, removeTask,
    addSubtask, toggleSubtask, removeSubtask,
  };
});
```

**Padrões embutidos:** Store como fonte única; Command (cada ação é atômica);
Immutable Update para remoções; Strategy para status.

### 5.2 `useUiStore` — visão, filtros e paginação

```ts
// stores/uiStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { TaskFilters } from '@/domain/models';
import { filterTasks, paginate } from '@/domain/query';
import { useTaskStore } from './taskStore';

const PAGE_SIZE = 8; // RES-6

export const useUiStore = defineStore('ui', () => {
  const activeView = ref<'list' | 'kanban'>('list');
  const filters = ref<TaskFilters>({ name: '', status: 'all' });
  const page = ref(1);

  const taskStore = useTaskStore();

  const filtered = computed(() => filterTasks(taskStore.tasks, filters.value));
  const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)));
  const paged = computed(() => paginate(filtered.value, page.value, PAGE_SIZE));

  function setFilter(patch: Partial<TaskFilters>) {
    Object.assign(filters.value, patch);
    page.value = 1;                     // US-14: filtro reinicia paginação
  }

  function next() { if (page.value < totalPages.value) page.value++; }
  function prev() { if (page.value > 1) page.value--; }

  return { activeView, filters, page, filtered, totalPages, paged, setFilter, next, prev };
});
```

**Padrão Getter encadeado / Query Object:** `filtered → totalPages → paged` garantem que a
paginação respeite sempre os filtros ativos (US-13, US-14).

---

## 6. Composable — Reuso de Lógica de UI

```ts
// composables/useDebounce.ts
import { ref, watch, type Ref } from 'vue';

export function useDebounce<T>(source: Ref<T>, delay = 300): Ref<T> {
  const debounced = ref(source.value) as Ref<T>;
  let timer: ReturnType<typeof setTimeout>;
  watch(source, v => {
    clearTimeout(timer);
    timer = setTimeout(() => (debounced.value = v), delay);
  });
  return debounced;
}
```

Usado para a busca por nome (US-11) sem disparar filtro a cada tecla.

---

## 7. Adapter / Factory — Geração de ID

```ts
// domain/id.ts
export const createId = (): string =>
  (globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`);
```

Adapter isola a Web API e documenta o fallback (ver `tech-stack.md` §2.2).

---

## 8. Presentational vs Container

- **Container/View** (`TaskListView`, `KanbanView`): acessam stores, orquestram.
- **Presentational** (`TaskCard`, `StatusBadge`, `ProgressBar`, `Pagination`): recebem `props`,
  emitem eventos, sem acesso a store.

Isso permite **reutilizar `TaskCard`** tanto na lista quanto nas três colunas do Kanban
(US-15) com aparência idêntica (consistência do design system).

```
TaskCard
  props: { task: Task }
  emits: ['open', 'edit', 'delete']
```

---

## 9. Compound / Slots

`TaskFormModal` usa slots para corpo e ações, mantendo comportamento de acessibilidade
(foco preso, `Esc`, `aria-modal`) centralizado em um componente base `BaseModal`.

```vue
<BaseModal :open="open" title="Nova tarefa" @close="emit('cancel')">
  <TaskForm @submit="emit('submit', $event)" />
</BaseModal>
```

---

## 10. Immutable Update & Reatividade

- Para **remover**: reatribuir array (`tasks.value = tasks.value.filter(...)`).
- Para **atualizar**: mutar objeto dentro do array é rastreável no Vue 3 (Proxy), desde que o
  objeto venha do estado reativo — preferir `find` + mutação de propriedade.
- Evitar mutação direta de props (padrão `props down / events up`).
- Nunca reatribuir o objeto reativo inteiro de `tasks` sem necessidade.

---

## 11. Schema Versioning + Migration (US-18, §10 PO)

Ponto de validação levantado pelo PO. Padrão: envelope versionado + cadeia de migrations.

```ts
// data/schema.ts
import type { Task } from '@/domain/models';

interface Envelope { schemaVersion: number; tasks: Task[]; }
const CURRENT = 1;

export function loadFromStorage(key: string): Task[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as Envelope;
  let data = parsed;
  // migrations futuras: while (data.schemaVersion < CURRENT) data = migrate[data.schemaVersion](data)
  return data.tasks ?? [];
}

export function saveToStorage(key: string, tasks: Task[]) {
  const env: Envelope = { schemaVersion: CURRENT, tasks };
  localStorage.setItem(key, JSON.stringify(env));
}
```

**Contrato:** qualquer mudança de forma dos dados **exige** bump de `schemaVersion` +
função de migração + atualização do `adrs.md`.

---

## 12. Anti-padrões (proibidos)

| Anti-padrão | Motivo |
|-------------|--------|
| Acessar `localStorage` em componentes | Quebra o isolamento do Repository; dificulta testes |
| `v-html` com dados do usuário | Risco de XSS |
| Editar `task.status` pela UI | Viola a regra central (US-10) |
| Duplicar lógica `deriveStatus` | Divergência entre lista/Kanban |
| Estado de filtros dentro de componentes | Perde-se ao alternar Lista/Kanban (US-21) |
| Store monolítica | Misturar UI (filtros/visão) e dados (tasks) reduz coesão |
| `any` no domínio | Enfraquece a segurança de tipos (ADR-009) |

---

## 13. Handoff

| Padrão | Consumidor |
|--------|-----------|
| `domain/*` (status, query, id) | **Frontend Dev** / **Tester** |
| `data/*` (Repository, schema) | **Frontend Dev** |
| Estrutura de stores | **Frontend Dev** |
| Anti-padrões | **Frontend Dev** (revisão) / **Architect** (code review) |
