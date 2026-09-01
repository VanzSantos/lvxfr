import { useState } from "react";
import { Pagination } from "../../../components/Pagination/Pagination";
import styles from "../Demo.module.css";

export function PaginationDemo() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = 237;

  const [pageSemSeletor, setPageSemSeletor] = useState(3);

  return (
    <div className={styles.column}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com seletor de itens por página (onPageSizeChange fornecida)</span>
        <Pagination
          page={page}
          onPageChange={setPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Sem seletor (onPageSizeChange ausente — pageSize fixo)</span>
        <Pagination page={pageSemSeletor} onPageChange={setPageSemSeletor} totalItems={48} pageSize={12} />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Vazio (0 registros)</span>
        <Pagination page={1} onPageChange={() => {}} totalItems={0} pageSize={10} />
      </div>
    </div>
  );
}
