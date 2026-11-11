import type { StoryMeta } from "../types";
import { LoginScreenDemo } from "../pages/LoginScreenDemo";

const story: StoryMeta = {
  id: "login-screen",
  order: 720,
  title: "LoginScreen",
  group: "Páginas",
  status: "draft",
  category: "page",
  contractFile: "sem contrato — página, não componente",
  dependencies: ["TextField", "Button", "Alert", "Icon"],
  tokensSummary: ["semantic.acao-primaria/acao-secundaria (gradiente decorativo)", "semantic.fundo-superficie/fundo-campo", "structural.espaco-m/g/gg"],
  description: "Split-screen edge-to-edge (imagem à esquerda + formulário à direita), sem margem entre a página e a borda da tela — replicando o padrão real dos produtos do usuário. No celular (viewport <768px) a imagem some e o formulário ocupa 100% da tela. CPF com máscara automática (TextField type='cpf'). Submit sempre mostra o Alert de erro (sem autenticação real).",
  code: `import { LoginScreen } from "./interface/screens/LoginScreen/LoginScreen";

<LoginScreen />`,
  Demo: LoginScreenDemo,
};

export default story;
