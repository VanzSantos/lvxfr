# Arquitetura — LVXFR

Visão de alto nível pra quem chega no projeto agora. Regras de geração detalhadas vivem em
`SKILL.md`; status corrente (feito/próximo/dívida técnica) vive em `ROADMAP.md`; decisões
individuais de cada componente vivem no próprio contrato (`contratos/*.contract.json`,
array `decisions`) e são consolidadas automaticamente em `CHANGELOG.md` (`npm run
changelog`). Este arquivo não repete nada disso — só explica como as peças se encaixam.

## O que é o LVXFR

Um design system baseado em **contratos executáveis**: cada componente tem um arquivo
JSON (`contratos/<nome>.contract.json`) que documenta props, anatomia, tokens permitidos,
requisitos de acessibilidade e decisões já tomadas — e uma IA gerando ou revisando código
consulta esse contrato em vez de improvisar. É uma evolução direta do AuroraDS, otimizada
especificamente para prototipagem interativa assistida por IA (Claude Code, Codex e
similares): o contrato existe pra manter gerações sucessivas consistentes entre si, mesmo
em sessões/ferramentas diferentes.

## As 4 camadas

```
tokens/  →  contratos/  →  src/components/  →  src/interface/
(valores)   (regras)       (implementação)      (Playground + protótipos)
```

1. **`tokens/`** — fonte da verdade de cor/espaço/tipografia/raio, espelhando o Figma
   (`tokens.json`) e já resolvida em CSS custom properties (`tokens.css`, importado uma
   única vez em `src/main.tsx`). Nomes de token continuam em português (são as variáveis
   reais do Figma) — ver `tokens/token-notation.md` pra notação completa.
2. **`contratos/`** — um arquivo por componente, validado contra
   `component-contract.schema.json`. Campo mais importante pra manutenção contínua:
   `tokensAllowed`, que lista exatamente quais tokens cada categoria (background, border,
   text, radius, focusRing, iconColor, typography...) pode usar — se o CSS usa um token
   fora dessa lista, ou é um bug real (token errado) ou o contrato ficou desatualizado
   (whitelist subdeclarada). `decisions` é o changelog do próprio componente: cada entrada
   registra o que mudou e por quê, com prefixos (`AJUSTADO a pedido do usuário`,
   `REVISADO`, `BUG REAL corrigido`, `CORRIGIDO`) que indicam a natureza da mudança.
3. **`src/components/`** — implementação React/TS, uma pasta por componente, mapeada 1:1
   a um contrato pelo nome. `src/components/shared/` guarda utilitários reaproveitados por
   mais de um componente (máscaras de input, normalização de busca) — nunca um componente
   em si.
4. **`src/interface/`** — o DS Playground (`stories/`, navegável por `App.tsx`) que
   exercita cada componente com todas as variantes/estados documentados no contrato, e as
   `screens/` — telas completas construídas sobre os componentes.

## `interface/screens/`: Templates vs Páginas

O Playground agrupa telas em duas categorias, nenhuma delas com contrato próprio (são
infraestrutura de harness/protótipo, não átomos/moléculas/organismos reutilizáveis por
produtos externos):

- **Templates** (`SettingsTemplate`, `DashboardTemplate`, `KanbanTemplate`) — telas de
  referência do próprio harness, cada uma com sua casca própria (`NavBar` ou nenhuma),
  pensadas pra mostrar composições reais dos componentes sem depender de infraestrutura
  compartilhada entre si.
- **Páginas** (`BackofficeTemplate`, `CrudTemplate`, `LoginScreen` e as demais telas de
  auth/erro) — protótipos de produto propriamente ditos. `BackofficeTemplate` e
  `CrudTemplate` compartilham a casca `AppShell` (`src/interface/screens/shared/
  AppShell.tsx`): SideNav + header responsivo (Breadcrumb/NotificationCenter). Essa
  categorização (Templates vs Páginas) é uma decisão explícita do usuário — não mova um
  componente de grupo sem pedido equivalente.

**Regra fixa para qualquer página construída sobre `AppShell`:** o conteúdo real da
página fica sempre dentro de um card na área central da tela (mesmo padrão do
`.emptyCard` do `BackofficeTemplate`), nunca solto direto sobre o fundo da página — exceto
com direção explícita em contrário. Documentado na íntegra no JSDoc de `AppShellProps.children`
e detalhado no porquê em `CrudTemplate.module.css` (`.contentCard`), porque foi lá que a
regra revelou um caso não óbvio: um componente com sua própria borda (`Datatable`) ainda
assim pode deixar parte do conteúdo (a toolbar) fora de qualquer superfície de card.

## Criando um novo protótipo

Um protótipo novo não precisa de um projeto/clone separado — é uma pasta nova em
`src/interface/screens/`, registrada em `src/interface/stories/registry.ts` (grupo
`"Páginas"`), reaproveitando `AppShell` quando fizer sentido. Toda tela registrada abre
isolada via `/?standalone=<key>` (ver `Abrir em nova página` em qualquer story do
Playground) — então múltiplos protótipos convivem no mesmo projeto sem se atrapalharem,
mantendo contratos/tokens/componentes como fonte única. Ver `README.md` pra orientação
completa de instalação/uso, incluindo quando faz sentido um clone separado em vez disso.

## Por que não há dedup prematuro entre componentes

Duas peças de CSS ou lógica parecidas em dois componentes diferentes não são
automaticamente extraídas num átomo/hook compartilhado — contratos deste harness
priorizam clareza (cada componente é auto-suficiente e legível sozinho) sobre DRY. A
exceção só acontece quando há **múltiplos consumidores reais simultâneos** pedindo
exatamente a mesma coisa (ex.: `AppShell`, extraído depois que `BackofficeTemplate` e
`CrudTemplate` — dois consumidores concretos — precisavam da mesma casca; ou
`shared/normalizeForSearch.ts`, reaproveitado por `Select` e `ComboBox` depois que os dois
precisaram corrigir o mesmo bug de acentuação). Nunca extrair por especulação de que "um
terceiro consumidor pode aparecer".

## Auditoria de consistência

Duas classes de inconsistência valem checagem periódica (feita manualmente ou por uma IA
seguindo este documento + `SKILL.md`):

1. **Contrato vs implementação** — todo token usado num `.module.css` precisa estar
   listado em `tokensAllowed` na categoria certa do contrato correspondente; toda prop
   documentada precisa existir na interface TS real, e vice-versa.
2. **Contrato vs Playground** — toda variante/estado/valor de prop que o contrato declara
   válido precisa ter pelo menos um exemplo visível no demo daquele componente em
   `src/interface/stories/`; o Playground é a prova viva de que o contrato bate com o
   código.

A11y merece atenção redobrada em qualquer componente que abre um painel flutuante
(`@floating-ui/react`): overlays não-modais (Popover e qualquer uso cru de `useFloating`
fora do componente `Popover`) precisam de `FloatingFocusManager` — sem isso, `Esc` fecha o
painel mas não devolve o foco de verdade pro gatilho, mesmo que o contrato prometa esse
comportamento.
