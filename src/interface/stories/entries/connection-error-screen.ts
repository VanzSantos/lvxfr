import type { StoryMeta } from "../types";
import { ConnectionErrorScreenDemo } from "../pages/ConnectionErrorScreenDemo";

const story: StoryMeta = {
  id: "connection-error-screen",
  order: 800,
  title: "ConnectionErrorScreen",
  group: "Páginas",
  status: "draft",
  category: "page",
  contractFile: "sem contrato — página, não componente",
  dependencies: ["Icon", "Button"],
  tokensSummary: ["semantic.acao-primaria/acao-secundaria (gradiente decorativo)", "semantic.icone-erro", "structural.espaco-m/g/gg"],
  description: "Mesma estrutura de split-screen do LoginScreen — mensagem de erro de conexão (rede/servidor fora do ar) com botão 'Tentar novamente', que simula uma nova tentativa (~900ms de loading) antes de chamar onRetry. Diferente do ErrorScreen (404/500 — página não encontrada/erro de servidor, layout centralizado simples): esta é para falha transitória de conexão, no mesmo modelo visual das páginas de auth.",
  code: `import { ConnectionErrorScreen } from "./interface/screens/ConnectionErrorScreen/ConnectionErrorScreen";

<ConnectionErrorScreen onRetry={() => refazerRequisicao()} />`,
  Demo: ConnectionErrorScreenDemo,
};

export default story;
