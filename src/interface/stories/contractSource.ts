/**
 * Carrega o conteúdo bruto de todos os *.contract.json via import.meta.glob
 * do Vite — funciona pra qualquer contrato automaticamente, sem precisar
 * religar arquivo por arquivo quando um novo contrato é criado.
 */
const RAW_CONTRACTS = import.meta.glob("../../../contratos/*.contract.json", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const BY_FILENAME = new Map<string, string>();
for (const [path, content] of Object.entries(RAW_CONTRACTS)) {
  const filename = path.split("/").pop();
  if (filename) {
    BY_FILENAME.set(filename, content);
  }
}

/** contractFile no formato "contratos/button.contract.json" — retorna undefined se não achar (ex.: páginas sem contrato). */
export function getContractSource(contractFile: string | undefined): string | undefined {
  if (!contractFile) return undefined;
  const filename = contractFile.split("/").pop();
  if (!filename) return undefined;
  return BY_FILENAME.get(filename);
}
