# Stack Tecnológica — Sistema de Gerenciamento de Tarefas

**Autor:** Arquiteto de Software
**Versão:** 1.0
**Data:** 2026-10-15
**Fontes:** `outputs/product-owner/requirements.md` (§7 Restrições), `outputs/ux/design-system.md`

---

## 1. Princípio de Seleção

As restrições RES-1..RES-3 **já fixam** o núcleo da stack (Vue 3 + TypeScript + Pinia +
Tailwind). Este documento **confirma** essas escolhas, **fecha as lacunas** (build tool,
testes, qualidade, IDs, ícones) e **justifica** cada decisão contra os critérios pedidos pelo
template: performance, escalabilidade, segurança, manutenibilidade e equipe disponível.

> Decisões estruturais decorrentes estão registradas em `adrs.md`.

---

## 2. Stack Definida

### 2.1 Núcleo (obrigatório por RES-1..RES-4)

| Camada | Tecnologia | Versão alvo | Papel | Restrição |
|--------|-----------|-------------|-------|-----------|
| UI Framework | **Vue 3** | ^3.4 (Composition API + `<script setup>`) | Reatividade e componentes | RES-1 |
| Linguagem | **TypeScript** | ^5.4 (modo `strict`) | Tipagem estática | RES-1 |
| Estado | **Pinia** | ^2.1 | Store central, getters, actions | RES-2 |
| Estilo | **Tailwind CSS** | ^3.4 | Utilitários + design tokens | RES-3 |
| Persistência | **Web Storage API (`localStorage`)** | nativa | Fonte de verdade em disco | RES-4 |

### 2.2 Ferramental escolhido (preenchendo as lacunas)

| Área | Escolha | Motivo |
|------|---------|--------|
| Build/Bundler | **Vite** | Padrão oficial do Vue 3; HMR rápido; build enxuto |
| Testes unitários | **Vitest** | Integra nativamente ao Vite; foco no domínio puro |
| Testes de componente | **@vue/test-utils** + **Vitest** | Testar componentes isoladamente |
| Testes E2E | **Playwright** | Cobrir fluxos críticos (US-10, US-18) e responsividade |
| Qualidade | **ESLint** (`eslint-plugin-vue`) + **Prettier** | Consistência e prevenção de erros |
| Tipos | **vue-tsc** | Checagem de tipos no CI/build |
| Ícones | **Inline SVG** (componente próprio) | Zero dependência extra; acessível; alinhado ao design system |
| IDs | **`crypto.randomUUID()`** | Nativo, seguro, sem lib; fallback documentado |
| Datas | **`Intl`/`Date` nativos** | Suficiente; sem biblioteca de datas no MVP |

---

## 3. Justificativa por Critério

### 3.1 Performance
- **Vite + tree-shaking:** bundle pequeno; app carrega rápido em conexões lentas.
- **Vue 3 reatividade granular:** re-render limitado aos componentes afetados.
- **Paginação fixa de 8 itens (RES-6):** limita o DOM da lista.
- **Kanban:** 3 listas renderizadas; risco R-4 (muitas tarefas) mitigado por scroll por
  coluna e virtualização **somente se necessário** (fora do MVP).
- Ícones inline eliminam requisições de web font (design system §2.2 já prevê `system-ui`).

### 3.2 Escalabilidade
- Escopo **single-user, sem backend** (RES-5): escalabilidade horizontal **não se aplica**.
- "Escala" aqui significa **crescer em features sem degradar**: garantida pelas camadas
  (arquitetura em camadas) e pelo domínio isolado.
- `localStorage` (~5 MB) é o teto natural — aceitável e documentado (R-1). Se o produto
  evoluir para multiusuário/nuvem, o `TaskRepository` é o ponto de troca (Interface
  Segregation, ver `design-patterns.md`).

### 3.3 Segurança
- **Superfície mínima:** sem servidor, sem rede, sem autenticação → sem OWASP web clássico
  (SQLi, XSS remoto, CSRF de sessão).
- **XSS:** Vue escapa interpolações por padrão; **proibido `v-html`** com conteúdo do usuário
  (ver `development-guidelines.md`).
- **Dados em repouso:** `localStorage` é legível por qualquer script da origem — não armazenar
  segredos/PII sensível (fora do escopo do MVP). Documentar ao usuário (R-2).
- **IDs:** `crypto.randomUUID()` evita colisões e previsibilidade.

