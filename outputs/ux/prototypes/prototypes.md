# Protótipos Interativos — Sistema de Gerenciamento de Tarefas

**Autor:** UX Designer
**Versão:** 1.0
**Data:** 2026-10-15
**Formato:** Especificação de comportamento (interações, estados, transições e feedback)
**Base:** `wireframes/wireframes.md`, `outputs/product-owner/acceptance-criteria.md`

> Este documento descreve **como** cada componente se comporta. Serve de especificação
> funcional de interação para o **Frontend Dev** e de roteiro para o teste de usabilidade.

---

## 1. Princípios de Interação

1. **Resposta imediata:** toda ação do usuário gera feedback em < 100ms (visual) e < 1s (persistência).
2. **Otimista com segurança:** atualiza a UI na hora e persiste em `localStorage`; em erro, reverte e avisa.
3. **Derivação, não edição:** o status nunca é editado — é recalculado a partir das subtarefas.
4. **Contexto preservado:** filtros, busca e visão ativa sobrevivem a mudanças e recarregamentos.
5. **Reversibilidade informada:** ações destrutivas exigem confirmação explícita.

---

## 2. Fluxo Principal (happy path) — passo a passo

```
[1] Abrir app
     └─ sem dados → Estado vazio + CTA
     └─ com dados → Lista paginada (página 1)
                    │
[2] Clicar "+ Nova tarefa"
     └─ Modal abre; foco em "Nome"
                    │
[3] Digitar nome → [Salvar]
     ├─ inválido → erro inline; permanece no modal
     └─ válido  → cria tarefa (status "A fazer"); fecha modal; toast "Tarefa criada"
                    │
[4] Abrir detalhes da tarefa → adicionar subtarefas
     └─ cada adição → item aparece na lista + progresso K/N atualiza
                    │
[5] Marcar subtarefa como feita (checkbox)
     └─ status recalcula automaticamente → badge/coluna atualizam (com animação)
                    │
[6] Filtrar / buscar (opcional)
     └─ lista reduz; paginação reinicia para página 1
                    │
[7] Alternar para Kanban
     └─ mesmos dados e filtros; cards nas colunas por status
                    │
[8] Recarregar navegador
     └─ tudo restaurado como estava
```

---

## 3. Interações por Componente

### 3.1 Campo de busca por nome (US-11)

| Evento | Comportamento |
|--------|---------------|
| Tecla digitada | Filtra ao vivo (case-insensitive) após ~200ms (debounce) |
| Sem correspondência | Exibe estado "Nenhum resultado" + ação "Limpar filtros" |
| Botão limpar (×) | Esvazia o campo e restaura a lista completa |
| Foco | Mostra hint "Buscar por nome…" |

- **Transição:** lista faz um fade leve ao atualizar (opcional, respeita `prefers-reduced-motion`).

### 3.2 Filtro de status (US-12, US-13)

- Dropdown com opções: **Todos**, **A fazer**, **Fazendo**, **Feito**.
- Combina com a busca por **AND**; chips mostram filtros ativos.
- Ao aplicar/alterar filtro estando em página > 1 → **volta à página 1** (US-14).

### 3.3 Card de tarefa (US-02)

| Área | Ação | Resultado |
|------|------|-----------|
| Checkbox de conclusão rápida * | Clique | Marca **todas** as subtarefas como feitas → status "Feito" |
| Corpo do card | Clique | Abre modal de detalhes |
| Ícone `⋮` (hover/focus) | Clique | Menu: Editar · Excluir |
| Badge de status | — | Somente leitura; reflete o cálculo |

> *Checkbox rápido é opcional no MVP; se incluído, deve ser equivalente a "concluir tudo".
> Se não incluído, remover do card para evitar ambiguidade com as subtarefas.

### 3.4 Checkbox de subtarefa (US-08) — interação central

```
Clicar em ☐
   ├─ item ganha estado "feito" (riscado + check animado ~150ms)
   ├─ contador K/N incrementa
   ├─ barra de progresso avança
   └─ status da tarefa recalcula:
        nenhuma feita            → "A fazer"
        ≥1 e não todas           → "Fazendo"
        todas (≥1)               → "Feito"  (+ toast "Tarefa concluída")
```
- Desmarcar faz o caminho inverso e recalcula (ex.: "Feito" → "Fazendo").
- No Kanban, o card migra de coluna com transição de ~250ms.

