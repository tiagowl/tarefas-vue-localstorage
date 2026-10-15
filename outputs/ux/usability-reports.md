# Relatórios de Usabilidade — Sistema de Gerenciamento de Tarefas

**Autor:** UX Designer
**Versão:** 1.0
**Data:** 2026-10-15
**Base:** `wireframes/wireframes.md`, `prototypes/prototypes.md`, `outputs/product-owner/acceptance-criteria.md`

Este documento contém:
- **Parte A — Plano de Teste de Usabilidade** (a executar)
- **Parte B — Relatório de Inspeção Heurística** (achados preliminares, sem usuários)
- **Parte C — Modelo de Relatório de Sessão** (para registrar os resultados reais)
- **Parte D — Painel de Métricas e Plano de Iteração**

---

## Parte A — Plano de Teste de Usabilidade

### A.1 Objetivos

| ID | Objetivo | US |
|----|----------|----|
| O1 | Verificar se o conceito de status automático é compreendido sem explicação | US-10 |
| O2 | Avaliar a eficiência de encontrar uma tarefa (busca + filtro) | US-11..13 |
| O3 | Validar a usabilidade da lista paginada de 8 itens | US-14 |
| O4 | Testar entendimento e uso do Kanban | US-15..17 |
| O5 | Confirmar fluidez do CRUD de tarefas e subtarefas | US-01..09 |
| O6 | Observar confiança na persistência local | US-18 |
| O7 | Verificar usabilidade em mobile | US-19 |

### A.2 Perfil dos participantes

| Grupo | Persona | Nº | Critério |
|-------|---------|----|----------|
| Primário | Marina (organizada) | 2 | Usa gestor de tarefas semanalmente |
| Primário | Rafael (multitarefa) | 2 | Gerencia múltiplos projetos/clientes |
| Secundário | Carla (estudante) | 2 | Pouca familiaridade com Kanban |
| Secundário | Time pequeno | 1 | Uso compartilhado de tela |

**7 participantes** (moderado, formato remotamente moderado, 45 min cada).

### A.3 Método

- **Formato:** teste moderado, think-aloud, sessões de 45 min.
- **Dispositivos:** 5 sessões desktop, 2 sessões mobile (viewport 375×667).
- **Prototype:** protótipo clicável conforme `prototypes/prototypes.md`.
- **Ferramentas:** gravação de tela, checklist de tarefas, escala SUS ao final.

### A.4 Cenários de Uso (tasks)

| # | Cenário (tarefa) | Sucesso esperado | Métrica principal | US |
|---|------------------|------------------|-------------------|----|
| T1 | "Você acabou de instalar o app. Registre uma tarefa de trabalho." | Cria a 1ª tarefa em 1 clique no CTA | Tempo até criar 1ª tarefa (< 30s) | US-01 |
| T2 | "Detalhe essa tarefa em 3 etapas." | Adiciona 3 subtarefas válidas | Sucesso na tarefa | US-05 |
| T3 | "Você concluiu 1 das etapas. Atualize o app." | Marca 1 subtarefa; observa status "Fazendo" | Entendimento do status | US-08, US-10 |
| T4 | "Conclua tudo o que faltava." | Marca restantes; status vira "Feito" | % que percebe a mudança automática | US-10 |
| T5 | "Encontre rapidamente a tarefa do cliente X." | Usa busca por nome | Tempo de busca (< 5s) | US-11 |
| T6 | "Mostre apenas o que ainda não começou." | Filtra por status "A fazer" | Sucesso na tarefa | US-12 |
| T7 | "Alterne para a visão de quadro." | Abre Kanban; localiza as 3 colunas | Sucesso + preferência | US-15, US-21 |
| T8 | "Recarregue a página. O que aconteceu com seus dados?" | Confirma persistência | Percepção de confiança | US-18 |

### A.5 Métricas coletadas

| Métrica | Definição | Meta |
|---------|-----------|------|
| Taxa de sucesso por tarefa | % que completa sem ajuda | ≥ 90% |
| Tempo até 1ª tarefa | Do load ao save | < 30s |
| Tempo de busca | Do início aos resultados corretos | < 5s |
| Erros/hesitações | Eventos observados por tarefa | ≤ 1 por tarefa |
| SUS | System Usability Scale (0–100) | ≥ 80 |
| Eficiência de cliques | Cliques vs. caminho ideal | ≤ 1,5× |
| Compreensão do status | Explica corretamente os 3 estados | ≥ 4/5 |

### A.6 Considerações éticas

- Consentimento informado, direito de interromper, dados anonimizados.
- Sem vieses de origem: testadores não são autores do design.

---

## Parte B — Relatório de Inspeção Heurística (achados preliminares)

> Realizada por 2 avaliadores de UX sobre os wireframes e a especificação de protótipo,
> com base nas 10 heurísticas de Nielsen. **Não substitui** o teste com usuários; serve
> para corrigir problemas óbvios antes da rodada com participantes.

### B.1 Resumo

- **Heurísticas aplicadas:** 10 (Nielsen).
- **Violações identificadas:** 6 (0 críticas, 2 altas, 3 médias, 1 baixa).
- **Avaliadores:** 2 · **Tempo:** ~2h.

### B.2 Achados

