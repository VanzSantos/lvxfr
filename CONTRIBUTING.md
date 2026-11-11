# Contribuindo com o SeleneSDK

Este repositório é trabalhado por uma equipe ao mesmo tempo. O fluxo abaixo existe pra
que várias pessoas melhorem o projeto em paralelo sem pisar umas nas outras — e pra que
cada ajuste (contrato, token, componente ou protótipo) seja fácil de revisar e fique com
o registro de **por que** foi feito.

## Em uma linha

Cada pessoa trabalha **na própria branch** e abre um **Pull Request** pra `main`. Ninguém
dá push direto na `main`: ela só recebe mudança por PR, com o build passando e revisão.

## Primeiro acesso

1. Peça pra quem administra o repositório te adicionar como **colaborador(a)**.
2. Clone o repositório (o **mesmo** que todo mundo usa — sem fork):

   ```bash
   git clone https://github.com/VanzSantos/SeleneSDK.git
   cd SeleneSDK
   npm install
   ```

3. Configure quem você é no Git (é o que aparece no histórico e no ProtoTable):

   ```bash
   git config user.name "Seu Nome"
   git config user.email "seu-email@exemplo.com"
   ```

## O dia a dia

1. **Comece da `main` atualizada:**

   ```bash
   git switch main && git pull
   ```

2. **Crie uma branch pra o que vai fazer** (uma por tarefa — `tipo/descricao-curta`):

   ```bash
   git switch -c ajuste/botao-loading
   ```

   Tipos que usamos: `ajuste/` (mudança em algo existente), `novo/` (componente, token ou
   protótipo novo), `fix/` (correção).

3. **Trabalhe.** Se você usa Claude Code ou Codex pra gerar/revisar UI aqui, comece sempre
   pelo `SKILL.md` — ele existe exatamente pra isso. Veja o resultado com `npm run dev`.
4. **Rode `npm run build` antes de abrir o PR.** Não há suíte de testes/lint ainda — o
   `tsc -b && vite build` é a rede de segurança.
5. **Abra o Pull Request** contra a `main` (pelo GitHub, ou `gh pr create`). O CI roda o
   build e comenta um resumo dos contratos e `decisions` alterados.
6. **Peça revisão** (o `CODEOWNERS` já sugere quem). Depois de aprovado e com o CI verde,
   faça o merge. Recomendamos **Squash and merge**: junta os commits automáticos do
   autosync num só, com uma mensagem que você escreve.
7. A branch é apagada no merge. Volte pra `main`, dê `git pull` e comece a próxima.

### Manter sua branch em dia

Se a `main` andou enquanto você trabalhava, traga as novidades **pra sua branch** (merge,
não rebase — o autosync já enviou seus commits):

```bash
git fetch origin
git merge origin/main
```

Se houver conflito, o Git lista os arquivos. Resolva abrindo cada um, procurando `<<<<<<<`
e **mantendo as duas mudanças** quando as duas fazem sentido (é o caso típico de duas
pessoas adicionando uma entrada no mesmo arquivo). Depois `git add <arquivo>` e
`git commit`. Pra desistir e voltar ao que estava: `git merge --abort`. Se ficar em dúvida
num conflito de contrato ou de token, pergunte antes de escolher um lado.

## Seu trabalho é salvo sozinho (autosync)

Rodar `npm run dev` liga o `scripts/autosync.mjs`: ~20 s depois da última alteração em
`contratos/`, `tokens/` ou `src/`, ele **commita e dá push** na sua branch. Assim o
trabalho fica registrado mesmo incompleto, sem você lembrar de `git add`/`commit`/`push`.

Regras que protegem o trabalho em equipe:

- **Ele nunca escreve na `main`.** Se você estiver nela ao subir o `npm run dev`, ele troca
  sozinho pra uma branch pessoal `wip/<seu-nome>` (escolha outro nome com
  `AUTOSYNC_BRANCH=wip/outro npm run dev`). Se você trocar pra `main` com ele rodando, ele
  só avisa e pausa.
- Em qualquer outra branch (`ajuste/...`, `novo/...`) ele commita ali mesmo.
- Nunca usa `--force`. Se o push falhar (histórico divergente), só avisa — resolva com
  `git pull` e siga.
- Pra só olhar o projeto, sem commits: `npm run dev:vite-only` (ou `AUTOSYNC=0 npm run dev`).

Os commits do autosync têm mensagens genéricas (`auto: sync (...)`). Por isso o merge do PR
em **Squash** — a mensagem final é a que importa.

## Arquivos que ninguém commita

Eles são gerados e mudariam em quase todo PR, gerando conflito à toa:

- `src/interface/prototable/manifest.json` — gerado sozinho em `npm install`, `npm run dev`
  e `npm run build` (também `npm run manifest`). Está no `.gitignore`.
- `CHANGELOG.md` — **não regenere dentro de um PR.** Quem administra roda
  `npm run changelog` numa mudança à parte, de tempos em tempos.