### 3.5 Modal Criar/Editar tarefa (US-01, US-03)

| Evento | Comportamento |
|--------|---------------|
| Abrir (criar) | Campos vazios; foco em Nome |
| Abrir (editar) | Campos preenchidos; foco em Nome |
| Salvar com nome vazio/só espaços | Erro inline "Nome é obrigatório"; não fecha |
| Salvar válido | Persiste; fecha; toast ("criada"/"atualizada") |
| Cancelar / `Esc` | Fecha sem salvar; retorna foco ao elemento de origem |
| Salvar em andamento | Botão vira "Salvando…" e desabilita (previne duplo envio) |

### 3.6 Modal de detalhes + subtarefas (US-05..US-09)

| Ação | Comportamento |
|------|---------------|
| Adicionar subtarefa | Enter ou `+`; valida nome; item entra no fim da lista |
| Editar subtarefa | Inline (duplo clique / ✎); nome vazio ⇒ mantém anterior |
| Excluir subtarefa | Confirmação leve; recalcula status/progresso |
| Fechar | Retorna foco ao card de origem |

### 3.7 Tomada de decisão — exclusão (US-04, US-07)

```
[Excluir] → Dialog de confirmação
    ├─ "Cancelar" / Esc → fecha; nada muda (foco em Cancelar por padrão)
    └─ "Excluir" → remove item (+ subtarefas em cascata) → toast "Tarefa excluída"
```
- Não usar "desfazer" como única proteção no MVP; confirmação é obrigatória.

### 3.8 Seletor de visão Lista ⇄ Kanban (US-21)

- Alternância instantânea, sem recarregar.
- **Preserva** busca, filtro de status e dados.
- A visão escolhida pode ser lembrada no `localStorage` (preferência, não dado de tarefa).

### 3.9 Paginação (US-14)

| Ação | Comportamento |
|------|---------------|
| Anterior/Próxima | Move 1 página; setas desabilitam nos limites |
| Indicador | "Página X de Y" |
| Mudança de filtro/busca | Reinicia para página 1 |
| Exclusão na última página | Se a página ficar vazia, recua para a anterior |

---

## 4. Máquina de Estados — Status da Tarefa (US-10)

```
         sem subtarefas  │  nenhuma feita
              ┌──────────┴──────────┐
              ▼                     │
        ┌───────────┐   marcar 1ª   │
        │  A FAZER  │───────────────┘ (permanece "A fazer" enquanto 0 feitas)
        └─────┬─────┘
              │ ≥1 feita e não todas
              ▼
        ┌───────────┐  desmarcar uma
        │  FAZENDO  │◄──────────────┐
        └─────┬─────┘               │
              │ todas feitas (≥1)   │
              ▼                     │
        ┌───────────┐               │
        │   FEITO   │───────────────┘
        └───────────┘
```

| De | Evento | Para | Efeito visual |
|----|--------|------|----------------|
| A fazer | marcar 1ª (de N>1) | Fazendo | Badge muda cor; K/N = 1/N |
| A fazer | marcar única subtarefa | Feito | Badge "Feito"; toast de conclusão |
| Fazendo | marcar a última | Feito | Animação de conclusão; card migra no Kanban |
| Feito | desmarcar uma | Fazendo | Badge volta; card retorna de coluna |
| Fazendo | excluir subtarefa não feita | Recalcula | Pode virar Feito se restantes todas feitas |
| Qualquer | excluir última subtarefa | A fazer | K/N = 0/0 |

---

## 5. Estados da Interface (UI states)

### 5.1 Estado vazio (empty)
- Lista: ilustração + título + CTA.
- Kanban por coluna: "Nenhuma tarefa aqui".
- Subtarefas: "Nenhuma subtarefa ainda".

### 5.2 Carregando (loading)
- **Skeleton** cards/colunas por ~300ms (persistência local é rápida).
- Botões de ação exibem spinner + texto "Salvando…".

