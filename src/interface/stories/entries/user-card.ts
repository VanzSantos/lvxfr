import type { StoryMeta } from "../types";
import { UserCardDemo } from "../molecules/UserCardDemo";

const story: StoryMeta = {
  id: "user-card",
  order: 400,
  title: "UserCard",
  group: "Moléculas",
  status: "draft",
  category: "action",
  contractFile: "contratos/user-card.contract.json",
  dependencies: ["Avatar", "StackedText", "Icon"],
  tokensSummary: ["semantic.fundo-secundario/superficie", "structural.raio-p/espaco-pp/foco-espessura"],
  description: "Gatilho de identificação do usuário — Avatar + nome/e-mail (StackedText) + caret-up, sem borda, fundo igual ao fundo da página. Extraído do 'User Card' que já existia duplicado em SideNavDemo/BackofficeTemplate. Não envolve Popover — é só o cartão, o consumidor decide o que abre (mesmo racional de onInfo/onSettings em ActionCard). Usa forwardRef pra funcionar como children direto de Popover.",
  code: `<Popover placement="top-start" accessibleLabel="Menu da conta" content={<MenuContent />}>
  <UserCard name="Ana Souza" secondaryText="ana.souza@selenesdk.com" />
</Popover>`,
  Demo: UserCardDemo,
};

export default story;
