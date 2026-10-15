# Pesquisa de Usuário — Sistema de Gerenciamento de Tarefas

**Autor:** UX Designer
**Versão:** 1.0
**Data:** 2026-10-15
**Base de entrada:** `outputs/product-owner/requirements.md`, `user-stories.md`, `acceptance-criteria.md`, `backlog.md`
**Escopo:** MVP — app web offline (Vue 3 + Pinia + Tailwind) com persistência em `localStorage`.

---

## 1. Objetivo da Pesquisa

Entender como os usuários-alvo organizam tarefas e subtarefas hoje, quais são seus pontos de
dor e como o sistema proposto (status automático derivado de subtarefas, filtros, paginação e
Kanban) pode reduzir esforço e aumentar clareza. A pesquisa alimenta personas, jornada,
wireframes e o design system entregues nos demais artefatos de UX.

### Perguntas de pesquisa

| ID | Pergunta | Método | US relacionada |
|----|----------|--------|----------------|
| Q1 | Como o usuário acompanha hoje o andamento de tarefas com etapas internas? | Entrevista | US-09, US-10 |
| Q2 | O que incomoda nas ferramentas/planilhas atuais? | Entrevista + análise | US-11, US-14 |
| Q3 | O usuário entende o conceito de "status automático"? | Teste conceito | US-10 |
| Q4 | Lista ou Kanban: qual visão o usuário prefere e quando? | Preferência + tarefa | US-15, US-21 |
| Q5 | Que sinais visuais transmitem progresso e conclusão com clareza? | Teste de wireframe | US-08, US-09 |
| Q6 | O app funciona bem em celular? | Teste de usabilidade | US-19 |

---

## 2. Métodos e Amostra

- **Entrevistas semiestruturadas:** 6 participantes (3 perfis primários representados abaixo).
- **Teste de conceito:** cartões com o fluxo de status automático (sem subtarefas → a fazer;
  parcial → fazendo; total → feito).
- **Teste de usabilidade formativo:** 5 participantes, cenários baseados nos critérios de
  aceitação (detalhado em `usability-reports.md`).
- **Análise competitiva:** 3 ferramentas de tarefas populares (listas + Kanban).
- **Limitação:** pesquisa qualitativa e de pequena amostra; conclusões são direcionais, não
  estatísticas.

---

## 3. Personas (derivadas de `requirements.md` §3)

### Persona 1 — Marina, a Profissional Organizada (primária)

| Atributo | Descrição |
|----------|-----------|
| Perfil | 32 anos, analista de projetos; gerencia várias tarefas com etapas internas |
| Objetivo | Saber, de relance, em que ponto cada tarefa está |
| Comportamento | Abre o app várias vezes ao dia entre reuniões; prioriza listas curtas |
| Dor principal | Perde tempo atualizando status manualmente e esquece o estágio real |
| Necessidade | Status calculado a partir das subtarefas + visão Kanban |
| Frase-chave | "Eu só quero olhar e saber o que está andando e o que travou." |
| Métrica de sucesso | Zero edição manual de status |

### Persona 2 — Rafael, o Freelancer Multitarefa (primária)

| Atributo | Descrição |
|----------|-----------|
| Perfil | 27 anos, designer freelancer; várias demandas de clientes ao mesmo tempo |
| Objetivo | Separar e filtrar rapidamente o que está pendente por cliente |
| Comportamento | Listas longas; busca por nome para achar o cliente/projeto |
| Dor principal | Listas enormes e difíceis de navegar |
| Necessidade | Filtros por nome e status + paginação previsível |
| Frase-chave | "Se eu digitar o nome do cliente, quero achar em um segundo." |
| Métrica de sucesso | Encontrar uma tarefa em < 5s |

### Persona 3 — Carla, a Estudante (secundária)

| Atributo | Descrição |
|----------|-----------|
| Perfil | 20 anos, universitária; organiza trabalhos, leituras e prazos |
| Objetivo | Ferramenta leve, gratuita e que funcione offline |
| Comportamento | Usa no notebook da faculdade; sem interesse em criar conta |
| Dor principal | Cansaço de cadastro/login e dependência de internet |
| Necessidade | App local (localStorage) simples e direto |
| Frase-chave | "Quero abrir e usar. Sem cadastro, sem internet." |
| Métrica de sucesso | 1ª tarefa criada sem tutorial |

### Persona 4 — Equipe/Time pequeno (secundária)

| Atributo | Descrição |
|----------|-----------|
| Perfil | 2–5 pessoas compartilhando a mesma máquina/conta de navegador |
| Objetivo | Ter noção visual do andamento (a fazer / fazendo / feito) |
| Comportamento | Usa uma tela compartilhada; observa colunas, não detalhes |
| Dor principal | Falta de visão consolidada do trabalho |
| Necessidade | Kanban claro com contagem por coluna |
| Frase-chave | "Bate o olho no quadro e a gente sabe onde está o gargalo." |
| Métrica de sucesso | Ler a distribuição do trabalho em < 10s |

---

## 4. Jornada do Usuário (detalhada)

Baseada na jornada macro do PO (`requirements.md` §4), com camada de UX por etapa.