### 5.3 Sucesso
- Toast verde com check; auto-dismiss ~4s.
- Micro-animações: check de subtarefa, migração de card (~250ms).

### 5.4 Erro
- Erro de validação: inline, junto ao campo, com ícone e texto.
- Erro de persistência (`localStorage` cheio/indisponível): toast de alerta persistente
  e mensagem de orientação (mitigação R-1/R-2 do PO).
- Erro de dados corrompidos: inicia vazio com aviso, sem quebrar (AC US-18).

---

## 6. Transições e Animações (especificação)

| Transição | Duração | Easing | Observação |
|-----------|---------|--------|------------|
| Abertura/fechamento de modal | 180ms | ease-out | Fade + scale 0.96→1 |
| Check de subtarefa | 150ms | ease-out | Traço do check |
| Migração de card no Kanban | 250ms | ease-in-out | FLIP / fade-out→in |
| Toast entrada/saída | 200ms | ease-out | Slide da borda |
| Fade da lista ao filtrar | 120ms | linear | Desligar em `prefers-reduced-motion` |

> **Acessibilidade:** respeitar `prefers-reduced-motion: reduce` → usar apenas fade ou
> transições instantâneas.

---

## 7. Comportamento de Persistência (protótipo de dados)

- Cada mudança dispara salvamento debounced (~300ms) em `localStorage`.
- Chave única versionada (ex.: `tarefas-app:v1`) para futura migração de schema.
- Ao carregar: tenta ler → valida → se corrompido, inicia vazio + aviso.
- Salvar nunca deve bloquear a interação; falha é tratada com toast e reversão visual.

```json
{
  "version": 1,
  "tasks": [
    {
      "id": "t1",
      "name": "Site institucional",
      "description": "Redesign completo",
      "subtarefas": [
        { "id": "s1", "name": "Levantar requisitos", "done": true },
        { "id": "s2", "name": "Wireframes", "done": true },
        { "id": "s3", "name": "UI final", "done": false }
      ]
    }
  ],
  "prefs": { "view": "list", "pageSize": 8 }
}
```
> `status` **não** é armazenado — é sempre derivado em runtime (regra central do PO).

---

## 8. Microcopy (textos de interface)

| Contexto | Texto proposto |
|----------|----------------|
| Estado vazio (lista) | "Você ainda não tem tarefas. Crie a primeira e comece a organizar seu dia." |
| CTA vazio | "Criar primeira tarefa" |
| Sem resultado de busca | "Nenhuma tarefa encontrada para “{termo}”." |
| Erro de nome | "Nome é obrigatório." |
| Toast criar | "Tarefa criada" |
| Toast atualizar | "Tarefa atualizada" |
| Toast concluir | "Tarefa concluída 🎉" |
| Toast excluir | "Tarefa excluída" |
| Confirmação exclusão | "“{nome}” e suas {n} subtarefas serão removidas. Esta ação não pode ser desfeita." |
| Erro de persistência | "Não foi possível salvar no navegador. Verifique o espaço disponível." |
| Aviso de cache | "Seus dados ficam neste navegador. Limpar o cache pode removê-los." |

---

## 9. Checklist de Protótipo (rascunho clicável)

- [ ] Fluxo vazio → criar 1ª tarefa
- [ ] Criar/editar/excluir tarefa com validações e confirmação
- [ ] Adicionar/editar/excluir subtarefa
- [ ] Marcar/desmarcar subtarefa com recálculo de status
- [ ] Busca por nome + filtro de status + combinação
- [ ] Paginação (8/página) com reinício ao filtrar
- [ ] Kanban com migração automática e contagem por coluna
- [ ] Alternância Lista ⇄ Kanban preservando contexto
- [ ] Toasts e estados de erro/persistência
- [ ] Responsivo (mobile/tablet/desktop) e navegação por teclado

---

## 10. Handoff

- **Frontend Dev:** componentes, estados, transições e contrato de dados (§3, §5, §6, §7).
- **UI Designer:** aplicar tokens e componentes visuais do `design-system.md`.
- **Tester:** usar §2–§4 como roteiro de casos (complementa `usability-reports.md`).
- **Product Owner:** validar microcopy e mensagem de status para tarefa sem subtarefas.
