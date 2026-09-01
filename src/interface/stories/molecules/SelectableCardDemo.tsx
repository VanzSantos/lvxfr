import { useState } from "react";
import { SelectableCard } from "../../../components/SelectableCard/SelectableCard";
import styles from "../Demo.module.css";

export function SelectableCardDemo() {
  const [plano, setPlano] = useState("infinite");

  return (
    <div className={styles.column} style={{ maxWidth: 720 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Grade de planos (grupo radio, mesmo name)</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          <SelectableCard
            name="plano"
            value="topazio"
            title="Topázio Enfermaria"
            description="Ambulatorial e hospitalar, sem obstetrícia"
            price="R$ 000,00"
            badgeLabel="Padrão"
            checked={plano === "topazio"}
            onChange={setPlano}
          />
          <SelectableCard
            name="plano"
            value="esmeralda"
            title="Esmeralda Apartamento"
            description="Ambulatorial e hospitalar, sem obstetrícia"
            price="R$ 000,00"
            badgeLabel="Promocional"
            badgeVariant="success"
            checked={plano === "esmeralda"}
            onChange={setPlano}
          />
          <SelectableCard
            name="plano"
            value="black"
            title="MedSênior Black ES"
            description="Ambulatorial e hospitalar, sem obstetrícia"
            price="R$ 000,00"
            badgeLabel="Black"
            badgeVariant="dark"
            checked={plano === "black"}
            onChange={setPlano}
          />
          <SelectableCard
            name="plano"
            value="infinite"
            title="Infinite ME"
            description="Ambulatorial e hospitalar, sem obstetrícia"
            price="R$ 000,00"
            badgeLabel="Infinite"
            badgeVariant="accent2"
            selectedTone="accent2"
            checked={plano === "infinite"}
            onChange={setPlano}
          />
        </div>
        <p style={{ marginTop: 8, fontSize: 13, color: "var(--texto-secundario)" }}>
          Selecionado: {plano} — "Infinite" usa badgeVariant="accent2" (roxo) e
          selectedTone="accent2" (roxo) de propósito: quando as duas cores colidem, o Badge
          inverte pra fundo claro + texto roxo automaticamente (ver seção abaixo).
        </p>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          Badge x fundo selecionado da mesma cor — inversão automática
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          <SelectableCard
            name="colisao-accent2"
            value="sem-colisao"
            title="Sem colisão"
            price="R$ 000,00"
            badgeLabel="Infinite"
            badgeVariant="accent2"
            selectedTone="dark"
            checked
          />
          <SelectableCard
            name="colisao-accent2"
            value="com-colisao"
            title="Com colisão (mesma cor)"
            price="R$ 000,00"
            badgeLabel="Infinite"
            badgeVariant="accent2"
            selectedTone="accent2"
            checked
          />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Tons do estado selecionado (selectedTone)</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <SelectableCard name="tom" value="dark" title="Preto (padrão)" price="R$ 000,00" checked selectedTone="dark" />
          <SelectableCard name="tom" value="primary" title="Verde (principal)" price="R$ 000,00" checked selectedTone="primary" />
          <SelectableCard name="tom" value="accent1" title="Kiwi" price="R$ 000,00" checked selectedTone="accent1" />
          <SelectableCard name="tom" value="accent2" title="Roxo" price="R$ 000,00" checked selectedTone="accent2" />
          <SelectableCard name="tom" value="accent3" title="Laranja" price="R$ 000,00" checked selectedTone="accent3" />
          <SelectableCard name="tom" value="info" title="Azul" price="R$ 000,00" checked selectedTone="info" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Sem badge / sem preço (props opcionais)</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, maxWidth: 400 }}>
          <SelectableCard name="simples" value="a" title="Opção A" checked={false} onChange={() => {}} />
          <SelectableCard name="simples" value="b" title="Opção B" checked onChange={() => {}} />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Desabilitado</span>
        <div style={{ maxWidth: 200 }}>
          <SelectableCard name="desabilitado" value="x" title="Indisponível" price="R$ 000,00" checked={false} state="disabled" />
        </div>
      </div>
    </div>
  );
}
