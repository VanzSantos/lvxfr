import { useMemo, useState } from "react";
import { Tabs } from "../../../components/Tabs/Tabs";
import { CopyButton } from "../../../components/CopyButton/CopyButton";
import { ContractSpecs, type Contract } from "./ContractSpecs";
import styles from "./ContractPanel.module.css";

type PanelTab = "specs" | "contract";

interface ContractPanelProps {
  fileName: string;
  source: string;
}

/** Área abaixo do preview do componente: Especificações (geradas do próprio
    contrato + tokens/tokens.css) e Contrato (o JSON bruto, com copiar). */
export function ContractPanel({ fileName, source }: ContractPanelProps) {
  const [tab, setTab] = useState<PanelTab>("specs");
  const contract = useMemo<Contract | null>(() => {
    try {
      return JSON.parse(source) as Contract;
    } catch {
      return null;
    }
  }, [source]);

  return (
    <section className={styles.panel} aria-label="Especificações e contrato">
      <Tabs
        items={[
          { value: "specs", label: "Especificações" },
          { value: "contract", label: "Contrato" },
        ]}
        value={tab}
        onChange={(value) => setTab(value as PanelTab)}
      />
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className={styles.body}>
        {tab === "specs" ? (
          contract ? (
            <ContractSpecs contract={contract} />
          ) : (
            <p>Não foi possível ler o contrato (JSON inválido) — veja a aba Contrato.</p>
          )
        ) : (
          <>
            <div className={styles.fileRow}>
              <code>{fileName}</code>
              <CopyButton value={source} accessibleLabel="Copiar contrato" />
            </div>
            <pre className={styles.code}>
              <code>{source}</code>
            </pre>
          </>
        )}
      </div>
    </section>
  );
}
