# Wireframes — Sistema de Gerenciamento de Tarefas

**Autor:** UX Designer
**Versão:** 1.0
**Data:** 2026-10-15
**Formato:** Wireframes de baixa fidelidade (ASCII) + anotações de layout
**Base:** `user-research.md`, `outputs/product-owner/user-stories.md`

> Convenção: `[ ]` botão/ação · `( )` campo · `☐` checkbox · `▢` card · `≡` menu

---

## 1. Arquitetura de Informação

```
Aplicação
├── Header (global)
│   ├── Título / Logo
│   ├── Seletor de visão: [ Lista | Kanban ]   (US-21)
│   └── Ação primária: [ + Nova tarefa ]        (US-01)
├── Barra de ferramentas (somente na visão Lista)
│   ├── Busca por nome (  )                     (US-11)
│   ├── Filtro de status: [ Todos ▾ ]           (US-12/13)
│   └── Limpar filtros [ × ]                    (US-13)
├── Conteúdo
│   ├── Visão Lista  → cards paginados (8)      (US-02, US-14)
│   └── Visão Kanban → 3 colunas                (US-15)
├── Paginação (somente na visão Lista)          (US-14)
└── Overlays
    ├── Modal: Criar/Editar tarefa              (US-01, US-03)
    ├── Modal: Detalhes + subtarefas            (US-05..09)
    ├── Dialog: Confirmar exclusão              (US-04, US-07)
    └── Toasts (feedback)                        (US-20)
```

---

## 2. Mapa de Fluxo de Navegação

```
                ┌────────────────────────────┐
                │        App carregado        │
                └──────────────┬─────────────┘
                               │
                   há tarefas? ── não ──► [Estado vazio + CTA]
                               │ sim                    │
                               ▼                        │
                     ┌──────────────────┐               │
        ┌───────────►│   Visão Lista    │◄──────────────┘
        │            └───────┬──────────┘
        │      [ + Nova]     │  [Detalhes]        [ Kanban ]
        │           ▼        ▼                        ▼
        │   ┌──────────┐  ┌───────────────┐   ┌──────────────┐
        │   │ Modal    │  │ Modal Detalhe │   │  Visão       │
        │   │ Tarefa   │  │  + Subtarefas │   │  Kanban      │
        │   └────┬─────┘  └───────┬───────┘   └──────┬───────┘
        │        │ salvar         │ marcar subtarefa │ mover auto
        │        └───────┬────────┘                  │
        │                ▼                            │
        │        ┌────────────────────────────────┐  │
        └────────┤ Status recalculado (auto)      ├──┘
                 │ Toast "Tarefa atualizada"      │
                 └────────────────────────────────┘
```

---

## 3. Wireframe — Estado Vazio (US-02)

```
┌──────────────────────────────────────────────────────────────┐
│  ✓ Minhas Tarefas                    [ Lista | Kanban ]  [+ Nova]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │
│                         ▢  ▢  ▢                              │
│                                                              │
│              Você ainda não tem tarefas                      │
│         Crie a primeira e comece a organizar seu dia         │
│                                                              │
│                  [ + Criar primeira tarefa ]                 │
│                                                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```
**Anotações**
- Ícone/ilustração leve, tom acolhedor (Carla, persona offline).
- CTA único e óbvio → reduz o "onde começo" (H5).
- Sem barra de filtros/paginação quando não há itens.

---

## 4. Wireframe — Visão Lista (desktop) (US-02, US-11, US-12, US-14)

```
┌──────────────────────────────────────────────────────────────┐
│  ✓ Minhas Tarefas                    [ Lista | Kanban ]  [+ Nova]│
├──────────────────────────────────────────────────────────────┤
│  ( 🔍 Buscar por nome...   )   Status: [ Todos ▾ ]   [ Limpar ×]│
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ☐  Revisar proposta do cliente X        ● A fazer      │  │
│  │    Enviar versão final até sexta        0/0            │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ☐  Site institucional                   ● Fazendo      │  │
│  │    Redesign completo                    2/5            │  │
│  │    ▓▓▓▓▓▓░░░░░░░░ (40%)                                │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ☑  Ler capítulo 4                       ● Feito        │  │
│  │    Trabalho de faculdade                3/3            │  │
│  │    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ (100%)                              │  │
│  └────────────────────────────────────────────────────────┘  │
│                          … (até 8 por página)                │
├──────────────────────────────────────────────────────────────┤
│              [ ‹ Anterior ]   Página 1 de 3   [ Próxima › ]   │
└──────────────────────────────────────────────────────────────┘
```
**Anotações**
- Badge de status colorido e consistente (A fazer / Fazendo / Feito).
- Progresso `K/N` + barra derivada das subtarefas (US-09).
- Card inteiro clicável → abre detalhes; ações rápidas em hover (`⋮ Editar / Excluir`).
- Busca e filtro ao vivo; "Limpar" só aparece com filtro ativo.
- Paginação: 8 itens, desabilita setas nos limites; reinicia p/ página 1 ao filtrar.

