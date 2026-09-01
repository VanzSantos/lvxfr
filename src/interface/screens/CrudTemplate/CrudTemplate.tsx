import { useState } from "react";
import { AppShell } from "../shared/AppShell";
import { Datatable, type DatatableColumn } from "../../../components/Datatable/Datatable";
import { Badge } from "../../../components/Badge/Badge";
import { Button } from "../../../components/Button/Button";
import { StackedText } from "../../../components/StackedText/StackedText";
import { Modal } from "../../../components/Modal/Modal";
import { TextField } from "../../../components/TextField/TextField";
import { Select } from "../../../components/Select/Select";
import styles from "./CrudTemplate.module.css";

interface Cliente extends Record<string, unknown> {
  id: string;
  nome: string;
  email: string;
  plano: "free" | "pro" | "enterprise";
  dataCadastro: string;
}

const PLANO_LABEL: Record<Cliente["plano"], string> = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
};

const PLANO_VARIANT: Record<Cliente["plano"], "neutral" | "info" | "accent2"> = {
  free: "neutral",
  pro: "info",
  enterprise: "accent2",
};

const PLANO_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

const CLIENTES_INICIAIS: Cliente[] = [
  { id: "CLI-001", nome: "Ana Souza", email: "ana@exemplo.com", plano: "pro", dataCadastro: "2026-02-14" },
  { id: "CLI-002", nome: "Bruno Lima", email: "bruno@exemplo.com", plano: "free", dataCadastro: "2026-03-02" },
  { id: "CLI-003", nome: "Camila Reis", email: "camila@exemplo.com", plano: "enterprise", dataCadastro: "2026-03-19" },
  { id: "CLI-004", nome: "Diego Alves", email: "diego@exemplo.com", plano: "pro", dataCadastro: "2026-04-05" },
  { id: "CLI-005", nome: "Érica Nunes", email: "erica@exemplo.com", plano: "free", dataCadastro: "2026-04-22" },
  { id: "CLI-006", nome: "Felipe Costa", email: "felipe@exemplo.com", plano: "pro", dataCadastro: "2026-05-11" },
  { id: "CLI-007", nome: "Gabriela Dias", email: "gabriela@exemplo.com", plano: "enterprise", dataCadastro: "2026-05-30" },
  { id: "CLI-008", nome: "Henrique Melo", email: "henrique@exemplo.com", plano: "free", dataCadastro: "2026-06-08" },
];

const EMPTY_FORM = { nome: "", email: "", plano: "free" as Cliente["plano"] };

interface CrudTemplateProps {
  embedded?: boolean;
}

/** Tela de CRUD padrão — casca compartilhada (AppShell, ver
    interface/screens/shared/AppShell.tsx) + Datatable no tipo MAIS
    COMPLETO já estabelecido no harness (mesma configuração da
    'CompleteExample' de DatatableDemo: toolbar com título/densidade/
    colunas/exportação, filtro oculto por coluna, sort, seleção com ações
    em lote — excluir/ativar/desativar, sempre com confirmação — paginação,
    edição de linha inline e habilitar/desabilitar registro, ambos com
    confirmação própria do Datatable) + botão 'Novo registro' que abre um
    Modal de criação — pensada como ponto de partida reaproveitável pra
    qualquer tela nova de listagem/gestão de registros. */
