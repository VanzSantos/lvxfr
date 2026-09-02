import { useMemo, useState } from "react";
import { NavBar } from "../../../components/NavBar/NavBar";
import { Avatar } from "../../../components/Avatar/Avatar";
import { Alert } from "../../../components/Alert/Alert";
import { FileUpload } from "../../../components/FileUpload/FileUpload";
import { Select, type SelectOption } from "../../../components/Select/Select";
import { TextField } from "../../../components/TextField/TextField";
import { ComboBox, type ComboBoxOption } from "../../../components/ComboBox/ComboBox";
import { QuantitySelector } from "../../../components/QuantitySelector/QuantitySelector";
import { Button } from "../../../components/Button/Button";
import { Badge } from "../../../components/Badge/Badge";
import { Divider } from "../../../components/Divider/Divider";
import { Spinner } from "../../../components/Spinner/Spinner";
import { ConfirmDialog } from "../../../components/ConfirmDialog/ConfirmDialog";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
import { DataField } from "../../../components/DataField/DataField";
import styles from "./AutorizacaoOCRScreen.module.css";

const BENEFICIARIO_NOME = "Ana Beatriz Souza";

const UF_OPTIONS: SelectOption[] = [
  "SP", "RJ", "MG", "ES", "BA", "PR", "RS", "SC", "DF", "GO",
].map((uf) => ({ value: uf, label: uf }));

const TUSS_CATALOGO: ComboBoxOption[] = [
  { value: "10101012", label: "Consulta em consultório (no horário normal ou preestabelecido)" },
  { value: "40901234", label: "Ressonância magnética de coluna lombossacra" },
  { value: "40801056", label: "Tomografia computadorizada de crânio" },
  { value: "40301010", label: "Ultrassonografia de abdômen total" },
  { value: "41001019", label: "Eletrocardiograma convencional" },
  { value: "40902040", label: "Ressonância magnética de joelho" },
  { value: "40202015", label: "Radiografia de tórax (PA e perfil)" },
  { value: "20103023", label: "Fisioterapia motora — sessão" },
  { value: "40701070", label: "Ecocardiograma transtorácico" },
  { value: "40501034", label: "Densitometria óssea (coluna e fêmur)" },
];

function tussLabel(tussCode: string): string {
  return TUSS_CATALOGO.find((item) => item.value === tussCode)?.label ?? "";
}

interface Procedimento {
  id: string;
  tussCode: string;
  quantidade: number;
}

interface GrupoMedico {
  id: string;
  nomeMedico: string;
  crm: string;
  uf: string;
  procedimentos: Procedimento[];
}

let idSeq = 0;
function nextId(prefix: string) {
  idSeq += 1;
  return `${prefix}-${idSeq}`;
}

function novoProcedimento(tussCode = "", quantidade = 1): Procedimento {
  return { id: nextId("proc"), tussCode, quantidade };
}

type Cenario = "sucesso-um-medico" | "medicos-distintos" | "dados-incompletos" | "bypass-mais-de-5";

const CENARIO_OPTIONS: SelectOption[] = [
  { value: "sucesso-um-medico", label: "1 médico, 3 procedimentos (sucesso)" },
  { value: "medicos-distintos", label: "2 médicos distintos, 4 procedimentos no total" },
  { value: "dados-incompletos", label: "Dados incompletos (dispara alerta de confirmação)" },
  { value: "bypass-mais-de-5", label: "Mais de 5 procedimentos (encaminha direto ao protocolo)" },
];

