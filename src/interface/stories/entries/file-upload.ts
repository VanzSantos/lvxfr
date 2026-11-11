import type { StoryMeta } from "../types";
import { FileUploadDemo } from "../molecules/FileUploadDemo";

const story: StoryMeta = {
  id: "file-upload",
  order: 300,
  title: "FileUpload",
  group: "Moléculas",
  status: "draft",
  category: "data-entry",
  contractFile: "contratos/file-upload.contract.json",
  dependencies: ["Chip", "Icon", "FieldLabel", "HelperText", "Button"],
  tokensSummary: ["semantic.borda-base/erro/inativo", "semantic.acao-primaria (dragOver)", "structural.raio-pp"],
  description: "Seleção de arquivo(s) local(is) — três variantes visuais (field/button/dropzone) sobre o mesmo comportamento. Lista os arquivos selecionados via Chip removível; não faz upload de verdade, só entrega File[]. variant='button' aceita buttonVariant/buttonOutlined (reaproveita o enum do Button) pra mudar o estilo do gatilho — ex.: buttonVariant='link' pra um gatilho de texto+ícone sem fundo/borda.",
  code: `<FileUpload variant="dropzone" value={arquivos} onChange={setArquivos} multiple accept="image/*" maxSizeMB={5} />`,
  Demo: FileUploadDemo,
};

export default story;
