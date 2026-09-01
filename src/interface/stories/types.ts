import type { ComponentType } from "react";

export type StoryGroup = "Átomos" | "Moléculas" | "Organismos" | "Templates" | "Páginas";

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
  code: string;
  Demo: ComponentType;
}
