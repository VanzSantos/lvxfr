---
name: design-system-harness
description: Use SEMPRE que for gerar, revisar, auditar ou prototipar qualquer componente ou tela de UI/front-end desta marca. Garante que o código siga os tokens em camadas (tokens/tokens.json, ver tokens/token-notation.md) e os contratos de componente (contratos/*.contract.json), em vez de improvisar cor, espaçamento, variante ou prop.
---

# Design System Harness

Este skill existe para resolver um problema específico: sem ele, cada geração de UI
reinterpreta as regras de um jeito ligeiramente diferente, e o resultado diverge do Figma
e do resto do código. Ele funciona como um "contrato executável" — a IA não decide sozinha
o que um componente pode ou não fazer, ela consulta.

## Antes de gerar qualquer código

1. Leia `tokens/token-notation.md` para entender como os caminhos de token neste harness
   (`semantic.*`, `structural.*`, `type-style.*`) mapeiam pras coleções reais do
   `tokens/tokens.json`. As mesmas variáveis já resolvidas para CSS estão em
   `tokens/tokens.css` (`--nome-do-token`, sem prefixo de camada).
2. Localize o contrato do componente pedido em `contratos/<nome-em-ingles>.contract.json`.
   - **Se o contrato não existir**: pare e avise que é preciso criar o contrato antes de
     gerar código. Não improvise variante, prop, token ou evento.
   - Se existir, confira `dependencies` — componentes compostos (ex.: TextField) esperam
     que os átomos que consomem (FieldLabel, HelperText, Icon) já estejam corretos.
3. Contratos preservam decisões já tomadas em `decisions` — não reabra esse debate nem
   proponha alternativa às decisões já registradas ali sem o usuário pedir explicitamente.

## Regras de geração fixadas após o primeiro teste de determinismo

Rodamos o mesmo pedido de TextField 3 vezes e comparamos. Estas regras existem porque
pelo menos uma das 3 gerações as violou:

- **Nunca reimplemente um átomo dependente inline** (FieldLabel, HelperText, Icon, Tooltip
  dentro de TextField, por exemplo) porque ele "não está disponível no ambiente". Se o
  arquivo do átomo não estiver no contexto da conversa, peça ao usuário o contrato ou o
  arquivo daquele átomo antes de gerar o componente que depende dele. Recriar o átomo do
  zero já causou uma violação real: uma versão inline decidiu sozinha se renderizava,
  contrariando a decisão registrada no contrato original.
- **Todo componente sempre em arquivo separado**, nunca dois componentes num único arquivo,
  mesmo em exemplos rápidos.
- **CSS custom properties seguem `tokens/token-notation.md`** — nome do token sem prefixo de
  camada (`--borda-erro`, nunca `--semantic-borda-erro`). Os valores já resolvidos vivem em
  `tokens/tokens.css`, importado uma única vez no bootstrap da aplicação
  (`src/main.tsx`) — componentes nunca duplicam esses valores, só consomem `var(--...)`.
- **Nunca passe o nome do token como string literal** (`'semantic.icone-secundario'`) onde
  se espera um valor CSS de verdade — resolva sempre para `var(--icone-secundario)` ou o
  hex correspondente, nunca deixe o "caminho do token" como se fosse a cor em si.

## Ao gerar código

- Use exclusivamente os tokens listados em `tokensAllowed`. Para `Button`, use também
  `variantTokenMap` para traduzir `variant` (inglês, masculino) no sufixo do token
  (português, feminino) — não assuma que os nomes batem direto.
- Implemente **todos** os `states` listados no contrato, mesmo que o pedido original só
  tenha mencionado o estado padrão.
- Siga `a11y` à risca — os campos `notes` frequentemente carregam o requisito mais crítico
  (ex.: gatilhos de tooltip por foco+toque, não só hover, por causa do público 60+).
- Se `events.status` disser "não definido", não invente um nome de evento — sinalize que
  falta essa decisão em vez de preencher com um palpite.
- Respeite `forbidden` como proibição direta, mesmo quando já implícita em outro campo.

## Depois de gerar

Feche a resposta com uma autoauditoria curta: releia o código gerado contra o contrato e
liste qualquer divergência encontrada (token fora da whitelist, estado faltando, aria
ausente, variante inventada). Se não houver divergência, diga isso explicitamente.

## Quando o pedido exigir algo fora do contrato

Sinalize isso em vez de resolver silenciosamente — mesmo padrão já usado nos contratos
originais (ex.: Button trata prop fora do enum como erro a resolver, não a adivinhar).

## Estrutura de arquivos

```
/ds-alpha
  SKILL.md                         <- este arquivo, fica na raiz
  ROADMAP.md                       <- status do projeto: feito, próximo, dívidas técnicas
  ARCHITECTURE.md                  <- visão de alto nível: contrato-executável, tokens, AppShell, protótipos
  CHANGELOG.md                     <- gerado por `npm run changelog`, varre decisions[] de todo contrato
  README.md                        <- instalação/uso pra quem clona o repo (testadores externos)
  README-traducao.md

  contratos/                       <- todo contrato e o schema que os valida, 1 arquivo por componente
    component-contract.schema.json <- valida a forma de todo *.contract.json

  tokens/                          <- fonte da verdade dos tokens, json e css juntos
    tokens.json                    <- cópia do arquivo real exportado do Figma
    tokens.css                     <- tokens.json resolvido em CSS custom properties
    token-notation.md

  src/                             <- implementação (React + TS)
    main.tsx                       <- bootstrap; único import de tokens/tokens.css
    components/                    <- um componente por pasta, mapeado 1:1 a um contrato em contratos/
      shared/                      <- utilitários reaproveitados por >1 componente (ex.: normalizeForSearch.ts,
                                       phoneMask.ts, dateTimeMask.ts) — nunca um componente em si
    interface/                     <- DS Playground: telas que compõem/exercitam os componentes
      App.tsx                      <- shell do Playground (sidebar + área de conteúdo)
      stories/                     <- uma entrada por componente/página em registry.ts, com demo + código +
                                       metadados do contrato; GROUP_ORDER define os grupos do Sidebar
                                       (Átomos/Moléculas/Organismos/Templates/Páginas)
      screens/                     <- telas completas construídas sobre os componentes — Templates (telas
                                       de referência do harness, sem contrato próprio) e Páginas (protótipos
                                       de produto reais, também sem contrato — ver ARCHITECTURE.md)
        shared/AppShell.tsx        <- casca de página compartilhada (SideNav + header) usada por
                                       BackofficeTemplate/CrudTemplate — não um componente do design
                                       system, é infraestrutura de página
```

A lista completa e atual de componentes é sempre `contratos/*.contract.json` (menos o schema) —
1:1 com as pastas em `src/components/`. Não mantenha uma segunda lista manual aqui: ela desatualiza
a cada componente novo e vira mais uma fonte da verdade pra divergir. Pra saber o que existe agora,
rode:

```bash
ls contratos/*.contract.json
```

Sempre que um contrato for criado ou atualizado, a implementação correspondente e a
entrada dela no DS Playground (`src/interface/stories/registry.ts`) devem ser
criadas/atualizadas juntas — não fica pendente pra depois.

Ao criar um novo componente: contrato novo em `contratos/`, implementação nova em
`src/components/<Nome>/`. Se ele precisar de token que ainda não existe em
`tokens/tokens.css`, adicione a variável lá (resolvida a partir de `tokens/tokens.json`)
antes de referenciá-la no CSS do componente.

## Grafo de dependência (ordem pra gerar/revisar em lote)

```
Icon ──┐
       ├──> FieldLabel ──┐
Tooltip┘                 │
                          ├──> TextField
                          ├──> Textarea
                          ├──> Select
                          ├──> ComboBox
HelperText ───────────────┘
Icon ────┐
Spinner ─┴────────────────> Button

Icon ────┐
HelperText┴───────────────> Checkbox

Radio ─────────────────────> RadioGroup (+ HelperText)
Switch     (sem dependências — átomo isolado, liga/desliga instantâneo)
Divider    (sem dependências — átomo isolado, horizontal/vertical)
Badge      (sem dependências — átomo isolado, label ou count)
Icon ──────────────────────> Avatar
Icon ──────────────────────> Toast (via ToastProvider)
Icon ──────────────────────> Chip

Icon ──────────────────────> Alert
Icon ──────────────────────> Link
Link + Icon ────────────────> Breadcrumb

Tabs         (sem dependências — átomo isolado; TabPanel é componente irmão, ligado via value)
ProgressBar  (sem dependências — átomo isolado)
Skeleton     (sem dependências — átomo isolado)
Icon + Button ──────────────> EmptyState
Icon ──────────────────────> Modal
Icon ──────────────────────> Drawer
```

Gere ou audite nessa ordem (átomos primeiro) quando trabalhar em lote — um erro num átomo
se propaga para tudo que depende dele.

## Roadmap

Status do projeto (o que foi feito, o que vem a seguir, dívidas técnicas) vive em
`ROADMAP.md`, separado deste arquivo — aqui só ficam as regras de geração, que mudam
pouco; o roadmap muda a cada componente que termina. Consultar `ROADMAP.md` antes de
assumir qualquer coisa sobre prioridade ou status.