function gerarGruposPorCenario(cenario: Cenario): GrupoMedico[] {
  switch (cenario) {
    case "sucesso-um-medico":
      return [
        {
          id: nextId("grupo"),
          nomeMedico: "Dr. Carlos Mendes",
          crm: "123456",
          uf: "SP",
          procedimentos: [
            novoProcedimento("40901234", 1),
            novoProcedimento("41001019", 1),
            novoProcedimento("20103023", 10),
          ],
        },
      ];
    case "medicos-distintos":
      return [
        {
          id: nextId("grupo"),
          nomeMedico: "Dra. Fernanda Lima",
          crm: "234567",
          uf: "RJ",
          procedimentos: [novoProcedimento("40801056", 1), novoProcedimento("40202015", 1)],
        },
        {
          id: nextId("grupo"),
          nomeMedico: "Dr. Ricardo Alves",
          crm: "345678",
          uf: "MG",
          procedimentos: [novoProcedimento("40902040", 1), novoProcedimento("40701070", 1)],
        },
      ];
    case "dados-incompletos":
      return [
        {
          id: nextId("grupo"),
          nomeMedico: "Dr. Paulo Rocha",
          crm: "",
          uf: "",
          procedimentos: [novoProcedimento("40301010", 1), novoProcedimento("", 1)],
        },
      ];
    case "bypass-mais-de-5":
      return [
        {
          id: nextId("grupo"),
          nomeMedico: "Dr. Carlos Mendes",
          crm: "123456",
          uf: "SP",
          procedimentos: [
            novoProcedimento("40901234", 1),
            novoProcedimento("41001019", 1),
            novoProcedimento("20103023", 5),
            novoProcedimento("40701070", 1),
            novoProcedimento("40501034", 1),
            novoProcedimento("40202015", 2),
          ],
        },
      ];
  }
}

function totalProcedimentos(grupos: GrupoMedico[]): number {
  return grupos.reduce((total, grupo) => total + grupo.procedimentos.length, 0);
}

function grupoIncompleto(grupo: GrupoMedico): boolean {
  if (!grupo.nomeMedico.trim() || !grupo.crm.trim() || !grupo.uf.trim()) return true;
  return grupo.procedimentos.some((proc) => !proc.tussCode || proc.quantidade < 1);
}

type Etapa = "upload" | "processando" | "conferencia" | "protocolo-bypass" | "sucesso";

interface AutorizacaoOCRScreenProps {
  embedded?: boolean;
}

/** Protótipo da US "Extração OCR e Validação de Dados na Solicitação de
    Autorização pelo App" (Projeto: Portal do Cliente (Web), Módulo:
    Autorizações). Sem contrato próprio — página de produto, não componente
    do design system (mesma régua de LoginScreen/CrudTemplate, ver
    ARCHITECTURE.md > "Templates vs Páginas").

    Fluxo: upload de pedidos médicos -> "processamento" OCR simulado (o
    seletor "Cenário de teste" escolhe qual resultado mockado o OCR
    devolve, já que não há OCR real aqui) -> tela de conferência (agrupada
    por médico quando há mais de um, edição/inclusão/exclusão de
    procedimentos com busca preditiva por descrição autocompletando o TUSS)
    -> confirmação de envio com alerta se houver campo obrigatório vazio ->
    bypass direto pro protocolo quando o total consolidado passa de 5
    procedimentos (nenhuma tela de conferência é exibida nesse caso). Cobre
    os 5 cenários BDD da US — o seletor de cenário no passo de upload existe
    só pra tornar cada cenário testável isoladamente neste protótipo, não é
    parte do fluxo real (que dependeria do OCR de verdade). */
