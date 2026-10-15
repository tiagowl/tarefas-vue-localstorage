# User Stories — Sistema de Gerenciamento de Tarefas

**Autor:** Product Owner
**Versão:** 1.0
**Data:** 2026-10-15
**Formato:** Como [tipo de usuário] — Eu quero [funcionalidade] — Para que [benefício/valor]

**Escala de prioridade:** MoSCoW (Must / Should / Could / Won't)
**Estimativa:** Story Points (Fibonacci) — preliminar, sujeita a refinamento técnico.

---

## Épico 1 — Gestão de Tarefas

### US-01 — Criar tarefa — `Must` — 3 SP
**Como** usuário,
**eu quero** criar uma tarefa informando nome e, opcionalmente, uma descrição,
**para que** eu registre o que preciso fazer.

**Notas:** nome obrigatório; descrição opcional; status inicial calculado ("A fazer").

### US-02 — Listar tarefas — `Must` — 2 SP
**Como** usuário,
**eu quero** visualizar a lista das minhas tarefas com nome, descrição e status atual,
**para que** eu saiba o que tenho para fazer.

### US-03 — Editar tarefa — `Must` — 2 SP
**Como** usuário,
**eu quero** editar o nome e a descrição de uma tarefa existente,
**para que** eu mantenha as informações corretas e atualizadas.

### US-04 — Excluir tarefa — `Must` — 2 SP
**Como** usuário,
**eu quero** excluir uma tarefa mediante confirmação,
**para que** eu remova itens que não são mais necessários.

**Notas:** a exclusão deve remover também as subtarefas vinculadas.

---

## Épico 2 — Gestão de Subtarefas

### US-05 — Criar subtarefa — `Must` — 3 SP
**Como** usuário,
**eu quero** adicionar subtarefas a uma tarefa,
**para que** eu detalhe as etapas necessárias para concluí-la.

### US-06 — Editar subtarefa — `Should` — 2 SP
**Como** usuário,
**eu quero** editar o nome de uma subtarefa,
**para que** eu ajuste o texto conforme necessário.

### US-07 — Excluir subtarefa — `Should` — 2 SP
**Como** usuário,
**eu quero** excluir uma subtarefa,
**para que** eu remova etapas que não são mais relevantes.

### US-08 — Marcar subtarefa como feita — `Must` — 3 SP
**Como** usuário,
**eu quero** marcar/desmarcar subtarefas como feitas,
**para que** eu acompanhe o progresso do trabalho.

### US-09 — Visualizar progresso das subtarefas — `Should` — 2 SP
**Como** usuário,
**eu quero** ver a contagem de subtarefas concluídas (ex.: `2/5`),
**para que** eu tenha noção rápida do andamento da tarefa.

---

## Épico 3 — Status Automático

### US-10 — Status derivado automaticamente — `Must` — 5 SP
**Como** usuário,
**eu quero** que o status da tarefa (A fazer / Fazendo / Feito) seja calculado automaticamente
a partir das subtarefas concluídas,
**para que** eu não precise atualizar o status manualmente.

**Notas:**
- Nenhuma subtarefa feita (ou sem subtarefas) → **A fazer**
- Pelo menos uma feita (e não todas) → **Fazendo**
- Todas as subtarefas feitas (≥1) → **Feito**

---

## Épico 4 — Filtros e Paginação

### US-11 — Filtrar tarefas por nome — `Must` — 3 SP
**Como** usuário,
**eu quero** filtrar tarefas por nome (busca textual),
**para que** eu encontre rapidamente uma tarefa específica.

### US-12 — Filtrar tarefas por status — `Must` — 3 SP
**Como** usuário,
**eu quero** filtrar tarefas por status (A fazer / Fazendo / Feito),
**para que** eu foque em um grupo específico de tarefas.

### US-13 — Combinar filtros — `Should` — 2 SP
**Como** usuário,
**eu quero** combinar filtro de nome e status,
**para que** eu refine a busca com mais precisão.

### US-14 — Paginar tarefas — `Must` — 3 SP
**Como** usuário,
**eu quero** navegar entre páginas de 8 tarefas,
**para que** a lista permaneça organizada e leve.

**Notas:** a paginação deve respeitar os filtros ativos.

---

## Épico 5 — Visão Kanban

### US-15 — Visualizar tarefas em Kanban — `Must` — 5 SP
**Como** usuário,
**eu quero** ver as tarefas em três colunas (A fazer, Fazendo, Feito),
**para que** eu tenha uma visão visual e imediata do andamento do trabalho.

### US-16 — Kanban reflete status automático — `Must` — 3 SP
**Como** usuário,
**eu quero** que as tarefas mudem de coluna automaticamente ao marcar subtarefas,
**para que** o quadro esteja sempre atualizado sem ação manual.

### US-17 — Contagem por coluna no Kanban — `Could` — 2 SP
**Como** usuário,
**eu quero** ver a quantidade de tarefas em cada coluna,
**para que** eu dimensione rapidamente a carga em cada etapa.

---

## Épico 6 — Persistência

### US-18 — Persistir dados localmente — `Must` — 5 SP
**Como** usuário,
**eu quero** que tarefas e subtarefas sejam salvas automaticamente no navegador,
**para que** meus dados continuem disponíveis ao recarregar ou reabrir a aplicação.

---

## Épico 7 — Experiência (UX/UI)

### US-19 — Layout profissional e responsivo — `Must` — 5 SP
**Como** usuário,
**eu quero** uma interface bonita, elegante e responsiva,
**para que** eu use a aplicação com conforto em diferentes dispositivos.

### US-20 — Estados vazios e feedback — `Should` — 3 SP
**Como** usuário,
**eu quero** receber feedback visual (estados vazios, confirmações, avisos),
**para que** eu entenda o que está acontecendo e evite erros.

### US-21 — Alternar entre visão Lista e Kanban — `Should` — 3 SP
**Como** usuário,
**eu quero** alternar entre a visão de lista e a visão Kanban,
**para que** eu escolha a forma de visualização mais adequada ao meu momento.

---

## Resumo

| Épico | Stories | Must | Should | Could |
|-------|---------|------|--------|-------|
| 1. Gestão de Tarefas | US-01..04 | 4 | 0 | 0 |
| 2. Gestão de Subtarefas | US-05..09 | 2 | 3 | 0 |
| 3. Status Automático | US-10 | 1 | 0 | 0 |
| 4. Filtros e Paginação | US-11..14 | 3 | 1 | 0 |
| 5. Visão Kanban | US-15..17 | 2 | 0 | 1 |
| 6. Persistência | US-18 | 1 | 0 | 0 |
| 7. Experiência (UX/UI) | US-19..21 | 1 | 2 | 0 |
| **Total** | **21** | **14** | **6** | **1** |
