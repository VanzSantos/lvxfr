import { useState } from "react";
import { CallControlBar } from "../../../components/CallControlBar/CallControlBar";
import styles from "../Demo.module.css";

const MIC_DEVICES = [
  { id: "mic-1", label: "Microfone do sistema" },
  { id: "mic-2", label: "Fone bluetooth JBL" },
];

const CAMERA_DEVICES = [
  { id: "cam-1", label: "Câmera integrada" },
  { id: "cam-2", label: "Webcam USB" },
];

const SPEAKER_DEVICES = [
  { id: "spk-1", label: "Alto-falantes do sistema" },
  { id: "spk-2", label: "Fone bluetooth JBL" },
];

export function CallControlBarDemo() {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [micDeviceId, setMicDeviceId] = useState("mic-1");
  const [cameraDeviceId, setCameraDeviceId] = useState("cam-1");
  const [speakerDeviceId, setSpeakerDeviceId] = useState("spk-1");
  const [blurEnabled, setBlurEnabled] = useState(false);

  const [micOn2, setMicOn2] = useState(false);
  const [cameraOn2, setCameraOn2] = useState(false);

  return (
    <div className={styles.column}>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>
          Completo — chevron de dispositivo no microfone/câmera + configurações (alto-falante, desfoque de fundo)
        </span>
        <div style={{ padding: 32, background: "var(--fundo-secundario)", borderRadius: 8, display: "flex", justifyContent: "center" }}>
          <CallControlBar
            micOn={micOn}
            onToggleMic={() => setMicOn((v) => !v)}
            micDevices={MIC_DEVICES}
            selectedMicDeviceId={micDeviceId}
            onSelectMicDevice={setMicDeviceId}
            cameraOn={cameraOn}
            onToggleCamera={() => setCameraOn((v) => !v)}
            cameraDevices={CAMERA_DEVICES}
            selectedCameraDeviceId={cameraDeviceId}
            onSelectCameraDevice={setCameraDeviceId}
            onHangUp={() => {}}
            speakerDevices={SPEAKER_DEVICES}
            selectedSpeakerDeviceId={speakerDeviceId}
            onSelectSpeakerDevice={setSpeakerDeviceId}
            backgroundBlurEnabled={blurEnabled}
            onToggleBackgroundBlur={() => setBlurEnabled((v) => !v)}
          />
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Mínimo — sem seleção de dispositivo nem configurações (microfone e câmera desligados)</span>
        <div style={{ padding: 32, background: "var(--fundo-secundario)", borderRadius: 8, display: "flex", justifyContent: "center" }}>
          <CallControlBar
            micOn={micOn2}
            onToggleMic={() => setMicOn2((v) => !v)}
            cameraOn={cameraOn2}
            onToggleCamera={() => setCameraOn2((v) => !v)}
            onHangUp={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
