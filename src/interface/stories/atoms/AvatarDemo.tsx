import { Avatar } from "../../../components/Avatar/Avatar";
import styles from "../Demo.module.css";

export function AvatarDemo() {
  return (
    <div className={styles.column} style={{ maxWidth: 420 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Com imagem (carregada com sucesso)</span>
        <div className={styles.row} style={{ alignItems: "center" }}>
          <Avatar src="https://i.pravatar.cc/150?img=12" name="Rafael Prado" size="small" />
          <Avatar src="https://i.pravatar.cc/150?img=12" name="Rafael Prado" size="medium" />
          <Avatar src="https://i.pravatar.cc/150?img=12" name="Rafael Prado" size="large" />
          <Avatar src="https://i.pravatar.cc/150?img=12" name="Rafael Prado" size="xlarge" status="online" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Tamanhos (iniciais, circle)</span>
        <div className={styles.row} style={{ alignItems: "center" }}>
          <Avatar name="Ana Souza" size="small" />
          <Avatar name="Ana Souza" size="medium" />
          <Avatar name="Ana Souza" size="large" />
          <Avatar name="Ana Souza" size="xlarge" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Formato (circle / square)</span>
        <div className={styles.row} style={{ alignItems: "center" }}>
          <Avatar name="Bruno Lima" size="large" shape="circle" />
          <Avatar name="Bruno Lima" size="large" shape="square" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Iniciais (1 e 2 palavras)</span>
        <div className={styles.row} style={{ alignItems: "center" }}>
          <Avatar name="Madonna" size="large" />
          <Avatar name="Ana Paula Souza" size="large" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Fallback de imagem quebrada → iniciais</span>
        <div className={styles.row} style={{ alignItems: "center" }}>
          <Avatar src="https://exemplo-invalido.test/foto.jpg" name="Carla Nunes" size="large" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Sem nome (ícone genérico, accessibleLabel)</span>
        <div className={styles.row} style={{ alignItems: "center" }}>
          <Avatar accessibleLabel="Usuário anônimo" size="large" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Indicador de presença</span>
        <div className={styles.row} style={{ alignItems: "center" }}>
          <Avatar name="Diego Reis" size="large" status="online" />
          <Avatar name="Diego Reis" size="large" status="away" />
          <Avatar name="Diego Reis" size="large" status="offline" />
        </div>
      </div>
    </div>
  );
}
