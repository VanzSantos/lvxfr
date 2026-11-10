import { useState, type CSSProperties, type ReactNode } from "react";
import { Accordion } from "../../../components/Accordion/Accordion";
import { resolveToken, type ResolvedToken } from "./tokenResolver";
import styles from "./ContractSpecs.module.css";

interface ContractProp {
  name: string;
  type?: string;
  required?: boolean;
  default?: unknown;
  enum?: string[];
  description?: string;
  requiredWhen?: string;
}

export interface Contract {
  name: string;
  originalName?: string;
  oneLiner?: string;
  category?: string;
  status?: string;
  whenToUse?: string;
  whenNotToUse?: string;
  anatomy?: string[];
  dependencies?: string[];
  props?: ContractProp[];
  variants?: string[];
  states?: string[];
  variantTokenMap?: Record<string, unknown>;
  tokensAllowed?: Record<string, unknown>;
  a11y?: { role?: string; requiredAria?: string[]; keyboard?: string[]; contrastMin?: string; notes?: string };
  events?: { status?: string } & Record<string, unknown>;
  composition?: { canContain?: string[]; canBeContainedBy?: string[]; doNotCombine?: string[] };
  forbidden?: string[];
  decisions?: string[];
}

const TOKEN_GROUP_LABEL: Record<string, string> = {
  background: "Fundos",
  text: "Textos",
  border: "Bordas",
  radius: "Raios",
  spacing: "Espaçamentos",
  typography: "Tipografia",
  focusRing: "Anel de foco",
  iconSize: "Tamanhos de ícone",
  iconColor: "Cores de ícone",
  icon: "Ícones",
  shadow: "Sombras",
  color: "Cores",
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </section>
  );
}

