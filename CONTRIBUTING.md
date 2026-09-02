# Contribuindo com o LVXFR

Este repositório é privado e compartilhado com um grupo pequeno de testadores. O fluxo
abaixo existe pra que qualquer ajuste feito no seu fork seja fácil de revisar e,
eventualmente, incorporar de volta no projeto base — sem perder o histórico de por que
cada mudança foi feita.

## Fluxo básico

1. **Fork** este repositório na sua conta do GitHub.
2. Clone o seu fork e crie uma branch pra o que for mexer (`git checkout -b
   ajuste/nome-curto`).
3. Faça as mudanças. Se você usa Claude Code ou Codex pra gerar/revisar UI aqui, comece
   sempre pelo `SKILL.md` — ele existe exatamente pra isso.
4. Rode `npm run build` antes de abrir o PR — não há suíte de testes/lint configurada
   ainda, então o `tsc -b && vite build` é a única rede de segurança automática que
   existe hoje.
5. Abra um **Pull Request contra o repositório original** (não contra o seu fork) — mesmo
   sabendo que ele não vai ser mergeado automaticamente. É assim que a análise funciona:
   o PR te dá um diff revisável, e o bot de CI (ver abaixo) comenta um resumo do que
   mudou em nível de contrato/token.

Ninguém precisa de permissão de escrita no repositório original pra abrir um PR de fork —
é o modelo padrão do GitHub.

## Seus commits de protótipo são automáticos (e públicos pra quem tem acesso ao repo)

Se a pasta do seu protótipo estiver registrada em `src/interface/prototable/
registry.ts`, rodar `npm run dev` normalmente já dispara commit + push automáticos
(`scripts/proto-autosync.mjs`, ~20s depois da última mudança de arquivo) — não é
preciso lembrar de dar push manualmente pro seu trabalho aparecer no ProtoTable de
quem administra o repositório. Ver `README.md` pra detalhes e como desligar
(`PROTO_AUTOSYNC=0 npm run dev`) se preferir controlar os commits você mesmo.

Registrar um novo protótipo no ProtoTable é um passo A MAIS além de registrá-lo no
Playground (`stories/registry.ts`) — adicione a entrada em `prototable/registry.ts`
também, com `screenPath` apontando pra pasta real da tela.

## Regra obrigatória: documentar mudanças de contrato/token no próprio contrato

Se a sua mudança tocar em `contratos/*.contract.json` (uma prop nova, um token
adicionado/removido de `tokensAllowed`, uma decisão visual revertida) **adicione uma
entrada nova no array `decisions`** daquele contrato, explicando o quê e o porquê — não
só o "o quê". Essa não é uma formalidade: é a fonte real de onde o changelog do projeto é
gerado (`npm run changelog` → `CHANGELOG.md`, varre exatamente esse campo). Uma mudança
de contrato sem entrada em `decisions` fica invisível pro processo de revisão.

Convenção de prefixo já usada no projeto (mantenha, ajuda a escanear rápido):

- `AJUSTADO a pedido do usuário — ...` — mudança de comportamento pedida explicitamente.
- `REVISADO — ...` — uma decisão anterior foi reaberta e mudou.
- `BUG REAL corrigido — ...` — o código não fazia o que o contrato já prometia.
- `EXTENSÃO — ...` — prop/capacidade nova, sob demanda de um consumidor real (nunca
  especulativa — ver `SKILL.md`).

Se a mudança for só de UI/comportamento sem alterar o contrato, não é obrigatório, mas
uma frase de contexto no corpo do PR ajuda igual.

## O que o CI faz automaticamente

Todo PR contra este repositório roda `npm ci && npm run build` (falha se o TypeScript não
compilar ou o build quebrar) e posta um comentário automático resumindo **quais
contratos mudaram** e **quais entradas novas de `decisions` foram adicionadas** nesse PR
— pra quem for revisar não precisar abrir os 67 arquivos de contrato manualmente. Ver
`.github/workflows/ci.yml`.

O que o CI **não** faz: decidir se uma mudança é boa ou deve ser incorporada. Isso
continua sendo revisão humana, de propósito — é uma escolha de curadoria de design
system, não algo que dá pra automatizar com segurança.

## Checklist antes de abrir o PR

- [ ] `npm run build` passa sem erro.
- [ ] Toda mudança em `contratos/*.json` tem uma entrada nova em `decisions`.
- [ ] Se um componente ganhou uma variante/estado novo, o Playground (`src/interface/
      stories/`) mostra um exemplo dele — um contrato sem exemplo visível é meio-feito
      aqui (ver `ARCHITECTURE.md`, seção "Auditoria de consistência").
- [ ] Screenshot antes/depois no corpo do PR, se a mudança for visual.
