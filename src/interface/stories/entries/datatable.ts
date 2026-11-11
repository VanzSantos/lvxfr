import type { StoryMeta } from "../types";
import { DatatableDemo } from "../organisms/DatatableDemo";

const story: StoryMeta = {
  id: "datatable",
  order: 640,
  title: "Datatable",
  group: "Organismos",
  status: "draft",
  category: "display",
  contractFile: "contratos/datatable.contract.json",
  dependencies: ["Icon", "Skeleton", "Button", "Checkbox", "Modal", "Select"],
  tokensSummary: ["semantic.fundo-superficie/secundario", "semantic.acao-primaria-transparente (linha selecionada)", "semantic.borda-base", "structural.espaco-p/pp (density)", "type-style.texto-p/texto-micro-forte"],
  description: "Um componente só, recursos opt-in por prop/coluna: ordenação (só pelo caret), filtro oculto por coluna (abre pelo nome ou ícone de funil, com chips de filtros ativos), seleção (átomo Checkbox), paginação, edição de linha inline (com Modal de confirmação), habilitar/desabilitar registro (ícone de olho + Modal de confirmação), colunas ocultas com Alert de aviso, loading e vazio.",
  code: `<Datatable
  columns={[
    { key: "cliente", header: "Cliente", sortable: true, filterable: true, editable: true, editControl: { type: "text" } },
    { key: "valor", header: "Valor", align: "right", render: (v) => \`R$ \${v}\` },
    { key: "acoes", header: "Ações", render: (_v, row, helpers) =>
        helpers.isEditing
          ? <><Button variant="link" iconOnly accessibleLabel="Salvar" leftIcon="check" onPress={helpers.requestSave} />
              <Button variant="link" iconOnly accessibleLabel="Cancelar" leftIcon="x" onPress={helpers.cancelEdit} /></>
          : <Button variant="link" iconOnly accessibleLabel="Editar" leftIcon="pencil-simple" onPress={helpers.startEdit} />
    },
  ]}
  data={pedidos}
  rowKey="id"
  accessibleLabel="Lista de pedidos"
  sortColumnKey={sortColumnKey}
  sortDirection={sortDirection}
  onSortChange={(key, dir) => { setSortColumnKey(key); setSortDirection(dir); }}
  filterValues={filterValues}
  onFilterChange={(key, value) => setFilterValues(...)}
  selectable
  selectedRowKeys={selectedRowKeys}
  onSelectionChange={setSelectedRowKeys}
  paginationEnabled
  page={page}
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>`,
  Demo: DatatableDemo,
};

export default story;
