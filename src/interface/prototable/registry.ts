/** Registro de PROTÓTIPOS, separado de propósito do registro do DS Playground
    (src/interface/stories/registry.ts). O Playground é a vitrine dos
    componentes; ProtoTable é o índice de telas/produtos reais construídos em
    cima deles — as duas coisas não devem se misturar (pedido explícito do
    usuário), mesmo que hoje algumas entradas apontem pras mesmas pastas em
    src/interface/screens/.

    Hierarquia (pedido explícito do usuário, "concordo com todas as
    recomendações" na conversa que decidiu isso): Projeto (sistema fechado) >
    Módulo (área/grupo de funcionalidade) > Fluxo (jornada dentro do módulo —
    só ganha sentido próprio quando o módulo tem mais de um) > Tela (unidade
    atômica, uma pasta real em src/interface/screens/). 4 arrays FLAT com
    referência ao pai (projectKey/moduleKey/flowKey) — mais fácil de editar à
    mão e de agregar em scripts/prototable-manifest.mjs do que aninhado.

    Registrar um protótipo aqui é um passo A MAIS, separado de registrá-lo em
    stories/registry.ts (que só controla se ele aparece navegável dentro do
    Playground) — ver README.md/CONTRIBUTING.md "Criando protótipos". Um
    nível com exatamente 1 filho (ex.: um Módulo com um Fluxo só) não precisa
    virar uma tabela de "1 item" na UI — ProtoTablePage pula direto pro
    filho; não existe "nível de menos" aqui, a UI que decide o que mostrar. */

import type { ComponentType } from "react";
import { AutorizacaoOCRScreen } from "../screens/AutorizacaoOCRScreen/AutorizacaoOCRScreen";

export interface ProjectEntry {
  key: string;
  title: string;
  description?: string;
}

export interface ModuleEntry {
  key: string;
  projectKey: string;
  title: string;
  description?: string;
}

export interface FlowEntry {
  key: string;
  moduleKey: string;
  title: string;
  description?: string;
}

export interface ScreenEntry {
  key: string;
  flowKey: string;
  title: string;
  /** Caminho relativo à raiz do repo, usado pelo scripts/prototable-manifest.mjs
      pra rodar `git log` — precisa ser a pasta real em src/interface/screens/. */
  screenPath: string;
  /** id usado pra montar o link "Abrir" via ?standalone=<id>. Pra telas que
      TAMBÉM existem no Playground (stories/registry.ts) — telas de
      referência do harness, ver ARCHITECTURE.md — use o id do STORY de lá.
      Pra protótipos de produto reais (US de negócio, sem contrato, que NÃO
      devem aparecer no Playground — pedido explícito do usuário), use
      qualquer id único aqui e informe `Demo` abaixo; App.tsx resolve o
      standalone por Demo quando o id não é encontrado em STORIES. */
  standaloneStoryId: string;
  /** Só necessário quando a tela NÃO está registrada em stories/registry.ts
      (protótipo ProtoTable-only). Componente sem props obrigatórias — a
      própria tela de src/interface/screens/<Nome> serve direto aqui, já que
      seu `embedded` é opcional e o padrão (false) já ocupa a viewport
      inteira, do jeito que o standalone precisa. */
  Demo?: ComponentType;
  description?: string;
}

export const PROJECTS: ProjectEntry[] = [
  {
    key: "lvxfr-referencia",
    title: "LVXFR — telas de referência",
    description: "Telas de exemplo que já vêm com o harness, semente inicial do ProtoTable.",
  },
  {
    key: "portal-cliente-web",
    title: "Portal do Cliente (Web)",
    description: "Protótipos de produto reais construídos sobre o harness — sem contrato próprio, não aparecem no DS Playground (ver ARCHITECTURE.md).",
  },
];

export const MODULES: ModuleEntry[] = [
  {
    key: "referencia",
    projectKey: "lvxfr-referencia",
    title: "Referência",
  },
  {
    key: "autorizacoes",
    projectKey: "portal-cliente-web",
    title: "Autorizações",
  },
];

export const FLOWS: FlowEntry[] = [
  { key: "backoffice-template", moduleKey: "referencia", title: "BackofficeTemplate" },
  { key: "crud-template", moduleKey: "referencia", title: "CrudTemplate" },
  { key: "login-screen", moduleKey: "referencia", title: "LoginScreen" },
  { key: "onboarding-screen", moduleKey: "referencia", title: "OnboardingScreen" },
  {
    key: "extracao-ocr-autorizacao",
    moduleKey: "autorizacoes",
    title: "Extração OCR e Validação de Dados na Solicitação de Autorização",
  },
];

export const SCREENS: ScreenEntry[] = [
  {
    key: "backoffice-template",
    flowKey: "backoffice-template",
    title: "BackofficeTemplate",
    screenPath: "src/interface/screens/BackofficeTemplate",
    standaloneStoryId: "backoffice-template",
    description: "Página de backoffice de referência — AppShell + card central vazio.",
  },
  {
    key: "crud-template",
    flowKey: "crud-template",
    title: "CrudTemplate",
    screenPath: "src/interface/screens/CrudTemplate",
    standaloneStoryId: "crud-template",
    description: "Tela de CRUD padrão — AppShell + Datatable completo + modal de criação.",
  },
  {
    key: "login-screen",
    flowKey: "login-screen",
    title: "LoginScreen",
    screenPath: "src/interface/screens/LoginScreen",
    standaloneStoryId: "login-screen",
  },
  {
    key: "onboarding-screen",
    flowKey: "onboarding-screen",
    title: "OnboardingScreen",
    screenPath: "src/interface/screens/OnboardingScreen",
    standaloneStoryId: "onboarding-screen",
  },
  {
    key: "autorizacao-ocr-screen",
    flowKey: "extracao-ocr-autorizacao",
    title: "AutorizacaoOCRScreen",
    screenPath: "src/interface/screens/AutorizacaoOCRScreen",
    standaloneStoryId: "autorizacao-ocr-screen",
    Demo: AutorizacaoOCRScreen,
    description: "Protótipo da US 'Extração OCR e Validação de Dados na Solicitação de Autorização pelo App' — upload de pedidos médicos, conferência dos dados extraídos por OCR (simulado) agrupada por médico, e bypass direto pro protocolo quando há mais de 5 procedimentos.",
  },
];
