import type { StoryMeta } from "./types";

/**
 * Registro das telas do Playground — descoberto por glob.
 *
 * Cada tela é UM arquivo em `stories/entries/<id>.ts` (export default de um StoryMeta).
 * Adicionar um componente = criar um arquivo novo, sem editar este: duas pessoas
 * cadastrando telas ao mesmo tempo nunca colidem num arquivo compartilhado.
 *
 * Ordem no menu: pelo campo `order` de cada entrada (menor primeiro). Entrada nova sem
 * `order` vai pro fim da lista, em ordem alfabética de id — dentro do seu grupo, já que
 * o menu agrupa por `group`. Passos: ver CONTRIBUTING.md, "Criando um componente".
 * Arquivos que começam com "_" em entries/ são auxiliares, não telas.
 */
const modules = import.meta.glob<{ default: StoryMeta }>(["./entries/*.ts", "!./entries/_*.ts"], { eager: true });

const NO_ORDER = Number.MAX_SAFE_INTEGER;

export const STORIES: StoryMeta[] = Object.values(modules)
  .map((module) => module.default)
  .sort((a, b) => (a.order ?? NO_ORDER) - (b.order ?? NO_ORDER) || a.id.localeCompare(b.id));

export const GROUP_ORDER = ["Tokens", "Átomos", "Moléculas", "Organismos", "Templates", "Páginas"] as const;
