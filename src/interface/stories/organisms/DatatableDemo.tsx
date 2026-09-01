import { useState } from "react";
import { Datatable, type DatatableColumn } from "../../../components/Datatable/Datatable";
import { Badge } from "../../../components/Badge/Badge";
import { Button } from "../../../components/Button/Button";
import { StackedText } from "../../../components/StackedText/StackedText";
import { QuantitySelector } from "../../../components/QuantitySelector/QuantitySelector";
import { ImageThumbnail } from "../../../components/ImageThumbnail/ImageThumbnail";
import { Modal } from "../../../components/Modal/Modal";
import styles from "../Demo.module.css";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#7d50cd"/><circle cx="100" cy="80" r="40" fill="#f4f0fa"/><rect x="40" y="130" width="120" height="50" rx="12" fill="#f4f0fa"/></svg>`
  );

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Pedido extends Record<string, unknown> {
  id: string;
  cliente: string;
  email: string;
  status: "pago" | "pendente" | "cancelado";
  valor: number;
}

const PEDIDOS_INICIAIS: Pedido[] = [
  { id: "1001", cliente: "Ana Souza", email: "ana@exemplo.com", status: "pago", valor: 240 },
  { id: "1002", cliente: "Bruno Lima", email: "bruno@exemplo.com", status: "pendente", valor: 89.9 },
  { id: "1003", cliente: "Camila Reis", email: "camila@exemplo.com", status: "cancelado", valor: 150 },
  { id: "1004", cliente: "Diego Alves", email: "diego@exemplo.com", status: "pago", valor: 320.5 },
  { id: "1005", cliente: "Érica Nunes", email: "erica@exemplo.com", status: "pago", valor: 75 },
  { id: "1006", cliente: "Felipe Costa", email: "felipe@exemplo.com", status: "pendente", valor: 410 },
  { id: "1007", cliente: "Gabriela Dias", email: "gabriela@exemplo.com", status: "pago", valor: 199 },
  { id: "1008", cliente: "Henrique Melo", email: "henrique@exemplo.com", status: "cancelado", valor: 60 },
  { id: "1009", cliente: "Isabela Pinto", email: "isabela@exemplo.com", status: "pago", valor: 512 },
  { id: "1010", cliente: "João Ramos", email: "joao@exemplo.com", status: "pendente", valor: 98 },
  { id: "1011", cliente: "Luíza Torres", email: "luiza@exemplo.com", status: "pago", valor: 275 },
  { id: "1012", cliente: "Marcos Vieira", email: "marcos@exemplo.com", status: "pago", valor: 143 },
];

const STATUS_LABEL: Record<Pedido["status"], string> = {
  pago: "Pago",
  pendente: "Pendente",
  cancelado: "Cancelado",
};

const STATUS_VARIANT: Record<Pedido["status"], "success" | "warning" | "error"> = {
  pago: "success",
  pendente: "warning",
  cancelado: "error",
};

const STATUS_OPTIONS = [
  { value: "pago", label: "Pago" },
  { value: "pendente", label: "Pendente" },
  { value: "cancelado", label: "Cancelado" },
];

function SimpleExample() {
  const columns: DatatableColumn<Pedido>[] = [
    { key: "id", header: "Pedido" },
    {
      key: "cliente",
      header: "Cliente",
      render: (_value, row) => <StackedText primaryText={row.cliente} secondaryText={row.email} />,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <Badge
          variant={STATUS_VARIANT[value as Pedido["status"]]}
          label={STATUS_LABEL[value as Pedido["status"]]}
        />
      ),
    },
    {
      key: "valor",
      header: "Valor",
      align: "right",
      render: (value) => formatBRL(value as number),
    },
  ];

  return (
    <Datatable
      columns={columns}
      data={PEDIDOS_INICIAIS.slice(0, 5)}
      rowKey="id"
      accessibleLabel="Lista simples de pedidos"
    />
  );
}

