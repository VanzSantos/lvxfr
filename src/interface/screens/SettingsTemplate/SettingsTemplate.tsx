import { useState } from "react";
import { Card } from "../../../components/Card/Card";
import { Tabs } from "../../../components/Tabs/Tabs";
import { TabPanel } from "../../../components/Tabs/TabPanel";
import { TextField } from "../../../components/TextField/TextField";
import { Button } from "../../../components/Button/Button";
import { Switch } from "../../../components/Switch/Switch";
import { Avatar } from "../../../components/Avatar/Avatar";
import { FileUpload } from "../../../components/FileUpload/FileUpload";
import { PasswordStrengthMeter } from "../../../components/PasswordStrengthMeter/PasswordStrengthMeter";
import { Alert } from "../../../components/Alert/Alert";
import styles from "./SettingsTemplate.module.css";

type SettingsSection = "perfil" | "seguranca" | "notificacoes";

const SECTIONS: { value: SettingsSection; label: string }[] = [
  { value: "perfil", label: "Perfil" },
  { value: "seguranca", label: "Segurança" },
  { value: "notificacoes", label: "Notificações" },
];

interface SettingsTemplateProps {
  embedded?: boolean;
}

function ProfileSection() {
  const [nome, setNome] = useState("Ana Beatriz");
  const [email, setEmail] = useState("ana.beatriz@exemplo.com");
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
  const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
  const [salvo, setSalvo] = useState(false);

  function handleAvatarFiles(files: File[]) {
    setAvatarFiles(files);
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className={styles.form}>
      {salvo && <Alert intent="success" description="Perfil atualizado." dismissible onDismiss={() => setSalvo(false)} />}
      {/* AJUSTADO a pedido do usuário — o gatilho de upload reaproveita o
          átomo FileUpload já existente (contratos/file-upload.contract.json,
          variant='button'), em vez de um <input type="file"> montado à mão.
          buttonVariant/buttonOutlined (props novas do FileUpload, ver
          decisions do contrato) deixam o gatilho no estilo "botão link" —
          ícone + texto, sem fundo/borda — pedido explícito do usuário,
          posicionado exatamente embaixo do Avatar. */}
      <div className={styles.avatarRow}>
        <span className={styles.avatarWrapper}>
          <span className={styles.avatarScale}>
            <Avatar name={nome} src={avatarSrc} size="xlarge" />
          </span>
        </span>
        <FileUpload
          variant="button"
          value={avatarFiles}
          onChange={handleAvatarFiles}
          accept="image/*"
          buttonLabel="Enviar sua foto"
          buttonVariant="link"
          accessibleLabel="Enviar foto de perfil"
        />
      </div>
      <TextField label="Nome completo" value={nome} onChange={setNome} />
      <TextField label="E-mail" type="email" value={email} onChange={setEmail} />
      <div className={styles.actions}>
        <Button variant="primary" label="Salvar alterações" onPress={() => setSalvo(true)} />
      </div>
    </div>
  );
}

function SecuritySection() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [doisFatores, setDoisFatores] = useState(false);
  const [salvo, setSalvo] = useState(false);

  return (
    <div className={styles.form}>
      {salvo && <Alert intent="success" description="Configurações de segurança atualizadas." dismissible onDismiss={() => setSalvo(false)} />}
      <TextField label="Senha atual" type="password" value={senhaAtual} onChange={setSenhaAtual} />
      <div className={styles.field}>
        <TextField label="Nova senha" type="password" value={novaSenha} onChange={setNovaSenha} />
        <PasswordStrengthMeter value={novaSenha} />
      </div>
      <Switch label="Verificação em duas etapas" checked={doisFatores} onChange={setDoisFatores} />
      <div className={styles.actions}>
        <Button variant="primary" label="Salvar" onPress={() => setSalvo(true)} />
      </div>
    </div>
  );
}

function NotificationsSection() {
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  return (
    <div className={styles.form}>
      <Switch label="Notificações por e-mail" checked={email} onChange={setEmail} />
      <Switch label="Notificações push" checked={push} onChange={setPush} />
      <Switch label="Newsletter semanal" checked={newsletter} onChange={setNewsletter} />
    </div>
  );
}

/** AJUSTADO a pedido do usuário — sem NavBar/header ("não precisa do header
    que tem escrito 'minha empresa'") e sem navegação lateral: a troca de
    seção (Perfil/Segurança/Notificações) virou Tabs (átomo já existente do
    harness, ver tabs.contract.json) no topo do próprio Card, no lugar do
    <nav> com botões que ficava numa coluna à esquerda. Cada seção usa
    TabPanel (hidden, não desmonta — mesmo padrão de qualquer outro
    consumidor de Tabs no harness) em vez de renderização condicional. */
export function SettingsTemplate({ embedded = false }: SettingsTemplateProps) {
  const [section, setSection] = useState<SettingsSection>("perfil");

  return (
    <div className={embedded ? styles.pageEmbedded : styles.page}>
      <div className={styles.body}>
        <div className={styles.content}>
          <Card padding="large">
            <Tabs items={SECTIONS} value={section} onChange={(value) => setSection(value as SettingsSection)} />

            <TabPanel value="perfil" hidden={section !== "perfil"}>
              <div className={styles.panelContent}>
                <h1 className={styles.title}>Perfil</h1>
                <ProfileSection />
              </div>
            </TabPanel>
            <TabPanel value="seguranca" hidden={section !== "seguranca"}>
              <div className={styles.panelContent}>
                <h1 className={styles.title}>Segurança</h1>
                <SecuritySection />
              </div>
            </TabPanel>
            <TabPanel value="notificacoes" hidden={section !== "notificacoes"}>
              <div className={styles.panelContent}>
                <h1 className={styles.title}>Notificações</h1>
                <NotificationsSection />
              </div>
            </TabPanel>
          </Card>
        </div>
      </div>
    </div>
  );
}