export function AutorizacaoOCRScreen({ embedded = false }: AutorizacaoOCRScreenProps) {
  const [etapa, setEtapa] = useState<Etapa>("upload");
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [cenario, setCenario] = useState<Cenario>("sucesso-um-medico");
  const [grupos, setGrupos] = useState<GrupoMedico[]>([]);
  const [confirmEnvioAberto, setConfirmEnvioAberto] = useState(false);
  const [protocolo, setProtocolo] = useState("");

  const algumGrupoIncompleto = useMemo(() => grupos.some(grupoIncompleto), [grupos]);

  function processarOCR() {
    setEtapa("processando");
    window.setTimeout(() => {
      const gruposGerados = gerarGruposPorCenario(cenario);
      setGrupos(gruposGerados);
      if (totalProcedimentos(gruposGerados) > 5) {
        setProtocolo(`PROT-${Math.floor(100000 + Math.random() * 900000)}`);
        setEtapa("protocolo-bypass");
      } else {
        setEtapa("conferencia");
      }
    }, 900);
  }

  function atualizarGrupo(grupoId: string, patch: Partial<GrupoMedico>) {
    setGrupos((atual) => atual.map((g) => (g.id === grupoId ? { ...g, ...patch } : g)));
  }

  function atualizarProcedimento(grupoId: string, procId: string, patch: Partial<Procedimento>) {
    setGrupos((atual) =>
      atual.map((g) =>
        g.id !== grupoId
          ? g
          : { ...g, procedimentos: g.procedimentos.map((p) => (p.id === procId ? { ...p, ...patch } : p)) }
      )
    );
  }

  function removerProcedimento(grupoId: string, procId: string) {
    setGrupos((atual) =>
      atual.map((g) => (g.id !== grupoId ? g : { ...g, procedimentos: g.procedimentos.filter((p) => p.id !== procId) }))
    );
  }

  function adicionarProcedimento(grupoId: string) {
    setGrupos((atual) =>
      atual.map((g) => (g.id !== grupoId ? g : { ...g, procedimentos: [...g.procedimentos, novoProcedimento()] }))
    );
  }

  function solicitarEnvio() {
    if (algumGrupoIncompleto) {
      setConfirmEnvioAberto(true);
      return;
    }
    confirmarEnvio();
  }

  function confirmarEnvio() {
    setConfirmEnvioAberto(false);
    setProtocolo(`PROT-${Math.floor(100000 + Math.random() * 900000)}`);
    setEtapa("sucesso");
  }

  function reiniciar() {
    setEtapa("upload");
    setArquivos([]);
    setGrupos([]);
    setProtocolo("");
  }

  return (
    <div className={embedded ? styles.pageEmbedded : styles.page}>
      <NavBar
        brand={<strong style={{ fontSize: 18 }}>Portal do Cliente</strong>}
        items={[
          { label: "Início", href: "/", active: false },
          { label: "Autorizações", href: "/autorizacoes", active: true },
          { label: "Minhas guias", href: "/guias", active: false },
        ]}
        actions={<Avatar name={BENEFICIARIO_NOME} size="small" />}
        accessibleLabel="Navegação do portal do cliente"
      />

      <div className={styles.body}>
        <div className={styles.column}>
          <Alert
            intent="info"
            title="Solicitação em seu próprio nome"
            description={`Esta solicitação será vinculada ao beneficiário autenticado (${BENEFICIARIO_NOME}). Não é possível solicitar autorização em nome de terceiros.`}
          />

          {etapa === "upload" && (
            <div className={styles.contentCard}>
              <div className={styles.uploadHeader}>
                <h1>Nova solicitação de autorização</h1>
                <p>Envie fotos ou arquivos dos seus pedidos médicos para extrairmos os dados automaticamente.</p>
              </div>
              <div className={styles.form}>
                <FileUpload
                  label="Pedidos médicos"
                  value={arquivos}
                  onChange={setArquivos}
                  multiple
                  accept="image/*,.pdf"
                  helperText="Aceita imagens (JPG/PNG) ou PDF. Você pode anexar mais de um pedido."
                />
                <Select
                  label="Cenário de teste (simula o resultado do OCR)"
                  helperText="Este protótipo não roda OCR real — escolha qual resultado simular pra testar cada critério de aceite."
                  options={CENARIO_OPTIONS}
                  value={cenario}
                  onChange={(value) => setCenario(value as Cenario)}
                />
                <div className={styles.actionsRow}>
                  <Button
                    variant="primary"
                    label="Processar com OCR"
                    onPress={processarOCR}
                    state={arquivos.length === 0 ? "disabled" : "default"}
                  />
                </div>
              </div>
            </div>
          )}

          {etapa === "processando" && (
            <div className={styles.contentCard}>
              <div className={styles.processingWrapper}>
                <Spinner size="large" color="var(--acao-primaria)" decorative={false} accessibleLabel="Processando OCR" />
                <p>Extraindo dados do médico e dos procedimentos...</p>
              </div>
            </div>
          )}

          {etapa === "protocolo-bypass" && (
            <div className={styles.contentCard}>
              <EmptyState
                icon="receipt"
                title="Solicitação encaminhada ao protocolo de atendimento"
                description={`Identificamos mais de 5 procedimentos nesta solicitação. Os arquivos foram enviados diretamente para a esteira DAC no SolucionaMed, sem necessidade de conferência manual. Protocolo: ${protocolo}.`}
                actionLabel="Fazer nova solicitação"
                onAction={reiniciar}
              />
            </div>
          )}

          {etapa === "conferencia" && (
            <div className={styles.contentCard}>
              <div className={styles.uploadHeader}>
                <h1>Confira os dados antes de enviar</h1>
                <p>Revise os dados extraídos, complete o que faltar e ajuste os procedimentos se necessário.</p>
              </div>

              <div className={styles.form}>
                {grupos.map((grupo, indice) => (
                  <div key={grupo.id}>
                    {indice > 0 && (
                      <div className={styles.grupoDivider}>
                        <Divider />
                      </div>
                    )}
                    <div className={styles.grupoMedico}>
                      <div className={styles.grupoMedicoHeader}>
                        <Badge variant="info" label={`${grupo.procedimentos.length} procedimento(s)`} />
                        {grupoIncompleto(grupo) && <Badge variant="warning" label="Dados incompletos" />}
                      </div>

                      <div className={styles.medicoFields}>
                        <TextField
                          label="Nome do médico"
                          value={grupo.nomeMedico}
                          onChange={(nomeMedico) => atualizarGrupo(grupo.id, { nomeMedico })}
                        />
                        <TextField
                          label="CRM"
                          value={grupo.crm}
                          onChange={(crm) => atualizarGrupo(grupo.id, { crm })}
                        />
                        <Select
                          label="UF"
                          options={UF_OPTIONS}
                          value={grupo.uf}
                          onChange={(uf) => atualizarGrupo(grupo.id, { uf })}
                        />
                      </div>

                      {grupo.procedimentos.map((proc) => (
                        <div key={proc.id} className={styles.procedimentoRow}>
                          <div className={styles.procedimentoTuss}>
                            <ComboBox
                              label="Procedimento (busca por descrição)"
                              options={TUSS_CATALOGO}
                              value={proc.tussCode}
                              onChange={(tussCode) => atualizarProcedimento(grupo.id, proc.id, { tussCode })}
                              placeholder="Digite a descrição do procedimento"
                            />
                          </div>
                          <DataField label="Código TUSS" value={proc.tussCode ? `${proc.tussCode} — ${tussLabel(proc.tussCode)}` : "—"} />
                          <QuantitySelector
                            value={proc.quantidade}
                            min={1}
                            accessibleLabel={`Quantidade de ${tussLabel(proc.tussCode) || "procedimento"}`}
                            onChange={(quantidade) => atualizarProcedimento(grupo.id, proc.id, { quantidade })}
                          />
                          <Button
                            variant="link"
                            iconOnly
                            accessibleLabel="Remover procedimento"
                            leftIcon="trash"
                            onPress={() => removerProcedimento(grupo.id, proc.id)}
                          />
                        </div>
                      ))}

                      <div className={styles.addProcedimentoRow}>
                        <Button
                          variant="link"
                          leftIcon="plus"
                          label="Adicionar procedimento"
                          onPress={() => adicionarProcedimento(grupo.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className={styles.actionsRow}>
                  <Button variant="neutral" outlined label="Cancelar" onPress={reiniciar} />
                  <Button variant="primary" label="Enviar solicitação" onPress={solicitarEnvio} />
                </div>
              </div>
            </div>
          )}

          {etapa === "sucesso" && (
            <div className={styles.contentCard}>
              <div className={styles.protocolWrapper}>
                <Badge variant="accent1" label="Enviado ao SolucionaMed" />
                <h1>Solicitação enviada com sucesso</h1>
                <p>Sua solicitação foi integrada ao SolucionaMed e a guia de autorização está sendo gerada.</p>
                <span className={styles.protocolNumber}>Protocolo: {protocolo}</span>
                <Button variant="primary" label="Fazer nova solicitação" onPress={reiniciar} />
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmEnvioAberto}
        onCancel={() => setConfirmEnvioAberto(false)}
        onConfirm={confirmarEnvio}
        title="Informações incompletas"
        description="Alguns campos obrigatórios não foram preenchidos ou o OCR não conseguiu identificá-los. Deseja enviar a solicitação mesmo assim?"
        confirmLabel="Enviar assim mesmo"
        cancelLabel="Voltar"
      />
    </div>
  );
}