### 4.1 Estado "nenhum resultado" (US-11)

```
│  ( 🔍 "zzz"  )   Status: [ Todos ▾ ]   [ Limpar ×]            │
│  ┌────────────────────────────────────────────────────────┐   │
│  │        Nenhuma tarefa encontrada para "zzz"            │   │
│  │        [ Limpar filtros ]                              │   │
│  └────────────────────────────────────────────────────────┘   │
```

---

## 5. Wireframe — Modal Criar/Editar Tarefa (US-01, US-03)

```
              ┌──────────────────────────────────────┐
              │  Nova tarefa                     [ × ] │
              ├──────────────────────────────────────┤
              │  Nome *                                │
              │  ( ________________________________ )  │
              │  ⚠ Nome é obrigatório                  │  ← erro condicional
              │                                        │
              │  Descrição (opcional)                  │
              │  ( ________________________________ )  │
              │  ( ________________________________ )  │
              │                                        │
              ├──────────────────────────────────────┤
              │              [ Cancelar ]  [ Salvar ]  │
              └──────────────────────────────────────┘
```
**Anotações**
- Autofocus no campo Nome.
- Validar ao submeter: nome vazio ou só espaços ⇒ erro inline (US-01).
- `Esc` cancela; `Enter` salva; foco preso no modal (acessibilidade).

---

## 6. Wireframe — Modal Detalhes + Subtarefas (US-05..US-09)

```
┌────────────────────────────────────────────────────────────┐
│  Site institucional                                   [ × ] │
│  Redesign completo             ● Fazendo    Progresso 2/5   │
│  ▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ (40%)                 │
├────────────────────────────────────────────────────────────┤
│  Subtarefas                                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ☑  Levantar requisitos      [ ✎ ] [ 🗑 ]              │  │
│  │ ☑  Wireframes               [ ✎ ] [ 🗑 ]              │  │
│  │ ☐  UI final                 [ ✎ ] [ 🗑 ]              │  │
│  │ ☐  Implementar              [ ✎ ] [ 🗑 ]              │  │
│  │ ☐  Testes                   [ ✎ ] [ 🗑 ]              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ( Nova subtarefa...                                ) [ + ] │
├────────────────────────────────────────────────────────────┤
│                                        [ Editar tarefa ]    │
└────────────────────────────────────────────────────────────┘
```
**Anotações**
- Marcar/desmarcar recalcula status e progresso **em tempo real** (US-08, US-10).
- Ao atingir 100%, badge muda para "Feito" com micro-animação e toast.
- Excluir subtarefa pede confirmação leve; exclusão recalcula status (US-07).
- Editar subtarefa inline (duplo clique ou ícone ✎) (US-06).
- Estado vazio de subtarefas: "Nenhuma subtarefa ainda — adicione a primeira".

---

## 7. Wireframe — Visão Kanban (desktop) (US-15, US-16, US-17)

```
┌──────────────────────────────────────────────────────────────┐
│  ✓ Minhas Tarefas                    [ Lista | Kanban ]  [+ Nova]│
├──────────────────────────────────────────────────────────────┤
│  Busca/filtros também ativos no Kanban (US-13)                │
├──────────────────┬──────────────────┬────────────────────────┤
│  A FAZER   (4)   │  FAZENDO   (2)   │  FEITO   (3)           │
│ ┌──────────────┐ │ ┌──────────────┐ │ ┌──────────────────┐   │
│ │ Revisar      │ │ │ Site         │ │ │ Ler capítulo 4   │   │
│ │ proposta X   │ │ │ institucional│ │ │ 3/3              │   │
│ │ 0/0          │ │ │ 2/5 ▓▓░░░░   │ │ └──────────────────┘   │
│ └──────────────┘ │ └──────────────┘ │ ┌──────────────────┐   │
│ ┌──────────────┐ │ ┌──────────────┐ │ │ Comprar material │   │
│ │ Comprar...   │ │ │ Planilha de  │ │ │ 1/1              │   │
│ │ 0/2          │ │ │ custos 1/3   │ │ └──────────────────┘   │
│ └──────────────┘ │ └──────────────┘ │                        │
│      …           │                  │        …               │
├──────────────────┴──────────────────┴────────────────────────┤
│  (Drag-and-drop previsto para versão futura — fora do MVP)   │
└──────────────────────────────────────────────────────────────┘
```
**Anotações**
- Cabeçalho de coluna com contagem `(n)` (US-17).
- Tarefa migra de coluna automaticamente ao mudar status (US-16) com animação suave.
- Coluna vazia: "Nenhuma tarefa aqui".
- MVP sem arrastar; clicar no card abre detalhes.

