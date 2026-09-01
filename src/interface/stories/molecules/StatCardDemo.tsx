import { StatCard } from "../../../components/StatCard/StatCard";
import styles from "../Demo.module.css";

export function StatCardDemo() {
  return (
    <div className={styles.row} style={{ flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
      <div style={{ width: 220 }}>
        <StatCard label="Receita mensal" value="R$ 42.300" trendDirection="up" trendValue="+12%" helperText="vs. mês anterior" icon="star" />
      </div>
      <div style={{ width: 220 }}>
        <StatCard label="Cancelamentos" value="18" trendDirection="down" trendValue="-4%" helperText="vs. mês anterior" />
      </div>
      <div style={{ width: 220 }}>
        <StatCard
          label="Custos operacionais"
          value="R$ 8.140"
          trendDirection="up"
          trendValue="+15%"
          trendTone="error"
          helperText="tone sobrescrito: subir é ruim aqui"
        />
      </div>
      <div style={{ width: 220 }}>
        <StatCard label="Usuários ativos" value="1.204" trendDirection="neutral" trendValue="0%" helperText="sem variação" />
      </div>
      <div style={{ width: 220 }}>
        <StatCard label="Visitas totais" value="9.870" />
      </div>
      <div style={{ width: 220 }}>
        <StatCard
          label="Ticket médio"
          value="R$ 177,60"
          icon="receipt"
          trendDirection="down"
          trendValue="-3%"
          helperText="ícone sempre na mesma cor do indicador percentual (vermelho aqui)"
        />
      </div>
      <div style={{ width: 220 }}>
        <StatCard
          label="Inadimplência"
          value="R$ 3.920"
          icon="x-circle"
          trendDirection="up"
          trendValue="+22%"
          trendTone="error"
          helperText="critical=true: borda do card fica vermelha"
          critical
        />
      </div>

      {(["none", "low", "medium", "high"] as const).map((elevation) => (
        <div key={elevation} style={{ width: 220 }}>
          <StatCard
            label={`elevation="${elevation}"`}
            value="R$ 42.300"
            trendDirection="up"
            trendValue="+12%"
            helperText="vs. mês anterior"
            elevation={elevation}
          />
        </div>
      ))}
    </div>
  );
}
