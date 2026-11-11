import type { StoryMeta } from "../types";
import { FilterBarDemo } from "../molecules/FilterBarDemo";

const story: StoryMeta = {
  id: "filter-bar",
  order: 440,
  title: "FilterBar",
  group: "Moléculas",
  status: "draft",
  category: "action",
  contractFile: "contratos/filter-bar.contract.json",
  dependencies: ["TextField", "Chip"],
  tokensSummary: ["semantic.acao-link-texto ('Limpar tudo')", "semantic.borda-base", "structural.espaco-p/m"],
  description: "Busca opcional + slot livre de filtros (Select, DatePicker, SegmentedControl, etc.) + resumo dos filtros ativos via Chip removível. Só apresentação — não filtra dados sozinha.",
  code: `<FilterBar
  searchValue={busca} onSearchChange={setBusca}
  activeFilters={[{ key: "status", label: "Status: Ativo" }]}
  onRemoveFilter={removeFilter} onClearAll={limparTudo}
  filters={<Select options={opcoes} value={status} onChange={setStatus} />}
/>`,
  Demo: FilterBarDemo,
};

export default story;