## Regra obrigatória: documentar mudanças de contrato/token no próprio contrato

Se a sua mudança tocar em `contratos/*.contract.json` (uma prop nova, um token
adicionado/removido de `tokensAllowed`, uma decisão visual revertida) **adicione uma
entrada nova no array `decisions`** daquele contrato, explicando o quê e o porquê — não
só o "o quê". Não é formalidade: é de onde o changelog do projeto é gerado
(`npm run changelog`). Uma mudança de contrato sem entrada em `decisions` fica invisível
pro processo de revisão.

Convenção de prefixo já usada (mantenha, ajuda a escanear rápido):

- `AJUSTADO a pedido do usuário — ...` — mudança de comportamento pedida explicitamente.
- `REVISADO — ...` — uma decisão anterior foi reaberta e mudou.
- `BUG REAL corrigido — ...` — o código não fazia o que o contrato já prometia.
- `CORRIGIDO — ...` — correção de algo já previsto (ex.: achado de auditoria de a11y).
- `EXTENSÃO — ...` — prop/capacidade nova, sob demanda de um consumidor real (nunca
  especulativa — ver `SKILL.md`).

Se a mudança for só de UI/comportamento sem alterar o contrato, não é obrigatório, mas uma
frase de contexto no corpo do PR ajuda igual.

## Criando coisas novas

### Um componente

1. Contrato novo em `contratos/<nome>.contract.json` (copie a estrutura de um existente).
2. Implementação em `src/components/<Nome>/` (`.tsx` + `.module.css`).
3. Demo em `src/interface/stories/<atoms|molecules|organisms>/<Nome>Demo.tsx`.
4. **Uma entrada nova, em um arquivo novo:** `src/interface/stories/entries/<id>.ts`
   (copie um existente: `export default` de um `StoryMeta`). Não existe lista central pra
   editar — é por isso que duas pessoas cadastrando componentes ao mesmo tempo não colidem.
   O campo `order` (opcional) define a posição no menu; sem ele a tela entra no fim do seu
   grupo, em ordem alfabética.

### Um protótipo

1. Pasta nova em `src/interface/screens/<NomeDoProtótipo>/`.
2. Se ele deve aparecer no Playground: um arquivo em `src/interface/stories/entries/`
   (grupo `"Páginas"`).
3. Pra aparecer no **ProtoTable**: adicione as entradas em
   `src/interface/prototable/registry.ts` (`PROJECTS`, `MODULES`, `FLOWS`, `SCREENS`). Esse
   é o único arquivo compartilhado que sobrou — se der conflito, mantenha as entradas dos
   dois lados.

Uma variante ou estado novo de componente precisa de um exemplo visível no Playground — um
contrato sem exemplo visível é meio-feito aqui (ver `ARCHITECTURE.md`, "Auditoria de
consistência").

## O que o CI faz

Todo PR contra a `main` roda `npm ci && npm run build` (falha se o TypeScript não compilar
ou o build quebrar) e comenta **quais contratos mudaram** e **quais entradas novas de
`decisions`** entraram — pra quem revisa não abrir os 67 contratos. O build também roda na
`main` depois de cada merge. Ver `.github/workflows/ci.yml`.

O que o CI **não** faz: decidir se uma mudança é boa. Isso é revisão humana, de propósito —
é curadoria de design system, não algo que dá pra automatizar com segurança.

## Checklist antes de pedir revisão

- [ ] `npm run build` passa sem erro.
- [ ] Toda mudança em `contratos/*.json` tem uma entrada nova em `decisions`.
- [ ] Componente novo/variante nova tem exemplo no Playground.
- [ ] Screenshot antes/depois no corpo do PR, se a mudança for visual.
- [ ] Não commitei `manifest.json` nem regenerei o `CHANGELOG.md`.

## Para quem administra o repositório

Configuração única no GitHub (não vive no código, por isso fica registrada aqui):

1. **Colaboradores:** Settings → Collaborators → adicionar cada pessoa com permissão
   **Write**.
2. **Proteger a `main`:** Settings → Branches → Add branch ruleset (ou *branch protection
   rule*) pra `main`:
   - exigir **Pull Request** antes de mesclar;
   - exigir o status check **`build`** passando (e, se quiser, "branch atualizada");
   - exigir 1 aprovação — e **Require review from Code Owners** se quiser que a sua seja
     obrigatória (o `.github/CODEOWNERS` já aponta você);
   - **bloquear force push** e a exclusão da `main`.
3. **Merge:** Settings → General → Pull Requests: deixar só **Squash merging** habilitado e
   ligar **Automatically delete head branches**.
4. **Changelog:** de tempos em tempos, numa mudança à parte, `npm run changelog`.

## Quem é de fora da equipe

O repositório é público, então qualquer pessoa pode fazer **fork** e abrir um PR contra a
`main` — sem permissão de escrita. Nesse caso o fluxo é o mesmo, só que a branch vive no
fork (o autosync também funciona lá, na `wip/<nome>`). Quem for do time usa o fluxo acima,
sem fork.
