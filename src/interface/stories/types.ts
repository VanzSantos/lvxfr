import type { ComponentType } from "react";

export type StoryGroup = "Tokens" | "Átomos" | "Moléculas" | "Organismos" | "Templates" | "Páginas";

export interface StoryMeta {
  id: string;
  title: string;
  group: StoryGroup;
  status: "draft" | "stable" | "deprecated";
  category?: string;
  contractFile?: string;
  dependencies?: string[];
  tokensSummary?: string[];
  description?: string;
  /** Só nas telas do grupo Tokens: qual página de tokens renderizar (no lugar do Demo/contrato). */
  tokenPage?: "cores" | "tipografia" | "espacamento" | "sombras";
  code: string;
  Demo: ComponentType;
}