function List({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return <p className={styles.muted}>—</p>;
  return (
    <ul className={styles.list}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function Chips({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return <span className={styles.muted}>—</span>;
  return (
    <span className={styles.chips}>
      {items.map((item) => (
        <code key={item} className={styles.chip}>
          {item}
        </code>
      ))}
    </span>
  );
}

function formatDefault(value: unknown): string {
  if (value === undefined) return "—";
  return typeof value === "string" ? value : JSON.stringify(value);
}

/* ---------- Tokens: cada categoria vira um diagrama do que o token É ---------- */

function pxOf(value: string | null): number {
  return value ? parseFloat(value) : 0;
}

function TokenVisual({ token }: { token: ResolvedToken }) {
  if (token.kind === "color") {
    return (
      <span className={styles.swatches}>
        <span className={styles.swatchGroup}>
          <span className={styles.swatch} style={{ background: token.light ?? undefined }} />
          <code>{token.light}</code>
          <span className={styles.muted}>claro</span>
        </span>
        <span className={styles.swatchGroup}>
          <span className={styles.swatch} style={{ background: token.dark ?? undefined }} />
          <code>{token.dark}</code>
          <span className={styles.muted}>escuro</span>
        </span>
      </span>
    );
  }

  if (token.kind === "length") {
    const px = pxOf(token.light);
    const value = <code>{token.light}</code>;
    if (token.name.startsWith("raio")) {
      return (
        <span className={styles.visualRow}>
          <span className={styles.radiusBox} style={{ borderRadius: token.light ?? undefined }} />
          {value}
        </span>
      );
    }
    if (token.name.startsWith("icone")) {
      return (
        <span className={styles.visualRow}>
          <span className={styles.sizeBox} style={{ width: px, height: px }} />
          {value}
        </span>
      );
    }
    if (token.name.startsWith("foco")) {
      return (
        <span className={styles.visualRow}>
          <span className={styles.ring} style={{ borderTopWidth: px }} />
          {value}
        </span>
      );
    }
    return (
      <span className={styles.visualRow}>
        <span className={styles.bar} style={{ width: Math.min(px, 240) }} />
        {value}
      </span>
    );
  }

  if (token.kind === "shadow") {
    return (
      <span className={styles.visualRow}>
        <span className={styles.shadowBox} style={{ boxShadow: token.light ?? undefined }} />
        <code className={styles.wrap}>{token.light}</code>
      </span>
    );
  }

  if (token.kind === "type" && token.type) {
    const sample: CSSProperties = {
      fontFamily: token.type.family,
      fontSize: token.type.size,
      fontWeight: token.type.weight,
      lineHeight: token.type.lineHeight,
    };
    return (
      <span className={styles.typeRow}>
        <span style={sample}>Aa Texto de exemplo</span>
        <code className={styles.wrap}>
          {token.type.size} / {token.type.lineHeight} · peso {token.type.weight}
        </code>
      </span>
    );
  }

  return <code>{token.light ?? "não encontrado em tokens.css"}</code>;
}

function TokenGroup({ groupKey, paths }: { groupKey: string; paths: string[] }) {
  return (
    <div className={styles.tokenGroup}>
      <h4 className={styles.tokenGroupTitle}>{TOKEN_GROUP_LABEL[groupKey] ?? groupKey}</h4>
      <div className={styles.tokenRows}>
        {paths.map((path) => {
          const token = resolveToken(path);
          return (
            <div key={path} className={styles.tokenRow}>
              <code className={styles.tokenName}>{path}</code>
              <TokenVisual token={token} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function stringsOf(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(stringsOf);
  return [];
}

export function ContractSpecs({ contract }: { contract: Contract }) {
  const [openDecisions, setOpenDecisions] = useState<string[]>([]);
  const tokenGroups = Object.entries(contract.tokensAllowed ?? {})
    .map(([key, value]) => [key, stringsOf(value)] as const)
    .filter(([, paths]) => paths.length > 0);
  const hasVariantMap = contract.variantTokenMap && Object.keys(contract.variantTokenMap).length > 0;

  return (
    <div className={styles.specs}>
      <Section title="Visão geral">
        {contract.oneLiner && <p className={styles.lead}>{contract.oneLiner}</p>}
        <dl className={styles.facts}>
          <dt>Categoria</dt>
          <dd>{contract.category ?? "—"}</dd>
          <dt>Status</dt>
          <dd>{contract.status ?? "—"}</dd>
          <dt>Dependências</dt>
          <dd>
            <Chips items={contract.dependencies} />
          </dd>
          <dt>Eventos</dt>
          <dd>{contract.events?.status ?? "definidos nas props"}</dd>
        </dl>
        <div className={styles.twoCols}>
          <div className={styles.callout}>
            <strong>Quando usar</strong>
            <p>{contract.whenToUse ?? "—"}</p>
          </div>
          <div className={styles.callout}>
            <strong>Quando não usar</strong>
            <p>{contract.whenNotToUse ?? "—"}</p>
          </div>
        </div>
      </Section>

      <Section title="Anatomia">
        {contract.anatomy && contract.anatomy.length > 0 ? (
          <ol className={styles.anatomy}>
            {contract.anatomy.map((part, index) => (
              <li key={index}>
                <span className={styles.anatomyIndex}>{index + 1}</span>
                <span>{part}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className={styles.muted}>—</p>
        )}
      </Section>

      <Section title="Props">
        {contract.props && contract.props.length > 0 ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Prop</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Padrão</th>
                  <th scope="col">Descrição</th>
                </tr>
              </thead>
              <tbody>
                {contract.props.map((prop) => (
                  <tr key={prop.name}>
                    <td>
                      <code>{prop.name}</code>
                      {prop.required && <span className={styles.required}> obrigatória</span>}
                      {prop.requiredWhen && <div className={styles.muted}>obrigatória se {prop.requiredWhen}</div>}
                    </td>
                    <td>{prop.enum ? <Chips items={prop.enum} /> : <code>{prop.type ?? "—"}</code>}</td>
                    <td>
                      <code>{formatDefault(prop.default)}</code>
                    </td>
                    <td>{prop.description ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={styles.muted}>Sem props.</p>
        )}
      </Section>

      <Section title="Variantes e estados">
        <dl className={styles.facts}>
          <dt>Variantes</dt>
          <dd>
            <Chips items={contract.variants} />
          </dd>
          <dt>Estados</dt>
          <dd>
            <Chips items={contract.states} />
          </dd>
        </dl>
        {hasVariantMap && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Variante</th>
                  <th scope="col">Token</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(contract.variantTokenMap!).map(([variant, value]) => (
                  <tr key={variant}>
                    <td>
                      <code>{variant}</code>
                    </td>
                    <td>
                      <code>{typeof value === "string" ? value : JSON.stringify(value)}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="Tokens">
        {tokenGroups.length === 0 ? (
          <p className={styles.muted}>Nenhum token declarado.</p>
        ) : (
          tokenGroups.map(([key, paths]) => <TokenGroup key={key} groupKey={key} paths={paths} />)
        )}
        <p className={styles.muted}>
          Valores lidos de <code>tokens/tokens.css</code>; cores aparecem nos dois temas.
        </p>
      </Section>

      <Section title="Acessibilidade">
        <dl className={styles.facts}>
          <dt>Role</dt>
          <dd>{contract.a11y?.role ?? "—"}</dd>
          <dt>Contraste mínimo</dt>
          <dd>{contract.a11y?.contrastMin ?? "—"}</dd>
        </dl>
        <h4 className={styles.subTitle}>ARIA obrigatório</h4>
        <List items={contract.a11y?.requiredAria} />
        <h4 className={styles.subTitle}>Teclado</h4>
        <List items={contract.a11y?.keyboard} />
        {contract.a11y?.notes && (
          <div className={styles.callout}>
            <strong>Notas</strong>
            <p>{contract.a11y.notes}</p>
          </div>
        )}
      </Section>

      <Section title="Composição">
        <h4 className={styles.subTitle}>Pode conter</h4>
        <List items={contract.composition?.canContain} />
        <h4 className={styles.subTitle}>Pode estar dentro de</h4>
        <List items={contract.composition?.canBeContainedBy} />
        <h4 className={styles.subTitle}>Não combinar com</h4>
        <List items={contract.composition?.doNotCombine} />
      </Section>

      <Section title="Proibido">
        <List items={contract.forbidden} />
      </Section>

      {contract.decisions && contract.decisions.length > 0 && (
        <Section title={`Decisões (${contract.decisions.length})`}>
          <Accordion
            mode="multiple"
            openKeys={openDecisions}
            onChange={setOpenDecisions}
            items={contract.decisions.map((decision, index) => ({
              key: String(index),
              // título = trecho inicial da decisão; o texto inteiro fica no painel
              label: decision.length > 110 ? `${decision.slice(0, 107)}…` : decision,
              content: <p className={styles.decision}>{decision}</p>,
            }))}
          />
        </Section>
      )}
    </div>
  );
}