### 3.4 Manutenibilidade
- **TypeScript `strict`** + `vue-tsc`: erros detectados em tempo de compilação.
- **Pinia:** estado tipado, com devtools e ações explícitas (fim de "estado no limbo").
- **Tailwind com tokens** (design system): contrato visual único, menos CSS órfão.
- **Domínio puro testável:** a regra central (US-10) é testada sem montar componentes.
- **ESLint + Prettier:** estilo uniforme, menor atrito em reviews.

### 3.5 Equipe disponível
- Vue 3 + TS + Pinia + Tailwind é stack **mainstream**, com documentação e comunidade amplas.
- Baixa curva para devs frontend com experiência em reatividade.
- Ferramental (Vite/Vitest) é o caminho oficial, reduzindo setup customizado.

---

## 4. Alternativas Consideradas

| Decisão | Alternativas | Por que não (no MVP) |
|---------|--------------|----------------------|
| Estado | Redux/Vuex, `provide/inject`, refs globais | Pinia é o padrão Vue 3, mais simples e tipado (RES-2) |
| Persistência | IndexedDB, backend REST, SQLite-WASM | Requisito exige `localStorage`; IDB é over-engineering (RES-4) |
| Estilo | CSS Modules, SCSS puro, componente library (PrimeVue/Element) | Tailwind + tokens dá controle visual sem peso de lib (RES-3) |
| Roteamento | `vue-router` | Single-view; troca por estado é suficiente (ADR-007) |
| Estado persistente | `pinia-plugin-persistedstate` | Acopla schema ao plugin; preferimos repositório explícito (ADR-008) |
| Datas | date-fns / dayjs | Desnecessário no MVP |
| IDs | `uuid` (npm) | `crypto.randomUUID()` é nativo |

> Detalhes de cada decisão e consequências em `adrs.md`.

---

## 5. Dependências (proposta de `package.json`)

```jsonc
{
  "dependencies": {
    "vue": "^3.4.0",
    "pinia": "^2.1.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "@vitejs/plugin-vue": "^5.0.0",
    "vue-tsc": "^2.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "vitest": "^1.6.0",
    "@vue/test-utils": "^2.4.0",
    "@playwright/test": "^1.44.0",
    "eslint": "^8.57.0",
    "eslint-plugin-vue": "^9.24.0",
    "@typescript-eslint/parser": "^7.0.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "prettier": "^3.2.0",
    "jsdom": "^24.0.0"
  }
}
```

**Princípio:** dependências **mínimas**. Cada lib adicionada precisa justificar peso,
manutenção e alinhamento com as restrições.

---

## 6. Configurações-chave

### 6.1 TypeScript (`tsconfig.json`)
```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noImplicitAny": true,
    "paths": { "@/*": ["src/*"] }
  }
}
```

### 6.2 Tailwind (`tailwind.config.js`)
- Estender `colors.status.{todo,doing,done}` e `--color-*` do design system.
- `borderRadius: { sm, md, lg }` conforme tokens.
- Respeitar `prefers-reduced-motion` (variantes de animação).

*O mapeamento completo de tokens está no Anexo A do `design-system.md` (UX).*

---

## 7. Requisitos de Ambiente

| Item | Requisito |
|------|-----------|
| Navegador | ES2020+, `localStorage`, suporte a Vue 3 (Chrome/Edge/Firefox/Safari atuais) |
| Node.js (dev) | ≥ 18 LTS (Vite 5) |
| Gerenciador de pacotes | npm (ou pnpm/yarn — a definir com DevOps) |
| Armazenamento | ~5 MB por origem (`localStorage`) |

---

## 8. Matriz de Rastreabilidade

| Requisito | Como a stack atende |
|-----------|---------------------|
| RES-1 | Vue 3 + TypeScript |
| RES-2 | Pinia |
| RES-3 | Tailwind CSS |
| RES-4 | Web Storage API (`localStorage`) |
| RES-5 | Sem SDK de auth/backend |
| RES-6 | Lógica de paginação no domínio/getter |
| RES-7 | Design system (UX) + Tailwind + acessibilidade |

---

## 9. Handoff

| Decisão | Consumidor |
|---------|-----------|
| `package.json` e versões | **Frontend Dev** / **DevOps** |
| Configurações TS/Tailwind | **Frontend Dev** |
| Estratégia de testes (Vitest/Playwright) | **Tester** / **Frontend Dev** |
| Regras de ESLint/Prettier | **Frontend Dev** |
