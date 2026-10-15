# Critérios de Aceitação — Sistema de Gerenciamento de Tarefas

**Autor:** Product Owner
**Versão:** 1.0
**Data:** 2026-10-15
**Formato:** Gherkin (Dado / Quando / Então)

Cada critério cobre cenários de sucesso, casos extremos e validações necessárias.

---

## US-01 — Criar tarefa

**Sucesso**
- **Dado** que estou na tela de tarefas,
  **Quando** informo um nome válido e clico em "Criar",
  **Então** a tarefa é criada e aparece na lista com status "A fazer".

**Sucesso (com descrição opcional)**
- **Dado** que informo nome e descrição,
  **Quando** salvo a tarefa,
  **Então** ambos os campos são persistidos e exibidos.

**Caso extremo / validação**
- **Dado** que deixo o nome vazio,
  **Quando** tento salvar,
  **Então** o sistema impede a criação e exibe mensagem de erro.
- **Dado** um nome contendo apenas espaços,
  **Quando** tento salvar,
  **Então** a tarefa não é criada (campo tratado como vazio).
- **Dado** um nome muito longo,
  **Quando** salvo,
  **Então** o layout não quebra (truncamento/overflow tratado).

---

## US-02 — Listar tarefas

- **Dado** que existem tarefas cadastradas,
  **Quando** abro a aplicação,
  **Então** vejo a lista com nome, descrição e status de cada tarefa.

**Estado vazio**
- **Dado** que não existem tarefas,
  **Quando** abro a aplicação,
  **Então** vejo um estado vazio com CTA para criar a primeira tarefa.

**Casos extremos**
- **Dado** que uma tarefa não tem descrição,
  **Quando** ela é listada,
  **Então** o campo de descrição não deixa espaço/placeholder quebrado.

---

## US-03 — Editar tarefa

- **Dado** que uma tarefa existe,
  **Quando** altero nome e/ou descrição e salvo,
  **Então** os dados são atualizados e refletidos na lista.

**Validação**
- **Dado** que removo o nome ao editar,
  **Quando** salvo,
  **Então** o sistema impede e mantém o valor anterior.
- **Dado** que inicio uma edição e cancelo,
  **Quando** saio do modo de edição,
  **Então** nenhuma alteração é persistida.

---

## US-04 — Excluir tarefa

- **Dado** que uma tarefa existe,
  **Quando** solicito exclusão,
  **Então** o sistema pede confirmação antes de remover.

- **Dado** que confirmo a exclusão,
  **Quando** a operação conclui,
  **Então** a tarefa some da lista **e** suas subtarefas são removidas em cascata.

- **Dado** que cancelo a exclusão,
  **Quando** a caixa fecha,
  **Então** a tarefa permanece inalterada.

---

## US-05 — Criar subtarefa

- **Dado** que abro os detalhes de uma tarefa,
  **Quando** adiciono uma subtarefa com nome válido,
  **Então** a subtarefa é vinculada à tarefa e exibida na lista de subtarefas.

**Validação**
- **Dado** que informo nome vazio,
  **Quando** tento salvar,
  **Então** a subtarefa não é criada e um erro é exibido.

---

## US-06 — Editar subtarefa

- **Dado** que uma subtarefa existe,
  **Quando** altero seu nome e salvo,
  **Então** o novo texto é exibido e persistido.
- **Dado** que removo o nome,
  **Quando** salvo,
  **Então** o sistema impede e mantém o valor anterior.

---

## US-07 — Excluir subtarefa

- **Dado** que uma subtarefa existe,
  **Quando** a excluo,
  **Então** ela é removida da tarefa e o status da tarefa é recalculado.

---

## US-08 — Marcar subtarefa como feita

- **Dado** uma subtarefa não feita,
  **Quando** clico em marcar como feita,
  **Então** ela passa para o estado "feita" com indicação visual (checkbox).
- **Dado** uma subtarefa feita,
  **Quando** desmarco,
  **Então** ela volta ao estado não feita e o status da tarefa é recalculado.

---

## US-09 — Visualizar progresso das subtarefas

- **Dado** uma tarefa com N subtarefas, das quais K estão feitas,
  **Quando** visualizo a tarefa,
  **Então** vejo o indicador `K/N` atualizado a cada mudança.
- **Dado** uma tarefa sem subtarefas,
  **Quando** a visualizo,
  **Então** vejo `0/0` ou indicador neutro sem erro.

---

## US-10 — Status derivado automaticamente (regra central)

> Cenário-chave do produto. O status é **calculado**, nunca editável manualmente.

- **Dado** uma tarefa **sem subtarefas**,
  **Então** o status é "A fazer".
