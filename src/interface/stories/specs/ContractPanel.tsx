import { useMemo } from "react";
import { CopyButton } from "../../../components/CopyButton/CopyButton";
import { SectionCard } from "../SectionCard";
import { ContractSpecs, specSections, type Contract, type SpecSection } from "./ContractSpecs";
import styles from "./ContractPanel.module.css";

/** Lê o JSON do contrato — null se for inválido (a seção Contrato ainda mostra o texto bruto). */
export function parseContract(source: string): Contract | null {
  try {
    return JSON.parse(source) as Contract;
  } catch {
    return null;
  }
}

/** Itens do menu "Nesta página" que vêm do contrato: as seções de Especificações + "Contrato" por último. */
export function contractNavItems(source: string): { specs: SpecSection[]; contractId: string } {
  const contract = parseContract(source);
  return { specs: contract ? specSections(contract) : [], contractId: "contrato" };
}

interface ContractPanelProps {
  fileName: string;
  source: string;
}

/** Abaixo do preview: as seções de Especificações (geradas do próprio contrato +
    tokens/tokens.css), cada uma num card, e por último o card do Contrato (o JSON bruto,
    com copiar). Cada card é uma âncora do menu "Nesta página". */
export function ContractPanel({ fileName, source }: ContractPanelProps) {
  const contract = useMemo(() => parseContract(source), [source]);

  return (
    <>
      {contract ? (
        <ContractSpecs contract={contract} />
      ) : (
        <SectionCard id="especificacoes" title="Especificações">
          <p>Não foi possível ler o contrato (JSON inválido) — veja a seção Contrato.</p>
        </SectionCard>
      )}

      <SectionCard id="contrato" title="Contrato" actions={<CopyButton value={source} accessibleLabel="Copiar contrato" />}>
        <code className={styles.fileName}>{fileName}</code>
        <pre className={styles.code}>
          <code>{source}</code>
        </pre>
      </SectionCard>
    </>
  );
}
