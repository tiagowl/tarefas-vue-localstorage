# Backlog Priorizado — Sistema de Gerenciamento de Tarefas

**Autor:** Product Owner
**Versão:** 1.0
**Data:** 2026-10-15
**Método de priorização:** MoSCoW + valor de negócio × esforço × dependências × risco

---

## 1. Legenda

- **Prioridade:** P0 (crítico), P1 (alto), P2 (médio), P3 (baixo)
- **MoSCoW:** Must / Should / Could / Won't
- **Valor (1–5):** impacto de negócio/usuário
- **Esforço (SP):** Story Points (Fibonacci)
- **Depende de:** stories que precisam estar prontas antes

## 2. Backlog

| Ordem | ID | Story | Prioridade | MoSCoW | Valor | SP | Depende de | Sprint |
|-------|----|-------|-----------|--------|-------|----|-----------|--------|
| 1 | US-01 | Criar tarefa | P0 | Must | 5 | 3 | — | Sprint 1 |
| 2 | US-02 | Listar tarefas | P0 | Must | 5 | 2 | US-01 | Sprint 1 |
| 3 | US-18 | Persistir em localStorage | P0 | Must | 5 | 5 | US-01 | Sprint 1 |
| 4 | US-05 | Criar subtarefa | P0 | Must | 5 | 3 | US-01 | Sprint 1 |
| 5 | US-08 | Marcar subtarefa como feita | P0 | Must | 5 | 3 | US-05 | Sprint 1 |
| 6 | US-10 | Status derivado automaticamente | P0 | Must | 5 | 5 | US-08 | Sprint 2 |
| 7 | US-15 | Visão Kanban | P0 | Must | 5 | 5 | US-10 | Sprint 2 |
| 8 | US-11 | Filtrar por nome | P0 | Must | 4 | 3 | US-02 | Sprint 2 |
| 9 | US-12 | Filtrar por status | P0 | Must | 4 | 3 | US-10 | Sprint 2 |
| 10 | US-14 | Paginar (8 itens/página) | P0 | Must | 3 | 3 | US-02 | Sprint 2 |
| 11 | US-03 | Editar tarefa | P0 | Must | 4 | 2 | US-01 | Sprint 3 |
| 12 | US-04 | Excluir tarefa | P0 | Must | 4 | 2 | US-01 | Sprint 3 |
| 13 | US-19 | Layout profissional e responsivo | P0 | Must | 5 | 5 | US-02, US-15 | Sprint 3 |
| 14 | US-16 | Kanban reflete status automático | P0 | Must | 4 | 3 | US-10, US-15 | Sprint 3 |
| 15 | US-09 | Progresso das subtarefas (K/N) | P1 | Should | 3 | 2 | US-05 | Sprint 3 |
| 16 | US-06 | Editar subtarefa | P1 | Should | 3 | 2 | US-05 | Sprint 3 |
| 17 | US-07 | Excluir subtarefa | P1 | Should | 3 | 2 | US-05 | Sprint 3 |
| 18 | US-13 | Combinar filtros (nome + status) | P1 | Should | 3 | 2 | US-11, US-12 | Sprint 4 |
| 19 | US-21 | Alternar Lista/Kanban | P1 | Should | 3 | 3 | US-15 | Sprint 4 |
| 20 | US-20 | Estados vazios e feedback | P1 | Should | 4 | 3 | US-02 | Sprint 4 |
| 21 | US-17 | Contagem por coluna no Kanban | P2 | Could | 2 | 2 | US-15 | Sprint 4 |

**Total estimado:** 62 SP

## 3. Critérios de Priorização Aplicados

- **Valor de negócio:** Capacidade de criar/ver tarefas e a **regra de status automático** (US-10) são o coração do produto.
- **Dependências:** Subtarefas (US-05/US-08) precedem o status derivado (US-10); o Kanban (US-15/US-16) depende do status.
- **Riscos:** Persistência (US-18) priorizada cedo para validar o `localStorage` ainda no início.
- **Esforço:** Itens pequenos e independentes (US-03/04) encaixados para preencher capacidade.

## 4. MVP (Minimum Viable Product)

Todas as histórias **Must** compõem o MVP:

`US-01, US-02, US-03, US-04, US-05, US-08, US-10, US-11, US-12, US-14, US-15, US-16, US-18, US-19`

O MVP entrega: CRUD de tarefas, subtarefas com marcação, status automático, filtros, paginação, Kanban, persistência e layout profissional.

## 5. Releases Propostas

### Release 1.0 — MVP (Sprints 1–3)
- Núcleo: tarefas, subtarefas, status automático, filtros, paginação, Kanban, persistência, layout.

### Release 1.1 — Refinamento (Sprint 4)
- Edição/exclusão de subtarefas, progresso K/N, filtros combinados, alternância Lista/Kanban, estados vazios, contagem por coluna.

### Backlog Futuro (Won't — pós-MVP)
- Drag-and-drop no Kanban
- Prioridade, tags e datas de vencimento
- Export/import (backup) dos dados
- Sincronização em nuvem / multiusuário
- Notificações e lembretes

## 6. Riscos de Entrega

| Risco | Stories afetadas | Mitigação |
|-------|------------------|-----------|
| Regra de status ambígua (sem subtarefas) | US-10 | Validar com stakeholders antes do Sprint 2 |
| Limite do localStorage | US-18 | Testar payload e documentar limite |
| Complexidade do Kanban responsivo | US-15, US-19 | Alinhar design com UX/UI antes do Sprint 2 |

## 7. Próximos Passos (Handoff)

1. Refinamento técnico com **Arquiteto** e **Frontend Dev** (estimar US-10 e US-15).
2. Alinhamento de UI do Kanban e da lista com **UX/UI Designer**.
3. Definição do schema de dados em `localStorage` com o time técnico.
4. Criação dos planos de teste para a regra de status com o **Tester**.
