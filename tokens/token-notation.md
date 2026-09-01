# Notação de tokens usada nos contratos

O `tokens.json` real (enviado por você) já tem 5 coleções, e os contratos abaixo referenciam
tokens dela usando o formato `<colecao>.<caminho-do-token>`:

| Prefixo usado no contrato | Coleção real no tokens.json | Modo |
|---|---|---|
| `primitive.*`   | Cores Primitivas     | Mode 1 |
| `semantic.*`    | Cores Semânticas     | Claro / Escuro |
| `structural.*`  | Estrutural           | Mode 1 |
| `type-primitive.*` | Tipografia Primitiva | Base |
| `type-style.*`  | Tipografia Estilo    | Base |

Exemplos reais confirmados no seu arquivo:

- `semantic.acao-primaria` → resolve para `Verde Medsenior/verde-medsenior-700` (Claro) — grupo "Ações/Primárias/acao-primaria".
- `structural.raio-pp` → `8` — grupo "Raios de Borda/raio-pp".
- `structural.icone-medio` → `20` — grupo "Ícones/icone-medio".
- `structural.foco-espessura` → `3` — grupo "Foco/foco-espessura".
- `type-style.texto-rotulo-botao` → tamanho 16 / peso médio / entrelinha 150.

**Regra que os contratos seguem:** nenhum componente referencia `primitive.*` ou
`type-primitive.*` diretamente — só `semantic.*`, `structural.*` e `type-style.*`. Isso já
é verdade na sua estrutura atual; os contratos só precisam parar de vazar essa regra (o que
acontecia quando a descrição em prosa citava "cinza-900" em vez de "texto-primario", por
exemplo — não encontrei esse vazamento nos seus `.md`, então o problema real não está na
camada de token).

**Decisão de nomenclatura:** os nomes dos tokens em si (`acao-primaria`, `texto-primario`,
`raio-pp`...) continuam em português, porque são o nome real das variáveis no seu arquivo
Figma — traduzir aqui criaria uma segunda fonte da verdade dessincronizada do arquivo real.
Nomes de **componente** e de **prop**, que você pediu para virar inglês, são uma camada
diferente (a API do código) e não têm esse vínculo direto com o Figma.

## Convenção de CSS custom property (fixada após teste de determinismo)

Ao gerar CSS/Tailwind a partir de um token, a variável CSS usa o nome do token **sem**
prefixo de camada — `semantic.borda-erro` vira `--borda-erro`, nunca `--semantic-borda-erro`.
Essa é a convenção que o `tokens.css` de referência já usa; qualquer geração precisa bater
com ela, porque componentes e arquivo de tokens são gerados em momentos diferentes e
precisam casar pelo nome exato da variável.

Exemplo: `semantic.acao-primaria` → `var(--acao-primaria)`; `structural.raio-pp` →
`var(--raio-pp)`; `type-style.texto-m` → `var(--texto-m-size)` / `var(--texto-m-weight)` /
`var(--texto-m-line-height)` (tipografia se decompõe em 3+ variáveis, uma por propriedade CSS).
