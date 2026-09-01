import {
  Info,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeSlash,
  Check,
  Minus,
  CheckCircle,
  WarningCircle,
  XCircle,
  X,
  CaretDown,
  CaretRight,
  CaretUp,
  CaretLeft,
  ArrowSquareOut,
  User,
  Funnel,
  PencilSimple,
  Plus,
  MagnifyingGlass,
  DownloadSimple,
  Columns,
  Trash,
  Rows,
  Image,
  Equals,
  List,
  DotsThree,
  House,
  Star,
  StarHalf,
  UploadSimple,
  CopySimple,
  Gear,
  PhoneX,
  Microphone,
  MicrophoneSlash,
  VideoCamera,
  VideoCameraSlash,
  Flag,
  Hourglass,
  CurrencyCircleDollar,
  ShoppingCart,
  Receipt,
  CalendarBlank,
  Sun,
  Moon,
  IdentificationCard,
  Sparkle,
  Desktop,
  DeviceMobile,
  Clock,
  Bell,
} from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

/**
 * Registro fechado — cresce sob demanda de um consumidor real, nunca
 * especulativamente (contratos/icon.contract.json, decisions).
 */
const REGISTRY: Record<string, PhosphorIcon> = {
  info: Info,
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  eye: Eye,
  "eye-slash": EyeSlash,
  check: Check,
  minus: Minus,
  "check-circle": CheckCircle,
  "warning-circle": WarningCircle,
  "x-circle": XCircle,
  x: X,
  "caret-down": CaretDown,
  "caret-right": CaretRight,
  "caret-up": CaretUp,
  "caret-left": CaretLeft,
  "arrow-square-out": ArrowSquareOut,
  user: User,
  funnel: Funnel,
  "pencil-simple": PencilSimple,
  plus: Plus,
  "magnifying-glass": MagnifyingGlass,
  "download-simple": DownloadSimple,
  columns: Columns,
  trash: Trash,
  rows: Rows,
  image: Image,
  equals: Equals,
  list: List,
  "dots-three": DotsThree,
  house: House,
  star: Star,
  "star-half": StarHalf,
  "upload-simple": UploadSimple,
  "copy-simple": CopySimple,
  gear: Gear,
  "phone-x": PhoneX,
  microphone: Microphone,
  "microphone-slash": MicrophoneSlash,
  "video-camera": VideoCamera,
  "video-camera-slash": VideoCameraSlash,
  flag: Flag,
  hourglass: Hourglass,
  "currency-circle-dollar": CurrencyCircleDollar,
  "shopping-cart": ShoppingCart,
  receipt: Receipt,
  calendar: CalendarBlank,
  sun: Sun,
  moon: Moon,
  "identification-card": IdentificationCard,
  sparkle: Sparkle,
  desktop: Desktop,
  "device-mobile": DeviceMobile,
  clock: Clock,
  bell: Bell,
};

export type IconName = keyof typeof REGISTRY;

/** Nomes disponíveis no registro fechado — usado pela biblioteca de ícones da DS Playground. */
export const ICON_NAMES = Object.keys(REGISTRY) as IconName[];
export type IconSize = "small" | "medium" | "large" | "extraLarge";
export type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";

const SIZE_VAR: Record<IconSize, string> = {
  small: "var(--icone-pequeno)",
  medium: "var(--icone-medio)",
  large: "var(--icone-grande)",
  extraLarge: "var(--icone-extra-grande)",
};

export interface IconProps {
  name: IconName;
  size?: IconSize;
  /** Token semântico de cor, já resolvido para um valor CSS (ex.: "var(--icone-secundario)"). */
  color: string;
  weight?: IconWeight;
  decorative?: boolean;
  accessibleLabel?: string;
}

export function Icon({
  name,
  size = "medium",
  color,
  weight = "regular",
  decorative = true,
  accessibleLabel,
}: IconProps) {
  if (!decorative && !accessibleLabel) {
    throw new Error(
      `Icon "${name}": accessibleLabel é obrigatório quando decorative=false.`
    );
  }

  const Glyph = REGISTRY[name];
  if (!Glyph) {
    throw new Error(`Icon: "${name}" não está no registro fechado de ícones.`);
  }

  return (
    <Glyph
      size={SIZE_VAR[size]}
      color={color}
      weight={weight}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={decorative ? undefined : accessibleLabel}
      role={decorative ? undefined : "img"}
    />
  );
}
