# Documento de Requisitos — Sistema Web de Gerenciamento de Tarefas

**Autor:** Product Owner
**Versão:** 1.0
**Data:** 2026-10-15
**Status:** Aprovado para refinamento técnico

---

## 1. Visão Geral

Sistema web para gerenciamento pessoal/profissional de tarefas e subtarefas, com atualização
automática de status a partir do progresso das subtarefas, filtros, paginação e uma visão
Kanban. A aplicação roda 100% no navegador, com persistência local (`localStorage`), sem
dependência de backend.

## 2. Objetivos de Negócio

| ID | Objetivo | Métrica de Sucesso |
|----|----------|--------------------|
| OBJ-1 | Permitir que o usuário organize tarefas e subtarefas de forma simples | Usuário cria 1ª tarefa em < 30s após abrir o app |
| OBJ-2 | Reduzir o esforço manual de atualização de status | Status da tarefa 100% derivado das subtarefas (zero edição manual) |
| OBJ-3 | Oferecer diferentes formas de visualização (lista e Kanban) | Usuário alterna entre visões sem perder contexto/filtros |
| OBJ-4 | Garantir que os dados persistam entre sessões | Dados preservados após recarregar/fechar o navegador |
| OBJ-5 | Entregar experiência visual profissional e agradável | Interface responsiva, consistente e acessível (WCAG AA) |

## 3. Usuários-Alvo (Personas)

### Persona 1 — Marina, a Profissional Organizada (primária)
- **Perfil:** 32 anos, analista de projetos, gerencia múltiplas tarefas com etapas internas.
- **Objetivo:** Acompanhar o progresso de cada tarefa sem atualizar status manualmente.
- **Dor:** Perde tempo marcando status e esquece em que ponto cada tarefa está.
- **Necessidade:** Subtarefas com status derivado automático + visão Kanban.

### Persona 2 — Rafael, o Freelancer Multitarefa (primária)
- **Perfil:** 27 anos, designer freelancer, atende vários clientes ao mesmo tempo.
- **Objetivo:** Separar tarefas por cliente e filtrar rapidamente o que está pendente.
- **Dor:** Listas longas e difíceis de navegar.
- **Necessidade:** Filtros por nome/status e paginação.

### Persona 3 — Carla, a Estudante (secundária)
- **Perfil:** 20 anos, estudante universitária, organiza trabalhos e leituras.
- **Objetivo:** Uma ferramenta leve, gratuita e que funcione offline.
- **Dor:** Não quer criar conta nem depender de internet.
- **Necessidade:** App local (localStorage) simples e direto.

### Persona 4 — Equipe/Time pequeno (secundária)
- **Perfil:** 2–5 pessoas compartilhando a mesma máquina/conta de navegador.
- **Objetivo:** Ter noção visual do andamento do trabalho (a fazer / fazendo / feito).
- **Necessidade:** Kanban claro com contagem de itens por coluna.

## 4. Jornada do Usuário (macro)

1. **Descoberta/Entrada:** usuário abre o app e vê estado vazio com CTA claro ("Criar primeira tarefa").
2. **Criação de tarefa:** adiciona nome (obrigatório) e descrição (opcional).
3. **Detalhamento:** adiciona subtarefas à tarefa.
4. **Execução:** marca subtarefas como feitas; o status da tarefa atualiza automaticamente
   (a fazer → fazendo → feito).
5. **Consulta:** filtra por nome e/ou status; navega pela paginação (8 itens/página).
6. **Visualização:** alterna para o Kanban e vê as tarefas distribuídas nas 3 colunas.
7. **Retorno:** fecha/reabre o navegador e encontra tudo como deixou (persistência).

## 5. Regra de Negócio Central — Status Derivado

O status da tarefa é **calculado** (não editável manualmente) com base nas subtarefas:

| Condição | Status exibido |
|----------|----------------|
| Tarefa sem subtarefas **ou** nenhuma subtarefa feita | **A fazer** |
| Pelo menos uma subtarefa feita (e não todas) | **Fazendo** |
| Todas as subtarefas feitas (≥1) | **Feito** |