- **Dado** uma tarefa com subtarefas e **nenhuma** feita,
  **Então** o status é "A fazer".
- **Dado** uma tarefa com subtarefas e **ao menos uma** feita (mas não todas),
  **Então** o status é "Fazendo".
- **Dado** uma tarefa em que **todas** as subtarefas estão feitas (≥ 1),
  **Então** o status é "Feito".

**Casos extremos**
- **Dado** uma tarefa com todas as subtarefas feitas e depois desmarco uma,
  **Então** o status volta de "Feito" para "Fazendo".
- **Dado** uma tarefa com uma única subtarefa que é marcada como feita,
  **Então** o status vai de "A fazer" direto para "Feito".
- **Dado** que excluo a última subtarefa não feita de uma tarefa "Fazendo",
  **Então** o status recalcula conforme as subtarefas restantes.

---

## US-11 — Filtrar tarefas por nome

- **Dado** tarefas cadastradas,
  **Quando** digito parte do nome,
  **Então** a lista mostra apenas tarefas cujo nome contém o termo.
- **Dado** uma busca com diferença de maiúsculas/minúsculas,
  **Então** o filtro é case-insensitive.
- **Dado** um termo sem correspondência,
  **Então** a lista mostra estado "nenhum resultado".

---

## US-12 — Filtrar tarefas por status

- **Dado** tarefas com status variados,
  **Quando** seleciono "Fazendo",
  **Então** vejo apenas tarefas com status "Fazendo".

---

## US-13 — Combinar filtros

- **Dado** filtros de nome e status aplicados,
  **Quando** ambos estão ativos,
  **Então** a lista retorna tarefas que satisfazem **ambos** os critérios (AND).
- **Dado** que limpo os filtros,
  **Então** a lista volta a exibir todas as tarefas.

---

## US-14 — Paginar tarefas

- **Dado** mais de 8 tarefas,
  **Quando** abro a lista,
  **Então** vejo no máximo **8** itens na página 1.
- **Dado** que navego para a próxima página,
  **Então** vejo os 8 itens seguintes e o indicador de página atualiza.
- **Dado** um total que não é múltiplo de 8,
  **Então** a última página mostra apenas os itens restantes.
- **Dado** filtros ativos,
  **Então** a paginação considera apenas o subconjunto filtrado.
- **Dado** que aplico um filtro estando na página 3,
  **Então** a paginação reinicia para a página 1.

---

## US-15 — Visualizar tarefas em Kanban

- **Dado** tarefas cadastradas,
  **Quando** abro a visão Kanban,
  **Então** vejo três colunas: "A fazer", "Fazendo" e "Feito".
- **Dado** uma tarefa com determinado status,
  **Então** ela aparece exatamente na coluna correspondente.
- **Dado** uma coluna sem tarefas,
  **Então** exibe um estado vazio adequado.

---

## US-16 — Kanban reflete status automático

- **Dado** o Kanban aberto,
  **Quando** marco uma subtarefa que muda o status da tarefa,
  **Então** a tarefa se move automaticamente para a coluna correta.

---

## US-17 — Contagem por coluna no Kanban

- **Dado** o Kanban aberto,
  **Então** cada coluna exibe a contagem atualizada de tarefas.

---

## US-18 — Persistir dados localmente

- **Dado** que crio/edito/excluo tarefas e subtarefas,
  **Quando** recarrego ou reabro o navegador,
  **Então** os dados são restaurados exatamente como estavam.
- **Dado** um `localStorage` corrompido/indisponível,
  **Então** a aplicação não quebra (trata erro e inicia vazio com aviso).

---

## US-19 — Layout profissional e responsivo

- **Dado** um viewport de desktop, tablet e mobile,
  **Então** o layout se adapta sem quebra e sem scroll horizontal indevido.
- **Dado** uso de teclado,
  **Então** os controles são acessíveis (foco visível, navegação por Tab).

---

## US-20 — Estados vazios e feedback

- **Dado** qualquer ação (criar/editar/excluir),
  **Então** o usuário recebe feedback visual (toast/confirmação) de sucesso ou erro.

---

## US-21 — Alternar entre visão Lista e Kanban

- **Dado** que estou na visão Lista,
  **Quando** alterno para Kanban e volto,
  **Então** a aplicação mantém os mesmos dados e os filtros ativos.

---

## Definição de Pronto (DoD) global

- [ ] Critérios de aceitação atendidos e demonstráveis.
- [ ] Sem erros no console do navegador.
- [ ] Dados persistidos corretamente em `localStorage`.
- [ ] Responsividade validada (desktop, tablet, mobile).
- [ ] Revisão de UX/UI aprovada.
- [ ] Regra de status (US-10) coberta por testes.
