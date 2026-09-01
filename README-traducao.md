# Tabela de tradução PT → EN (nomes de componente e de prop)

Nomes de componente e de prop virando inglês, conforme pedido. Tokens continuam em
português (são as variáveis reais do Figma — ver `token-notation.md`). Descrições, notas
de decisão e tudo que é lido por humano permanece em português.

## Componentes

| Original (PT) | Novo (EN) |
|---|---|
| Icone | Icon |
| MensagemApoio | HelperText |
| RotuloCampo | FieldLabel |
| BalaoDica | Tooltip |
| Botao | Button |
| Entrada | TextField |

## Props (por componente)

**Icon**: nome→name, tamanho→size, cor→color, peso→weight, decorativo→decorative, rotuloAcessivel→accessibleLabel

**HelperText**: texto→text, intencao→intent, idCampo→fieldId

**FieldLabel**: texto→text, obrigatorio→required, comInfo→withInfo, textoInfo→infoText, idCampo→fieldId

**Tooltip**: texto→text, direcao→placement, autoAjuste→autoAdjust, idGatilho→triggerId

**Button**: tipo→variant, contorno→outlined, estado→state, rotulo→showLabel, rotuloTexto→label, iconeEsquerda→leftIcon (vira string, não boolean — ver decisão no contrato), iconeDireita→rightIcon, iconeApenas→iconOnly, larguraTotal→fullWidth, rotuloAcessivel→accessibleLabel, onPress→onPress (mantido, já é convenção cross-platform)

**TextField**: rotulo→label, obrigatorio→required, comInfo→withInfo, textoInfo→infoText, placeholder→placeholder, valor→value, estado→state, mensagem→helperText, iconeEsquerda→leftIcon, iconeDireita→rightIcon, onChange→onChange (mantido)

## Valores de enum traduzidos

- `tipo` do Button: primario→primary, secundario→secondary, neutro→neutral, sutil→subtle, destrutivo→destructive, link→link
- `estado` do Button: padrao→default, sobre→hover, pressionado→pressed, desabilitado→disabled, carregando→loading
- `estado` do TextField: padrao→default, foco→focus, erro→error, desabilitado→disabled, somente-leitura→readOnly
- `intencao` do HelperText: padrao→default, erro→error
- `direcao` do Tooltip: cima→top, baixo→bottom, esquerda→left, direita→right
- `tamanho` do Icon: pequeno→small, medio→medium, grande→large, extra-grande→extraLarge

## O que eu NÃO traduzi, e por quê

- **Nomes de token** (`acao-primaria`, `texto-primario`, `raio-pp`...): são as variáveis
  reais no `tokens.json` exportado do Figma. Traduzir aqui cria uma segunda fonte da
  verdade — o arquivo de tokens e os contratos ficariam descritos com nomes diferentes dos
  reais, reintroduzindo o mesmo tipo de divergência que estamos tentando eliminar. Se
  quiser esse nível de tradução também, o lugar certo é o próprio Figma (renomear as
  variáveis lá) — não recomendo fazer só no papel.
- **Categorias internas do schema** (`action`, `display`, `overlay`, `data-entry`): já
  estavam em inglês no meu schema original, mantive.

## Uma divergência real que encontrei ao migrar (vale seu aval)

No contrato original do `Botao`, a tabela de props (seção 4) lista `iconeEsquerda`/
`iconeDireita` como `boolean`, mas a decisão registrada na seção 11 (item 7) already
corrige isso para "vira o nome do ícone". Fui pela decisão registrada (é a versão mais
recente), então no contrato novo `leftIcon`/`rightIcon` são `string`, não `boolean`. Vale
você atualizar a tabela de props no `.md` original pra não ficar contradizendo a si mesma.
