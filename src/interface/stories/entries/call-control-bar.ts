import type { StoryMeta } from "../types";
import { CallControlBarDemo } from "../molecules/CallControlBarDemo";

const story: StoryMeta = {
  id: "call-control-bar",
  order: 420,
  title: "CallControlBar",
  group: "Moléculas",
  status: "draft",
  category: "action",
  contractFile: "contratos/call-control-bar.contract.json",
  dependencies: ["Icon", "Popover", "Switch"],
  tokensSummary: ["semantic.fundo-invertido/acao-destrutiva/acao-destrutiva-sobreposta/texto-invertido/acao-secundaria", "structural.raio-circular/raio-xp/foco-espessura/espaco-pp/p/xp/icone-medio/pequeno"],
  description: "Fileira de botões circulares pra controlar videochamada — encerrar (sempre vermelho, sem toggle), microfone e câmera (troca de ícone conforme ligado/mudo + chevron adjacente opcional, formando uma cápsula única, pra escolher dispositivo via Popover tone='dark') e configurações (Popover tone='dark' com alto-falante + desfoque de fundo, opcional). 100% controlado, sem confirmação embutida no onHangUp.",
  code: `<CallControlBar
  micOn={micOn} onToggleMic={() => setMicOn(v => !v)} micDevices={mics} selectedMicDeviceId={micId} onSelectMicDevice={setMicId}
  cameraOn={cameraOn} onToggleCamera={() => setCameraOn(v => !v)} cameraDevices={cams} selectedCameraDeviceId={camId} onSelectCameraDevice={setCamId}
  onHangUp={encerrarChamada}
  speakerDevices={speakers} selectedSpeakerDeviceId={spkId} onSelectSpeakerDevice={setSpkId}
  backgroundBlurEnabled={blur} onToggleBackgroundBlur={() => setBlur(v => !v)}
/>`,
  Demo: CallControlBarDemo,
};

export default story;
