import { useState } from "react";
import { NavBar } from "../../../components/NavBar/NavBar";
import { StatCard } from "../../../components/StatCard/StatCard";
import { Datatable, type DatatableColumn } from "../../../components/Datatable/Datatable";
import { Badge } from "../../../components/Badge/Badge";
import { FilterBar, type FilterBarActiveFilter } from "../../../components/FilterBar/FilterBar";
import { Select } from "../../../components/Select/Select";
import { DatePicker, type DatePickerRangeValue } from "../../../components/DatePicker/DatePicker";
import styles from "./DashboardTemplate.module.css";

interface Pedido extends Record<string, unknown> {
  id: string;
  cliente: string;
  valor: string;
  status: "pago" | "pendente" | "cancelado";
  data: string;
}

const PEDIDOS: Pedido[] = [
  { id: "#4521", cliente: "Ana Beatriz", valor: "R$ 320,00", status: "pago", data: "2026-08-02" },
  { id: "#4522", cliente: "Carlos Eduardo", valor: "R$ 158,50", status: "pendente", data: "2026-08-10" },
  { id: "#4523", cliente: "Fernanda Lima", valor: "R$ 89,90", status: "pago", data: "2026-08-15" },
  { id: "#4524", cliente: "Gustavo Rocha", valor: "R$ 412,00", status: "cancelado", data: "2026-08-18" },
  { id: "#4525", cliente: "Helena Souza", valor: "R$ 67,30", status: "pago", data: "2026-08-22" },
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

interface DashboardTemplateProps {
  embedded?: boolean;
}

export function DashboardTemplate({ embedded = false }: DashboardTemplateProps) {
  const [busca] = useState("");
  const [status, setStatus] = useState("");
  const [periodo, setPeriodo] = useState<DatePickerRangeValue>({ start: null, end: null });

  const columns: DatatableColumn<Pedido>[] = [
    { key: "id", header: "Pedido", sortable: true },
    { key: "cliente", header: "Cliente", sortable: true, filterable: true },
    { key: "data", header: "Data", sortable: true },
    { key: "valor", header: "Valor", align: "right" },
    {
      key: "status",
      header: "Status",
      render: (_value, row) => <Badge variant={STATUS_VARIANT[row.status]} label={STATUS_LABEL[row.status]} />,
    },
  ];

  const pedidosFiltrados = PEDIDOS.filter((p) => {
    if (!p.cliente.toLowerCase().includes(busca.toLowerCase())) return false;
    if (status && p.status !== status) return false;
    if (periodo.start && p.data < periodo.start) return false;
    if (periodo.end && p.data > periodo.end) return false;
    return true;
  });

  const activeFilters: FilterBarActiveFilter[] = [];
  if (status) activeFilters.push({ key: "status", label: `Status: ${STATUS_LABEL[status as Pedido["status"]]}` });
  if (periodo.start && periodo.end) activeFilters.push({ key: "periodo", label: `Período: ${periodo.start} a ${periodo.end}` });

  function removerFiltro(key: string) {
    if (key === "status") setStatus("");
    if (key === "periodo") setPeriodo({ start: null, end: null });
  }

  function limparTudo() {
    setStatus("");
    setPeriodo({ start: null, end: null });
  }

  return (
    <div className={embedded ? styles.pageEmbedded : styles.page}>
      <NavBar brand="Minha Empresa" items={[]} accessibleLabel="Navegação principal" />

      <div className={styles.body}>
        <h1 className={styles.title}>Visão geral</h1>

        <FilterBar
          accessibleLabel="Filtros do painel"
          activeFilters={activeFilters}
          onRemoveFilter={removerFiltro}
          onClearAll={activeFilters.length > 0 ? limparTudo : undefined}
          filters={
            <div className={styles.filterControls}>
              <Select
                options={STATUS_OPTIONS}
                value={status}
                onChange={setStatus}
                placeholder="Status"
              />
              <DatePicker range hideLabel value={periodo} onChange={setPeriodo} placeholder="Período" />
            </div>
          }
        />

        <div className={styles.statGrid}>
          <StatCard icon="currency-circle-dollar" label="Receita do mês" value="R$ 42.300" trendDirection="up" trendValue="+12%" helperText="vs. mês anterior" />
          <StatCard icon="shopping-cart" label="Pedidos" value="238" trendDirection="up" trendValue="+8%" helperText="vs. mês anterior" />
          <StatCard icon="receipt" label="Ticket médio" value="R$ 177,60" trendDirection="down" trendValue="-3%" helperText="vs. mês anterior" />
          <StatCard icon="x-circle" label="Cancelamentos" value="14" trendDirection="down" trendValue="-4%" helperText="vs. mês anterior" critical />
        </div>

        <div className={styles.tableSection}>
          <Datatable
            columns={columns}
            data={pedidosFiltrados}
            rowKey="id"
            accessibleLabel="Pedidos recentes"
            title="Pedidos recentes"
          />
        </div>
      </div>
    </div>
  );
}