| ID | Heurística | Tela/Elemento | Problema | Severidade | Recomendação | US |
|----|-----------|---------------|----------|-----------|--------------|----|
| H-01 | Visibilidade do status | Card de tarefa / Kanban | Se badge não tiver rótulo textual, cor sozinha não comunica status (acessibilidade e daltonismo) | Alta | Badge com **ícone + texto** além da cor | US-02, US-10, US-15 |
| H-02 | Prevenção de erros | Checkbox rápido no card | Ambiguidade: marcar no card x marcar subtarefas pode confundir | Alta | Definir claramente ("concluir tudo") ou remover do MVP | US-08 |
| H-03 | Ajuda e documentação | Aviso de localStorage | Risco de perda de dados por limpeza de cache é invisível | Média | Aviso discreto na 1ª sessão + tooltip "dados locais" | US-18 |
| H-04 | Controle e liberdade | Filtros | Sem indicação de filtros ativos, usuário "se perde" | Média | Chips de filtros ativos + botão "Limpar" visível | US-11..13 |
| H-05 | Consistência | Alternância de visão | Se filtros/página não persistirem ao alternar, gera desorientação | Média | Preservar contexto ao trocar Lista ⇄ Kanban | US-21 |
| H-06 | Reconhecer em vez de lembrar | Estado vazio | Sem CTA, o usuário para na tela vazia | Baixa | Já endereçado no wireframe (CTA presente); manter | US-02 |

### B.3 Prioridades de correção antes do teste

1. **H-01 e H-02 (altas)** — corrigir antes de testar com usuários.
2. **H-03, H-04, H-05 (médias)** — incluir no escopo do MVP.
3. **H-06 (baixa)** — validar na sessão.

---

## Parte C — Modelo de Relatório de Sessão

> Preencher ao executar o teste (Parte A). Um bloco por participante; consolidar ao final.

### C.1 Ficha da sessão

| Campo | Valor |
|-------|-------|
| Participante (código) | P0X |
| Persona representada | Marina / Rafael / Carla / Time |
| Dispositivo | Desktop / Mobile |
| Data / Duração | ____ / ____ |
| SUS | ____ |
| Observações gerais | ________ |

### C.2 Resultados por tarefa

| Tarefa | Sucesso (S/N/com ajuda) | Tempo | Erros | Comentário |
|--------|-------------------------|-------|-------|------------|
| T1 Criar 1ª tarefa | | | | |
| T2 Detalhar subtarefas | | | | |
| T3 Marcar 1 subtarefa | | | | |
| T4 Concluir tudo | | | | |
| T5 Buscar tarefa | | | | |
| T6 Filtrar status | | | | |
| T7 Kanban | | | | |
| T8 Persistência | | | | |

### C.3 Citações e observações qualitativas

> Registrar frases literais relevantes, hesitações e percepções (especialmente sobre o
> status automático e a confiança na persistência).

- P0X: "..."
- P0Y: "..."

### C.4 Consolidado (exemplo de estrutura)

| Métrica | Meta | Resultado | Status |
|---------|------|-----------|--------|
| Taxa de sucesso global | ≥ 90% | ____ | |
| Tempo até 1ª tarefa | < 30s | ____ | |
| Tempo médio de busca | < 5s | ____ | |
| SUS médio | ≥ 80 | ____ | |
| Compreensão do status | ≥ 4/5 | ____ | |

---

## Parte D — Painel de Métricas e Plano de Iteração

### D.1 Escala de severidade

| Nível | Descrição | Ação |
|-------|-----------|------|
| Crítica | Impede a conclusão da tarefa | Corrigir imediatamente (bloqueia release) |
| Alta | Causa erro/atrito significativo | Corrigir no sprint atual |
| Média | Atrasa ou confunde, mas contorna-se | Agendar próximo sprint |
| Baixa | Incômodo cosmético/menor | Backlog |

### D.2 Matriz de priorização (Impacto × Frequência)

```
        Alta frequência
             │
   Achados   │  H-01  H-04
   médios    │
   ──────────┼─────────────── Alto impacto
             │  H-02
   Achados   │       H-03 H-05
   baixos    │            H-06
             │
        Baixa frequência
```

### D.3 Ciclo de iteração

1. **Rodada 1 (formativa):** 7 participantes na Parte A → corrigir Críticas/Altas.
2. **Rodada 2 (validação):** 5 participantes, foco nos problemas corrigidos.
3. **Ciclo contínuo:** reavaliar após a implementação no Frontend.

### D.4 Critérios de saída (exit criteria)

- [ ] 0 problemas críticos em aberto.
- [ ] ≥ 90% de sucesso em todas as tarefas-chave (T1–T8).
- [ ] SUS ≥ 80.
- [ ] Compreensão do status automático ≥ 4/5.
- [ ] Achados H-01 e H-02 resolvidos e revalidados.
- [ ] Persistência percebida como confiável por ≥ 6/7.

---

## Anexo A — Relação com Critérios de Aceitação

Cada cenário (T1–T8) mapeia diretamente para critérios de aceitação do PO, permitindo
reuso pelo **Tester**:

| Cenário | Critérios cobertos |
|---------|--------------------|
| T1 | US-01 (sucesso + validação de nome) |
| T2 | US-05 (criar subtarefa) |
| T3 | US-08 + US-10 (Fazendo) |
| T4 | US-10 (Feito) |
| T5 | US-11 (+ estado "nenhum resultado") |
| T6 | US-12 + US-13 |
| T7 | US-15 + US-16 + US-17 + US-21 |
| T8 | US-18 (persistência) |

## Anexo B — Riscos da avaliação

| Risco | Mitigação |
|-------|-----------|
| Protótipo não fiel ao produto final | Validar wireframe/protótipo com Frontend antes |
| Amostra pequena / viés | Recrutar fora da equipe; balancear personas |
| Efeito novidade no Kanban | Contra-balancear ordem das tarefas entre participantes |