### 7.1 Kanban responsivo (mobile ≤ 640px)

```
┌────────────────────────────┐
│  ✓ Minhas Tarefas    ≡ [ + ]│
│  [ Lista | Kanban ]         │
├────────────────────────────┤
│  ◄  A FAZER (4)         ►   │   ← colunas em scroll horizontal
│  ┌────────────────────────┐ │      ou seletor de coluna
│  │ Revisar proposta X     │ │
│  │ 0/0                    │ │
│  └────────────────────────┘ │
│  ┌────────────────────────┐ │
│  │ Comprar material       │ │
│  │ 0/2                    │ │
│  └────────────────────────┘ │
└────────────────────────────┘
```
**Anotações**
- Colunas empilham/selecionam por abas ou scroll horizontal com indicador.
- Cards ocupam largura total; badges permanecem visíveis.

---

## 8. Wireframe — Confirmação de Exclusão (US-04, US-07)

```
              ┌──────────────────────────────────────┐
              │  Excluir tarefa?                 [ × ] │
              ├──────────────────────────────────────┤
              │  "Site institucional" e suas 5         │
              │  subtarefas serão removidas.           │
              │  Esta ação não pode ser desfeita.      │
              ├──────────────────────────────────────┤
              │              [ Cancelar ]  [ Excluir ] │
              └──────────────────────────────────────┘
```
**Anotações**
- Destrutivo à direita, com cor de alerta; foco inicial em "Cancelar".
- Informa o efeito em cascata nas subtarefas (US-04).

---

## 9. Wireframe — Toasts / Feedback (US-20)

```
                                 ┌──────────────────────────────┐
                                 │ ✓ Tarefa criada              │
                                 └──────────────────────────────┘
                                 ┌──────────────────────────────┐
                                 │ ✓ Tarefa marcada como feita  │
                                 └──────────────────────────────┘
                                 ┌──────────────────────────────┐
                                 │ ⚠ Não foi possível salvar    │
                                 └──────────────────────────────┘
```
- Posição: canto inferior direito (desktop) / topo (mobile).
- Auto-dismiss ~4s; erros persistem até ação ou dismiss manual.
- `role="status"` / `aria-live="polite"` para leitores de tela.

---

## 10. Estados por Tela (matriz)

| Tela | Vazio | Carregando | Sucesso | Erro |
|------|-------|-----------|---------|------|
| Lista | Ilustração + CTA | Skeleton cards | Cards com dados | "Não foi possível carregar" + retry |
| Kanban | Colunas com "sem tarefas" | Skeleton colunas | Cards distribuídos | Aviso + retry |
| Detalhes | "Nenhuma subtarefa" | — | Lista de subtarefas | Erro ao salvar subtarefa |
| Modal tarefa | Campos limpos | Botão "Salvando…" desabilitado | Fecha + toast | Erro inline |
| Busca/filtro | "Nenhum resultado" | — | Lista filtrada | — |

---

## 11. Responsividade — Breakpoints

| Faixa | Largura | Layout Lista | Layout Kanban | Navegação |
|-------|---------|--------------|---------------|-----------|
| Mobile | < 640px | 1 coluna; toolbar empilhada | Abas/scroll horizontal | Header compacto |
| Tablet | 640–1023px | 1 coluna larga | 3 colunas estreitas | Header completo |
| Desktop | ≥ 1024px | Lista confortável | 3 colunas amplas | Header completo + hover actions |

---

## 12. Acessibilidade (resumo — detalhe no design-system)

- Ordem de foco lógica; foco visível em todos os controles.
- Modais com foco preso e retorno de foco ao fechar.
- Badges de status não dependem só de cor (rótulo textual + ícone).
- Contraste mínimo 4.5:1 (texto) / 3:1 (elementos de UI).
- Alvos de toque ≥ 44×44px no mobile.