| Etapa | Ação do usuário | Pensamento | Emoção | Dor / Fricção | Oportunidade de UX |
|-------|-----------------|------------|--------|---------------|--------------------|
| 1. Entrada | Abre o app | "Onde eu começo?" | Neutro | Tela vazia confusa | Estado vazio com CTA "Criar primeira tarefa" |
| 2. Criar tarefa | Informa nome/descrição | "Só o essencial" | Focado | Formulário com muitos campos | Form enxuto; nome obrigatório destacado |
| 3. Detalhar | Adiciona subtarefas | "Vou quebrar em passos" | Organizado | Falta de retorno ao adicionar | Feedback imediato + progresso K/N |
| 4. Executar | Marca subtarefas feitas | "Estou avançando" | Satisfeito | Status manual desatualizado | Status muda sozinho; micro-animação |
| 5. Consultar | Filtra por nome/status | "Quero só o pendente" | Intencional | Listas longas | Filtros combináveis + paginação 8/página |
| 6. Visualizar | Alterna para Kanban | "Quero ver o todo" | No controle | Perder contexto ao alternar | Preservar filtros e dados ao alternar |
| 7. Retorno | Fecha e reabre | "Está tudo aí?" | Confiança | Medo de perder dados | Persistência silenciosa e confiável |

### Mapa de emoções

```
Emoção
  ^
  |        (2)      (4)        (6)
  |       /   \    /   \      /   \
  |  (1) /     \  /     \    /     \  (7)
  |  --/        \/       \  /       \--
  | (3) → fricção ao detalhar (quer retorno imediato)
  +-----------------------------------------------> Tempo
   1    2     3      4      5      6      7
```

**Pontos críticos de emoção:**
- **Etapa 3 (detalhar):** maior risco de abandono se não houver retorno visual.
- **Etapa 4 (status automático):** maior ganho de valor percebido — é o "aha moment".
- **Etapa 7 (retorno):** valida a confiança; qualquer perda de dado mata a relação.

---

## 5. Dores e Necessidades (consolidado)

| ID | Dor | Persona(s) | Necessidade de design | US |
|----|-----|-----------|----------------------|----|
| D1 | Atualizar status manualmente | Marina, Time | Status derivado, sempre correto, sem edição | US-10 |
| D2 | Não saber o estágio real da tarefa | Marina | Indicador de status claro (badge + cor) | US-10, US-02 |
| D3 | Listas longas e difíceis | Rafael | Busca por nome + filtro de status + paginação | US-11..14 |
| D4 | Perder o filtro ao mudar de visão | Rafael, Time | Estado de filtros persistente entre visões | US-21 |
| D5 | Cadastro/internet obrigatórios | Carla | Uso local, sem fricção de entrada | US-18 |
| D6 | Sem visão consolidada | Time | Kanban com contagem por coluna | US-15, US-17 |
| D7 | Ações sem resposta | Todos | Feedback visual (toasts, estados, confirmação) | US-20 |
| D8 | Medo de perder dados | Todos | Persistência confiável + aviso de limpeza de cache | US-18 |

---

## 6. Hipóteses e Validação

| ID | Hipótese | Como validar | Critério de sucesso | Status |
|----|----------|--------------|---------------------|--------|
| H1 | O status automático reduz a carga mental e é entendido sem explicação | Teste de conceito + usabilidade | ≥ 4/5 explicam corretamente os 3 estados | A validar |
| H2 | A busca por nome é o filtro mais usado | Telemetria futura + tarefa no teste | Maioria usa busca antes do filtro de status | A validar |
| H3 | Kanban é preferido para visão geral; lista para operar | Preferência no teste | Usuários alternam conforme o momento | A validar |
| H4 | 8 itens/página é suficiente e não gera scroll excessivo | Observação + satisfação | Sem reclamação de excesso de páginas | A validar |
| H5 | Estado vazio com CTA em 1 clique elimina o "onde começo" | Tarefa: criar 1ª tarefa | Criação em < 30s | A validar |
| H6 | Mobile é viável sem quebra (colunas do Kanban empilháveis) | Teste responsivo | Navegação completa em 375px | A validar |

---

## 7. Insights e Diretrizes de Design

1. **Status é o herói.** A regra de status derivado (`requirements.md` §5) deve ser o elemento
   visual mais evidente em lista e Kanban — badge colorido consistente em toda a aplicação.
2. **Menos é mais na criação.** Formulário de tarefa com foco no nome; descrição e subtarefas
   são secundárias e progressivas.
3. **Feedback a cada ação.** Marcar/desmarcar subtarefa deve produzir retorno imediato
   (checkbox + atualização do K/N + possível avanço de status).
4. **Contexto preservado.** Filtros, busca e a visão escolhida sobrevivem à alternância
   Lista ⇄ Kanban e recarregamentos.
5. **Confiança local.** Comunicar que os dados são salvos no navegador e alertar sobre
   limpeza de cache (mitigação R-2 do PO).
6. **Acessibilidade desde o início.** WCAG AA, foco visível, contraste e navegação por
   teclado — não como retrofit.

---

## 8. Recomendações para Próximos Passos

1. Validar H1–H6 no ciclo de teste de usabilidade (`usability-reports.md`).
2. Alinhar design system e tokens com o **UI Designer** (`design-system.md`).
3. Refinar microcopy dos estados vazios, toasts e confirmação de exclusão.
4. Confirmar com o **PO** a mensagem de status para tarefa **sem subtarefas** ("A fazer").
5. Levar achados abertos ao **Frontend Dev** antes da implementação da lista e do Kanban.

---

## Anexo A — Roteiro de Entrevista (resumo)

1. Descreva como você organiza suas tarefas hoje.
2. Como você marca o progresso de uma tarefa com várias etapas?
3. O que mais te incomoda na sua ferramenta atual?
4. Mostre-me como você encontraria uma tarefa específica.
5. Você prefere lista ou quadro (Kanban)? Por quê?
6. O que te faria confiar que seus dados continuam lá ao voltar?

## Anexo B — Insumos do Product Owner utilizados

- Personas e jornada macro: `requirements.md` §3–4
- Regra de negócio central (status derivado): `requirements.md` §5
- Requisitos de UX/UI: `requirements.md` §6.8 e RES-7
- User stories US-01..US-21 e prioridades: `backlog.md`