export function CrudTemplate({ embedded = false }: CrudTemplateProps) {
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES_INICIAIS);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [sortColumnKey, setSortColumnKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterValues, setFilterValues] = useState<{ columnKey: string; value: string }[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [disabledRowKeys, setDisabledRowKeys] = useState<string[]>([]);
  const [bulkConfirm, setBulkConfirm] = useState<"delete" | "enable" | "disable" | null>(null);
  const [novoRegistroOpen, setNovoRegistroOpen] = useState(false);
  const [novoRegistro, setNovoRegistro] = useState(EMPTY_FORM);

  const columns: DatatableColumn<Cliente>[] = [
    { key: "id", header: "ID", sortable: true, filterable: true, hideable: false },
    {
      key: "nome",
      header: "Cliente",
      sortable: true,
      filterable: true,
      editable: true,
      editControl: { type: "text" },
      render: (_value, row) => <StackedText primaryText={row.nome} secondaryText={row.email} />,
    },
    {
      key: "plano",
      header: "Plano",
      sortable: true,
      filterable: true,
      editable: true,
      editControl: { type: "select", options: PLANO_OPTIONS },
      render: (value) => {
        const plano = value as Cliente["plano"];
        return <Badge variant={PLANO_VARIANT[plano]} label={PLANO_LABEL[plano]} />;
      },
    },
    { key: "dataCadastro", header: "Cadastro", sortable: true },
    {
      key: "acoes",
      header: "Ações",
      align: "right",
      hideable: false,
      render: (_value, row, helpers) => (
        <div className={styles.rowActions}>
          {helpers.isEditing ? (
            <>
              <Button variant="link" iconOnly accessibleLabel="Salvar alterações" leftIcon="check" onPress={helpers.requestSave} />
              <Button variant="link" iconOnly accessibleLabel="Cancelar edição" leftIcon="x" onPress={helpers.cancelEdit} />
            </>
          ) : (
            <>
              <Button variant="link" iconOnly accessibleLabel={`Editar ${row.nome}`} leftIcon="pencil-simple" onPress={helpers.startEdit} />
              <Button
                variant="link"
                iconOnly
                accessibleLabel={helpers.isDisabled ? `Ativar ${row.nome}` : `Desativar ${row.nome}`}
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
    setClientes((current) => current.map((cliente) => (cliente.id === rowKey ? { ...cliente, ...values } : cliente)));
  }

  function criarRegistro() {
    const proximoId = `CLI-${String(clientes.length + 1).padStart(3, "0")}`;
    const hoje = new Date().toISOString().slice(0, 10);
    setClientes((current) => [...current, { id: proximoId, ...novoRegistro, dataCadastro: hoje }]);
    setNovoRegistro(EMPTY_FORM);
    setNovoRegistroOpen(false);
  }

  return (
    <AppShell
      embedded={embedded}
      activeNavKey="crud"
      breadcrumbItems={[{ label: "Início", href: "/" }, { label: "Registros" }]}
    >
      <div className={styles.body}>
        <div className={styles.contentCard}>
          <Datatable
            title="Clientes"
            toolbarActions={<Button variant="primary" label="Novo registro" onPress={() => setNovoRegistroOpen(true)} />}
            allowDensityToggle
            columnVisibilityEnabled
            onExport={(format, rows) =>
              window.alert(`Exportar ${format.toUpperCase()} com ${rows.length} linha(s) — geração real fica a cargo do app consumidor.`)
            }
            bulkActions={() => (
              <div className={styles.bulkActions}>
                <Button variant="link" iconOnly accessibleLabel="Excluir selecionados" leftIcon="trash" onPress={() => setBulkConfirm("delete")} />
                <Button variant="link" iconOnly accessibleLabel="Ativar selecionados" leftIcon="eye" onPress={() => setBulkConfirm("enable")} />
                <Button variant="link" iconOnly accessibleLabel="Desativar selecionados" leftIcon="eye-slash" onPress={() => setBulkConfirm("disable")} />
              </div>
            )}
            columns={columns}
            data={clientes}
            rowKey="id"
            accessibleLabel="Lista de clientes"
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
            emptyStateTitle="Nenhum cliente encontrado."
            emptyStateDescription="Tente ajustar os filtros aplicados."
          />
        </div>
      </div>

      <Modal
        open={bulkConfirm !== null}
        onClose={() => setBulkConfirm(null)}
        title={bulkConfirm === "delete" ? "Excluir selecionados?" : bulkConfirm === "enable" ? "Ativar selecionados?" : "Desativar selecionados?"}
        size="small"
      >
        <div className={styles.confirmBody}>
          <p>
            {bulkConfirm === "delete"
              ? `${selectedRowKeys.length} cliente(s) serão excluídos. Esta ação não pode ser desfeita.`
              : bulkConfirm === "enable"
                ? `${selectedRowKeys.length} cliente(s) ficarão ativos.`
                : `${selectedRowKeys.length} cliente(s) ficarão desabilitados.`}
          </p>
          <div className={styles.confirmActions}>
            <Button variant="neutral" outlined label="Cancelar" onPress={() => setBulkConfirm(null)} />
            <Button
              variant={bulkConfirm === "delete" ? "destructive" : "primary"}
              label="Confirmar"
              onPress={() => {
                if (bulkConfirm === "delete") {
                  setClientes((current) => current.filter((cliente) => !selectedRowKeys.includes(cliente.id)));
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

      <Modal open={novoRegistroOpen} onClose={() => setNovoRegistroOpen(false)} title="Novo cliente" size="small">
        <div className={styles.form}>
          <TextField label="Nome completo" value={novoRegistro.nome} onChange={(nome) => setNovoRegistro((f) => ({ ...f, nome }))} />
          <TextField label="E-mail" type="email" value={novoRegistro.email} onChange={(email) => setNovoRegistro((f) => ({ ...f, email }))} />
          <Select label="Plano" options={PLANO_OPTIONS} value={novoRegistro.plano} onChange={(plano) => setNovoRegistro((f) => ({ ...f, plano: plano as Cliente["plano"] }))} />
          <div className={styles.confirmActions}>
            <Button variant="neutral" outlined label="Cancelar" onPress={() => setNovoRegistroOpen(false)} />
            <Button
              variant="primary"
              label="Criar cliente"
              onPress={criarRegistro}
              state={novoRegistro.nome && novoRegistro.email ? "default" : "disabled"}
            />
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
