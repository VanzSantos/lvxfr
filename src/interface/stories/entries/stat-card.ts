import type { StoryMeta } from "../types";
import { StatCardDemo } from "../molecules/StatCardDemo";

const story: StoryMeta = {
  id: "stat-card",
  order: 360,
  title: "StatCard",
  group: "Moléculas",
  status: "draft",
  category: "display",
  contractFile: "contratos/stat-card.contract.json",
  dependencies: ["Card", "Icon"],
  tokensSummary: ["semantic.texto-sucesso/erro/secundario (tendência e ícone, sempre a mesma cor)", "semantic.texto-primario/secundario", "semantic.acao-primaria-transparente/acao-destrutiva-transparente/fundo-secundario (fundo do círculo)", "semantic.borda-erro (borda quando critical)", "structural.raio-circular", "type-style.texto-g-forte"],
  description: "Número grande + rótulo + indicador de tendência opcional, dentro de um Card reaproveitado. tone da tendência derivado da direção (up→verde, down→vermelho), sobrescrevível quando 'subir' é notícia ruim — sem seta/ícone de direção, só o sinal +/- do próprio texto. Rodapé com trendValue + helperText na mesma linha, separado do valor por uma linha divisória, com seta decorativa (sempre neutra) à direita. icon (opcional) renderiza dentro de um círculo colorido, com o próprio ícone SEMPRE na mesma cor do indicador de tendência (sem override). critical (opcional) deixa a borda do card vermelha, decisão explícita de quem consome.",
  code: `<StatCard icon="currency-circle-dollar" label="Receita mensal" value="R$ 42.300" trendDirection="up" trendValue="+12%" helperText="vs. mês anterior" critical={false} />`,
  Demo: StatCardDemo,
};

export default story;
