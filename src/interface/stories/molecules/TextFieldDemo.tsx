import { useState } from "react";
import { TextField } from "../../../components/TextField/TextField";
import styles from "../Demo.module.css";

export function TextFieldDemo() {
  const [texto, setTexto] = useState("");
  const [comEsquerda, setComEsquerda] = useState("");
  const [comDireita, setComDireita] = useState("");
  const [comAmbos, setComAmbos] = useState("");
  const [senha, setSenha] = useState("minhasenha");
  const [comErro, setComErro] = useState("valor-invalido");
  const [telefone, setTelefone] = useState("");
  const [telefoneComDdi, setTelefoneComDdi] = useState("");

  return (
    <div className={styles.column} style={{ maxWidth: 360 }}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Todas as composições de ícone possíveis</span>
        <div className={styles.column} style={{ maxWidth: 320 }}>
          <TextField
            label="Sem ícone"
            placeholder="Digite seu login"
            value={texto}
            onChange={setTexto}
          />
          <TextField
            label="Ícone à esquerda"
            leftIcon="info"
            placeholder="leftIcon"
            value={comEsquerda}
            onChange={setComEsquerda}
          />
          <TextField
            label="Ícone à direita"
            rightIcon="arrow-right"
            placeholder="rightIcon"
            value={comDireita}
            onChange={setComDireita}
          />
          <TextField
            label="Ícone nos dois lados"
            leftIcon="info"
            rightIcon="arrow-right"
            placeholder="leftIcon + rightIcon"
            value={comAmbos}
            onChange={setComAmbos}
          />
          <TextField
            label="Senha (type=password)"
            withInfo
            infoText="type=password sempre embute o toggle mostrar/ocultar no slot direito — sobrepõe um rightIcon manual."
            type="password"
            value={senha}
            onChange={setSenha}
          />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Estados</span>
        <div className={styles.column} style={{ maxWidth: 320 }}>
          <TextField
            label="E-mail"
            state="error"
            helperText="E-mail inválido — verifique e tente novamente."
            value={comErro}
            onChange={setComErro}
          />
          <TextField label="Somente leitura" state="readOnly" value="valor fixo" />
          <TextField label="Desabilitado" state="disabled" placeholder="Indisponível" />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Telefone (type=tel) — máscara automática, com e sem DDI</span>
        <div className={styles.column} style={{ maxWidth: 320 }}>
          <TextField
            label="Telefone"
            type="tel"
            placeholder="(11) 91234-5678"
            value={telefone}
            onChange={setTelefone}
          />
          <TextField
            label="Telefone com DDI"
            type="tel"
            showCountryCode
            placeholder="(11) 91234-5678"
            value={telefoneComDdi}
            onChange={setTelefoneComDdi}
          />
        </div>
      </div>
    </div>
  );
}
