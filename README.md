# LVXFR

Design system baseado em **contratos executáveis**, otimizado para criação de protótipos
interativos com IA (Claude Code, Codex e ferramentas equivalentes) — evolução direta do
AuroraDS.

Cada componente tem um contrato (`contratos/<nome>.contract.json`) documentando props,
anatomia, tokens permitidos, requisitos de acessibilidade e o histórico de decisões
tomadas sobre ele. Uma IA gerando ou revisando UI aqui consulta esse contrato em vez de
improvisar — é o que mantém gerações sucessivas consistentes entre sessões e ferramentas
diferentes. Detalhes completos de como as peças se encaixam em `ARCHITECTURE.md`; regras
de geração para IA em `SKILL.md`; histórico de decisões consolidado em `CHANGELOG.md`.

Você está recebendo acesso a este repositório pra testar o LVXFR, fazer protótipos
navegáveis e (se quiser) mandar de volta ajustes/correções — ver "Contribuindo" abaixo.

## Pré-requisitos

- Node.js 20 ou superior
- npm (vem com o Node)

## Instalação

```bash
git clone <url-do-seu-fork>
cd lvxfr
npm install
npm run dev
```

Abre em `http://localhost:5173` — é o **DS Playground**: navegue pela lateral pra ver
cada componente com todas as variantes/estados, o código de exemplo e os detalhes do
contrato correspondente.

## Criando protótipos

Você vai usar este projeto pra montar protótipos navegáveis interativos. Duas formas de
fazer isso, escolha a que fizer mais sentido pro seu caso:

### Opção recomendada: vários protótipos no mesmo projeto clonado

Cada protótipo novo é uma pasta em `src/interface/screens/<NomeDoProtótipo>/`, registrada
em `src/interface/stories/registry.ts` (grupo `"Páginas"`). Toda tela registrada abre
isolada, sem o chrome do Playground ao redor, através do link **"Abrir em nova página"**
que aparece em cada story (rota `/?standalone=<key>`) — então dá pra ter vários
protótipos diferentes convivendo no mesmo clone, cada um navegável isoladamente, sem
precisar reinstalar nada.

Por que essa é a opção recomendada: o valor real do LVXFR está na base compartilhada —
contratos, tokens e componentes. Se cada protótipo virasse um clone/instalação separada,
ou essa base seria duplicada a cada protótipo novo (ela diverge com o tempo, quebrando
exatamente o problema que os contratos existem pra resolver), ou você precisaria de
symlink/submodule pra compartilhar — mais frágil e mais difícil de manter pra quem não
mexe com isso no dia a dia. Um clone só, vários protótipos dentro, mantém tudo numa fonte
única.

Se quiser reaproveitar a casca já pronta de SideNav + header (usada em `BackofficeTemplate`
e `CrudTemplate`), veja `src/interface/screens/shared/AppShell.tsx` — e a regra de manter
o conteúdo real da página sempre dentro de um card central, documentada ali mesmo.

### Alternativa: um clone por protótipo

Só faz sentido se você precisar **entregar ou versionar um protótipo específico de forma
totalmente isolada** dos demais (ex.: mandar pra um cliente um link/repo separado, sem
expor o resto do que você está testando). Nesse caso, clone o repositório de novo numa
pasta própria pra cada protótipo. A desvantagem: qualquer ajuste que você fizer na base
compartilhada (um componente, um token) num desses clones não se propaga automaticamente
pros outros — você precisaria reaplicar manualmente ou reclonar.

Comece pela primeira opção; migre pra clones separados só quando um caso real pedir.

## Tudo que você mexer é commitado e enviado sozinho

Enquanto `npm run dev` está de pé, um processo em segundo plano
(`scripts/autosync.mjs`) observa `contratos/`, `tokens/` e `src/` inteiros — ou seja,
**qualquer** contrato de componente novo/ajustado, token novo/ajustado, componente
novo/ajustado, ou protótipo novo/ajustado — e, ~20 segundos depois da última mudança,
**commita e dá push automaticamente**, sem você precisar lembrar de rodar `git add`/
`git commit`/`git push`. É assim que quem administra o repositório principal consegue
ver o progresso de qualquer Product Designer sem depender de lembrete manual — a
curadoria de o que entra de fato no projeto principal acontece depois, na revisão do
seu PR (ver "Contribuindo" abaixo), não aqui.

Ele nunca usa `--force`; se o push falhar (histórico divergente), só avisa no
terminal, sem tentar resolver sozinho — nesse caso, dê um `git pull` manual. Pra
desligar essa automação numa sessão específica: `AUTOSYNC=0 npm run dev`.

## ProtoTable — quem criou/atualizou o quê

Além do DS Playground, o app tem uma segunda aba no topo chamada **ProtoTable** —
deliberadamente uma tela separada, não misturada com a vitrine de componentes: é um
índice dos protótipos reais (não dos componentes), mostrando quem criou cada um, quem
atualizou por último, quando, e o histórico completo de commits. Nada disso é digitado
à mão — vem direto do histórico git de cada pasta em `src/interface/screens/`
registrada em `src/interface/prototable/registry.ts` (a mesma automação acima é quem
garante que esse histórico existe de verdade no repositório remoto).

## Contribuindo

Se você ajustar um componente, um token, ou corrigir algo no contrato/tokens durante os
testes e quiser mandar isso de volta, veja **`CONTRIBUTING.md`** — resume o fluxo (fork →
branch → PR contra o repositório original) e a regra mais importante: toda mudança de
contrato precisa de uma entrada no array `decisions` daquele contrato, que é de onde o
changelog do projeto é gerado automaticamente.

## Scripts disponíveis

```bash
npm run dev         # servidor de desenvolvimento (Playground)
npm run build       # typecheck + build de produção
npm run preview     # serve o build de produção localmente
npm run changelog   # regenera CHANGELOG.md a partir das decisions[] de todos os contratos
```
