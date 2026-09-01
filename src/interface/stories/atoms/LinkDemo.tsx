import { Link } from "../../../components/Link/Link";
import styles from "../Demo.module.css";

export function LinkDemo() {
  return (
    <div className={styles.column} style={{ maxWidth: 440 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          Herda a tipografia do contexto — texto-p (14px) aqui, propositalmente menor que o
          padrão do canvas (texto-m, 16px), pra provar que não é coincidência
        </span>
        <p style={{ margin: 0, fontFamily: "var(--texto-p-family)", fontSize: "var(--texto-p-size)" }}>
          Leia nossos <Link href="#" label="termos de uso" /> antes de continuar.
        </p>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Sublinhado: só no hover (padrão) vs. sempre visível</span>
        <div className={styles.row}>
          <Link href="#" label="Só no hover (passe o mouse)" />
          <Link href="#" label="Sempre sublinhado" underline />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com ícones</span>
        <div className={styles.row}>
          <Link href="#" label="Voltar" leftIcon="arrow-right" />
          <Link href="#" label="Saiba mais" rightIcon="arrow-right" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Link externo (nova aba, com aviso pro leitor de tela)</span>
        <Link href="https://example.com" label="Documentação completa" external />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>current (item ativo — aria-current="page", ex.: NavBar)</span>
        <div className={styles.row}>
          <Link href="#" label="Início" />
          <Link href="#" label="Pedidos (página atual)" current />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Estados</span>
        <div className={styles.row}>
          <Link href="#" label="Padrão" />
          <Link href="#" label="Desabilitado" state="disabled" />
        </div>
      </div>
    </div>
  );
}
