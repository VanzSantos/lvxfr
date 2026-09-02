/** Registro de PROTÓTIPOS, separado de propósito do registro do DS Playground
    (src/interface/stories/registry.ts). O Playground é a vitrine dos
    componentes; ProtoTable é o índice de telas/produtos reais construídos em
    cima deles — as duas coisas não devem se misturar (pedido explícito do
    usuário), mesmo que hoje algumas entradas apontem pras mesmas pastas em
    src/interface/screens/.

    Registrar um protótipo aqui é um passo A MAIS, separado de registrá-lo em
    stories/registry.ts (que só controla se ele aparece navegável dentro do
    Playground) — ver README.md/CONTRIBUTING.md "Criando protótipos". */

export interface PrototypeEntry {
  key: string;
  title: string;
  /** Caminho relativo à raiz do repo, usado pelo scripts/prototable-manifest.mjs
      pra rodar `git log` — precisa ser a pasta real em src/interface/screens/. */
  screenPath: string;
  /** id correspondente em stories/registry.ts (STORIES), usado só pra montar o
      link "Abrir" via ?standalone=<id> — ProtoTable não duplica o Demo/rota. */
  standaloneStoryId: string;
  description?: string;
}

export const PROTOTYPES: PrototypeEntry[] = [
  {
    key: "backoffice-template",
    title: "BackofficeTemplate",
    screenPath: "src/interface/screens/BackofficeTemplate",
    standaloneStoryId: "backoffice-template",
    description: "Página de backoffice de referência — AppShell + card central vazio.",
  },
  {
    key: "crud-template",
    title: "CrudTemplate",
    screenPath: "src/interface/screens/CrudTemplate",
    standaloneStoryId: "crud-template",
    description: "Tela de CRUD padrão — AppShell + Datatable completo + modal de criação.",
  },
  {
    key: "login-screen",
    title: "LoginScreen",
    screenPath: "src/interface/screens/LoginScreen",
    standaloneStoryId: "login-screen",
  },
  {
    key: "onboarding-screen",
    title: "OnboardingScreen",
    screenPath: "src/interface/screens/OnboardingScreen",
    standaloneStoryId: "onboarding-screen",
  },
];