function CompleteExample() {
  const [pedidos, setPedidos] = useState<Pedido[]>(PEDIDOS_INICIAIS);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [sortColumnKey, setSortColumnKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterValues, setFilterValues] = useState<{ columnKey: string; value: string }[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [disabledRowKeys, setDisabledRowKeys] = useState<string[]>([]);
  const [bulkConfirm, setBulkConfirm] = useState<"delete" | "enable" | "disable" | null>(null);

  const columns: DatatableColumn<Pedido>[] = [
    { key: "id", header: "Pedido", sortable: true, filterable: true, hideable: false },
    {
      key: "cliente",
      header: "Cliente",
      sortable: true,
      filterable: true,
      editable: true,
      editControl: { type: "text" },
      render: (_value, row) => <StackedText primaryText={row.cliente} secondaryText={row.email} />,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      editable: true,
      editControl: { type: "select", options: STATUS_OPTIONS },
      render: (value) => {
        const status = value as Pedido["status"];
        return <Badge variant={STATUS_VARIANT[status]} label={STATUS_LABEL[status]} />;
      },
    },
    {
      key: "valor",
      header: "Valor",
      align: "right",
      sortable: true,
      render: (value) => formatBRL(value as number),
    },
    {
      key: "acoes",
      header: "Ações",
      align: "right",
      render: (_value, row, helpers) => (
        <div className={styles.row} style={{ justifyContent: "flex-end", alignItems: "center", gap: 4, flexWrap: "nowrap" }}>
          {helpers.isEditing ? (
            <>
              <Button
                variant="link"
                iconOnly
                accessibleLabel="Salvar alterações"
                leftIcon="check"
                onPress={helpers.requestSave}
              />
              <Button
                variant="link"
                iconOnly
                accessibleLabel="Cancelar edição"
                leftIcon="x"
                onPress={helpers.cancelEdit}
              />
            </>
          ) : (
            <>
              <Button
                variant="link"
                iconOnly
                accessibleLabel={`Editar pedido ${row.id}`}
                leftIcon="pencil-simple"
                onPress={helpers.startEdit}
              />
              <Button
                variant="link"
                iconOnly
                accessibleLabel={helpers.isDisabled ? `Ativar pedido ${row.id}` : `Desativar pedido ${row.id}`}
                leftIcon={helpers.isDisabled ? "eye-slash" : "eye"}
                onPress={helpers.requestToggleDisabled}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  function handleFilterChange(columnKey: string, value: string) {
    setFilterValues((current) => {
      const rest = current.filter((entry) => entry.columnKey !== columnKey);
      return value === "" ? rest : [...rest, { columnKey, value }];
    });
    setPage(1);
  }

  function handleRowSave(rowKey: string, values: Record<string, unknown>) {
    setPedidos((current) =>
      current.map((pedido) => (pedido.id === rowKey ? { ...pedido, ...values } : pedido))
    );
  }

  function simulateLoading() {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 900);
  }

  return (
    <div className={styles.column} style={{ maxWidth: "none" }}>
      <Datatable
        title="Pedidos"
        toolbarActions={
          <Button variant="secondary" label="Simular carregamento" onPress={simulateLoading} />
        }
        allowDensityToggle
        columnVisibilityEnabled
        onExport={(format, rows) =>
          window.alert(`Exportar ${format.toUpperCase()} com ${rows.length} linha(s) — geração real fica a cargo do app consumidor.`)
        }
        bulkActions={() => (
          <div className={styles.row} style={{ gap: 4, flexWrap: "nowrap" }}>
            <Button
              variant="link"
              iconOnly
              accessibleLabel="Excluir selecionados"
              leftIcon="trash"
              onPress={() => setBulkConfirm("delete")}
            />
            <Button
              variant="link"
              iconOnly
              accessibleLabel="Ativar selecionados"
              leftIcon="eye"
              onPress={() => setBulkConfirm("enable")}
            />
            <Button
              variant="link"
              iconOnly
              accessibleLabel="Desativar selecionados"
              leftIcon="eye-slash"
              onPress={() => setBulkConfirm("disable")}
            />
          </div>
        )}
        columns={columns}
        data={pedidos}
        rowKey="id"
        accessibleLabel="Lista completa de pedidos"
        selectable
        selectedRowKeys={selectedRowKeys}
        onSelectionChange={setSelectedRowKeys}
        sortColumnKey={sortColumnKey}
        sortDirection={sortDirection}
        onSortChange={(columnKey, direction) => {
          setSortColumnKey(columnKey);
          setSortDirection(direction);
        }}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        paginationEnabled
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRowSave={handleRowSave}
        disabledRowKeys={disabledRowKeys}
        onDisabledRowKeysChange={setDisabledRowKeys}
        loading={loading}
        emptyStateTitle="Nenhum pedido encontrado."
        emptyStateDescription="Tente ajustar os filtros aplicados."
      />
      <p className={styles.itemLabel}>
        {selectedRowKeys.length} selecionado(s): {selectedRowKeys.join(", ") || "nenhum"}
      </p>
      <Modal
        open={bulkConfirm !== null}
        onClose={() => setBulkConfirm(null)}
        title={
          bulkConfirm === "delete"
            ? "Excluir selecionados?"
            : bulkConfirm === "enable"
              ? "Ativar selecionados?"
              : "Desativar selecionados?"
        }
        size="small"
      >
        <div className={styles.column} style={{ gap: 16 }}>
          <p>
            {bulkConfirm === "delete"
              ? `${selectedRowKeys.length} pedido(s) serão excluídos.`
              : bulkConfirm === "enable"
                ? `${selectedRowKeys.length} pedido(s) ficarão ativos.`
                : `${selectedRowKeys.length} pedido(s) ficarão desabilitados.`}
          </p>
          <div className={styles.row} style={{ justifyContent: "flex-end" }}>
            <Button variant="neutral" outlined label="Cancelar" onPress={() => setBulkConfirm(null)} />
            <Button
              variant="primary"
              label="Confirmar"
              onPress={() => {
                if (bulkConfirm === "delete") {
                  setPedidos((current) => current.filter((pedido) => !selectedRowKeys.includes(pedido.id)));
                } else if (bulkConfirm === "disable") {
                  setDisabledRowKeys((current) => Array.from(new Set([...current, ...selectedRowKeys])));
                } else if (bulkConfirm === "enable") {
                  setDisabledRowKeys((current) => current.filter((key) => !selectedRowKeys.includes(key)));
                }
                setSelectedRowKeys([]);
                setBulkConfirm(null);
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

interface Produto extends Record<string, unknown> {
  id: string;
  nome: string;
  sku: string;
  imagem: string;
  categorias: string[];
  cliente: string;
  clienteEmail: string;
  preco: number;
  estoque: number;
  prioridade: "alta" | "media" | "baixa";
}

const PRIORIDADE_VARIANT: Record<Produto["prioridade"], "error" | "warning" | "neutral"> = {
  alta: "error",
  media: "warning",
  baixa: "neutral",
};

const PRODUTOS_INICIAIS: Produto[] = [
  { id: "P01", nome: "Fone LVXFR", sku: "FON-001", imagem: PLACEHOLDER, categorias: ["Eletrônicos", "Novo"], cliente: "Loja Centro", clienteEmail: "centro@loja.com", preco: 89.9, estoque: 12, prioridade: "alta" },
  { id: "P02", nome: "Mouse LVXFR", sku: "MOU-014", imagem: PLACEHOLDER, categorias: ["Periféricos"], cliente: "Loja Praia", clienteEmail: "praia@loja.com", preco: 59.9, estoque: 4, prioridade: "media" },
  { id: "P03", nome: "Teclado Kardüm", sku: "TEC-022", imagem: PLACEHOLDER, categorias: ["Periféricos", "Gamer"], cliente: "Loja Centro", clienteEmail: "centro@loja.com", preco: 179.9, estoque: 0, prioridade: "alta" },
  { id: "P04", nome: "Adesivo Olhosvaldo", sku: "ADE-003", imagem: PLACEHOLDER, categorias: ["Periféricos", "Novo"], cliente: "Loja Online", clienteEmail: "online@loja.com", preco: 9.9, estoque: 230, prioridade: "baixa" },
];

function WideExample() {
  const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS_INICIAIS);

  function updateEstoque(id: string, estoque: number) {
    setProdutos((current) => current.map((produto) => (produto.id === id ? { ...produto, estoque } : produto)));
  }

  function move(id: string, direction: -1 | 1) {
    setProdutos((current) => {
      const index = current.findIndex((produto) => produto.id === id);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  const columns: DatatableColumn<Produto>[] = [
    { key: "id", header: "ID", width: "72px" },
    {
      key: "imagem",
      header: "Imagem",
      width: "72px",
      render: (_value, row) => <ImageThumbnail src={row.imagem} alt={row.nome} size="small" clickable />,
    },
    {
      key: "nome",
      header: "Produto",
      sortable: true,
      filterable: true,
      render: (_value, row) => <StackedText primaryText={row.nome} secondaryText={row.sku} />,
    },
    {
      key: "cliente",
      header: "Loja",
      sortable: true,
      render: (_value, row) => <StackedText primaryText={row.cliente} secondaryText={row.clienteEmail} />,
    },
    {
      key: "categorias",
      header: "Categorias",
      render: (value) => (
        <div className={styles.row} style={{ gap: 4, justifyContent: "flex-start" }}>
          {(value as string[]).map((categoria) => (
            <Badge key={categoria} variant="neutral" label={categoria} />
          ))}
        </div>
      ),
    },
    {
      key: "prioridade",
      header: "Prioridade",
      sortable: true,
      render: (value) => {
        const prioridade = value as Produto["prioridade"];
        return <Badge variant={PRIORIDADE_VARIANT[prioridade]} label={prioridade.toUpperCase()} />;
      },
    },
    {
      key: "preco",
      header: "Preço",
      align: "right",
      sortable: true,
      render: (value) => formatBRL(value as number),
    },
    {
      key: "estoque",
      header: "Estoque",
      align: "center",
      width: "140px",
      render: (value, row) => (
        <QuantitySelector
          value={value as number}
          min={0}
          max={999}
          accessibleLabel={`Estoque de ${row.nome}`}
          onChange={(next) => updateEstoque(row.id, next)}
        />
      ),
    },
    {
      key: "acoes",
      header: "Ações",
      align: "right",
      width: "200px",
      sticky: "right",
      hideable: false,
      render: (_value, row) => (
        <div className={styles.row} style={{ justifyContent: "flex-end", alignItems: "center", gap: 4, flexWrap: "nowrap" }}>
          <Button variant="link" iconOnly accessibleLabel={`Mover ${row.nome} para cima`} leftIcon="caret-up" onPress={() => move(row.id, -1)} />
          <Button variant="link" iconOnly accessibleLabel={`Mover ${row.nome} para baixo`} leftIcon="caret-down" onPress={() => move(row.id, 1)} />
          <Button variant="link" iconOnly accessibleLabel={`Ver ${row.nome}`} leftIcon="eye" onPress={() => window.alert(`Ver ${row.nome}`)} />
          <Button variant="link" iconOnly accessibleLabel={`Editar ${row.nome}`} leftIcon="pencil-simple" onPress={() => window.alert(`Editar ${row.nome}`)} />
          <Button variant="link" iconOnly accessibleLabel={`Excluir ${row.nome}`} leftIcon="trash" onPress={() => window.alert(`Excluir ${row.nome}`)} />
        </div>
      ),
    },
  ];

  return (
    <div className={styles.column} style={{ maxWidth: "none" }}>
      <Datatable
        title="Produtos"
        columnVisibilityEnabled
        columns={columns}
        data={produtos}
        rowKey="id"
        accessibleLabel="Lista de produtos com muitas colunas"
        density="compact"
      />
    </div>
  );
}

export function DatatableDemo() {
  return (
    <div className={styles.column} style={{ maxWidth: "none" }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          Simples — sem sort/filtro/seleção/paginação, célula de 2 linhas (StackedText)
        </span>
        <SimpleExample />
      </div>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          Completo — toolbar (título, densidade, colunas, exportação), filtro oculto (clique no
          título da coluna), sort separado, seleção, paginação, edição de linha (Cliente/Status
          viram inputs, salvar pede confirmação), habilitar/desabilitar (ícone de olho, também
          pede confirmação), loading e vazio
        </span>
        <CompleteExample />
      </div>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          Muitas colunas — scroll horizontal com coluna de Ações fixa (sticky), imagem clicável,
          status com múltiplos badges, quantidade via QuantitySelector, mover linha pra cima/baixo
        </span>
        <WideExample />
      </div>
    </div>
  );
}
