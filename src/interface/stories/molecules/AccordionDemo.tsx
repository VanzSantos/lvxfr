import { useState } from "react";
import { Accordion } from "../../../components/Accordion/Accordion";
import styles from "../Demo.module.css";

export function AccordionDemo() {
  const [singleOpen, setSingleOpen] = useState<string[]>(["faq-1"]);
  const [multipleOpen, setMultipleOpen] = useState<string[]>(["notas", "entrega"]);
  const [soloOpen, setSoloOpen] = useState<string[]>([]);

  const faqItems = [
    { key: "faq-1", label: "Como funciona o frete grátis?", content: <p>Pedidos acima de R$ 150 têm frete grátis pra todo o Brasil, calculado automaticamente no carrinho.</p> },
    { key: "faq-2", label: "Posso trocar um produto?", content: <p>Sim, até 30 dias após o recebimento, desde que o produto esteja sem uso e com a etiqueta original.</p> },
    { key: "faq-3", label: "Vocês entregam no exterior?", content: <p>Ainda não — hoje entregamos só dentro do Brasil.</p>, disabled: true },
  ];

  const detalhesItems = [
    { key: "notas", label: "Notas da versão", content: <p>v2.4.0 — correção de bugs no checkout e melhorias de performance no carregamento de imagens.</p> },
    { key: "entrega", label: "Prazo de entrega", content: <p>Regiões metropolitanas: 2 a 5 dias úteis. Demais regiões: 5 a 12 dias úteis.</p> },
    { key: "garantia", label: "Garantia", content: <p>12 meses de garantia do fabricante contra defeitos, mais 90 dias de garantia legal.</p> },
  ];

  const soloItem = [
    { key: "detalhes-tecnicos", label: "Ver detalhes técnicos", content: <p>Processador X, 8GB RAM, 256GB de armazenamento, tela de 6.1" OLED.</p> },
  ];

  return (
    <div className={styles.column}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>mode="single" (abrir um fecha os outros) — item disabled</span>
        <Accordion items={faqItems} openKeys={singleOpen} onChange={setSingleOpen} mode="single" />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>mode="multiple" (padrão — vários abertos ao mesmo tempo)</span>
        <Accordion items={detalhesItems} openKeys={multipleOpen} onChange={setMultipleOpen} />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Item único (Collapsible — mesmo componente, array de 1)</span>
        <Accordion items={soloItem} openKeys={soloOpen} onChange={setSoloOpen} />
      </div>
    </div>
  );
}
