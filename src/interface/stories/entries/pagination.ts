import type { StoryMeta } from "../types";
import { PaginationDemo } from "../molecules/PaginationDemo";

const story: StoryMeta = {
  id: "pagination",
  order: 310,
  title: "Pagination",
  group: "Moléculas",
  status: "draft",
  category: "action",
  contractFile: "contratos/pagination.contract.json",
  dependencies: ["Button", "Icon"],
  tokensSummary: ["semantic.texto-secundario/primario", "semantic.borda-base", "structural.raio-pp"],
  description: "Navegação entre páginas de uma lista/coleção qualquer (fora de uma Datatable, que já tem paginação própria embutida) — resumo, seletor opcional de itens por página, anterior/próxima.",
  code: `<Pagination page={page} onPageChange={setPage} totalItems={237} pageSize={10} onPageSizeChange={setPageSize} />`,
  Demo: PaginationDemo,
};

export default story;