> **Nota de decisão (PO):** tarefa sem subtarefas é tratada como "A fazer".
> Este comportamento está documentado como critério de aceitação e deve ser confirmado
> com o time técnico (ver dependências).

## 6. Funcionalidades Principais

### 6.1 Tarefas (CRUD)
- Criar tarefa com **nome** (obrigatório) e **descrição** (opcional).
- Listar tarefas.
- Editar nome e descrição.
- Excluir tarefa (com confirmação; remove subtarefas associadas).

### 6.2 Subtarefas (CRUD)
- Criar subtarefa vinculada a uma tarefa.
- Editar e excluir subtarefa.
- Marcar/desmarcar subtarefa como **feita**.
- Exibir progresso (ex.: `2/5 concluídas`).

### 6.3 Status Automático
- Derivação automática conforme Seção 5, refletida em lista, filtros e Kanban.

### 6.4 Filtros
- Filtrar por **nome** (busca textual, case-insensitive).
- Filtrar por **status** (a fazer / fazendo / feito).
- Combinar filtros nome + status.

### 6.5 Paginação
- **8 tarefas por página**.
- Navegação anterior/próxima e indicação de página atual/total.
- Respeita os filtros ativos.

### 6.6 Visão Kanban
- Três colunas: **A fazer**, **Fazendo**, **Feito**.
- Cada tarefa aparece na coluna correspondente ao seu status derivado.
- Reordenação/refresh automático ao mudar status das subtarefas.

### 6.7 Persistência
- Todos os dados em `localStorage`.
- Recuperação automática ao carregar a aplicação.

### 6.8 UX/UI
- Layout elegante, profissional e responsivo.
- Feedback visual de ações (toasts/estados), estados vazios, loading e erros.
- Acessibilidade e consistência de design.

## 7. Restrições e Limitações

| ID | Restrição |
|----|-----------|
| RES-1 | Frontend em **Vue 3 + TypeScript** |
| RES-2 | Gerenciamento de estado com **Pinia** |
| RES-3 | Estilização com **Tailwind CSS** |
| RES-4 | Persistência exclusivamente em **localStorage** (sem backend) |
| RES-5 | Aplicação single-user (sem autenticação/multi-tenant) |
| RES-6 | Paginação fixa de 8 itens por página |
| RES-7 | Layout deve seguir boas práticas de UX/UI (responsivo, acessível) |

## 8. Fora de Escopo (não-objetivos — MVP)

- Autenticação, contas de usuário e sincronização em nuvem.
- Colaboração em tempo real / compartilhamento entre dispositivos.
- Notificações, lembretes e integração com calendário.
- Anexos, etiquetas, prioridade e datas de vencimento.
- Drag-and-drop no Kanban (avaliar em versão futura).
- Upload/exportação de dados.

## 9. Premissas

- Navegador moderno com suporte a `localStorage` e ES2020+.
- Volume típico de dados compatível com os limites do `localStorage` (~5 MB).

## 10. Dependências e Pontos a Validar

- Confirmar com o **Arquiteto/Frontend** o comportamento de status para tarefas **sem subtarefas**.
- Definir estratégia de migração/versionamento do schema em `localStorage`.
- Alinhar com **UX/UI Designer** o design system e os componentes do Kanban e da lista.

## 11. Riscos

| ID | Risco | Impacto | Mitigação |
|----|-------|---------|-----------|
| R-1 | Limite de tamanho do `localStorage` | Médio | Validar payload; documentar limite no backlog |
| R-2 | Perda de dados ao limpar cache do navegador | Alto | Documentar aviso ao usuário; futuro export/backup |
| R-3 | Regra de status ambígua (sem subtarefas) | Médio | Registrar decisão e validar com stakeholders |
| R-4 | Performance do Kanban com muitas tarefas | Baixo | Virtualização/divisão por coluna (avaliar) |
