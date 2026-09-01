import { useState } from "react";
import { Icon } from "../Icon/Icon";
import { Popover } from "../Popover/Popover";
import { Switch } from "../Switch/Switch";
import styles from "./CallControlBar.module.css";

export interface CallDevice {
  id: string;
  label: string;
}

export interface CallControlBarProps {
  micOn: boolean;
  onToggleMic: () => void;
  micDevices?: CallDevice[];
  selectedMicDeviceId?: string;
  onSelectMicDevice?: (deviceId: string) => void;

  cameraOn: boolean;
  onToggleCamera: () => void;
  cameraDevices?: CallDevice[];
  selectedCameraDeviceId?: string;
  onSelectCameraDevice?: (deviceId: string) => void;

  onHangUp: () => void;

  speakerDevices?: CallDevice[];
  selectedSpeakerDeviceId?: string;
  onSelectSpeakerDevice?: (deviceId: string) => void;
  backgroundBlurEnabled?: boolean;
  onToggleBackgroundBlur?: () => void;
}

interface DeviceMenuProps {
  devices: CallDevice[];
  selectedId?: string;
  onSelect: (deviceId: string) => void;
  accessibleLabel: string;
}

function DeviceMenu({ devices, selectedId, onSelect, accessibleLabel }: DeviceMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      role="menu"
      placement="top"
      tone="dark"
      accessibleLabel={accessibleLabel}
      open={open}
      onOpenChange={setOpen}
      content={
        <div className={styles.deviceMenu}>
          {devices.map((device) => (
            <button
              key={device.id}
              type="button"
              className={styles.deviceItem}
              onClick={() => {
                onSelect(device.id);
                setOpen(false);
              }}
            >
              <Icon
                name="check"
                size="small"
                color={device.id === selectedId ? "var(--acao-secundaria)" : "transparent"}
                decorative
              />
              {device.label}
            </button>
          ))}
        </div>
      }
    >
      <button type="button" className={styles.chevron} aria-label={accessibleLabel}>
        <Icon name="caret-up" size="small" color="var(--texto-invertido)" decorative />
      </button>
    </Popover>
  );
}

export function CallControlBar({
  micOn,
  onToggleMic,
  micDevices,
  selectedMicDeviceId,
  onSelectMicDevice,
  cameraOn,
  onToggleCamera,
  cameraDevices,
  selectedCameraDeviceId,
  onSelectCameraDevice,
  onHangUp,
  speakerDevices,
  selectedSpeakerDeviceId,
  onSelectSpeakerDevice,
  backgroundBlurEnabled,
  onToggleBackgroundBlur,
}: CallControlBarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const showMicDevices = Boolean(micDevices && micDevices.length > 0 && onSelectMicDevice);
  const showCameraDevices = Boolean(cameraDevices && cameraDevices.length > 0 && onSelectCameraDevice);
  const showSettings = Boolean(
    (speakerDevices && speakerDevices.length > 0 && onSelectSpeakerDevice) ||
      onToggleBackgroundBlur !== undefined
  );

  return (
    <div className={styles.bar} role="group" aria-label="Controles da chamada">
      <button type="button" className={`${styles.control} ${styles.hangUp}`} onClick={onHangUp} aria-label="Encerrar chamada">
        <Icon name="phone-x" size="medium" color="var(--texto-invertido)" decorative />
      </button>

      <div className={styles.cluster}>
        <button
          type="button"
          className={`${styles.control}${showMicDevices ? ` ${styles.clustered}` : ""}`}
          onClick={onToggleMic}
          aria-label={micOn ? "Silenciar microfone" : "Ativar microfone"}
          aria-pressed={!micOn}
        >
          <Icon name={micOn ? "microphone" : "microphone-slash"} size="medium" color="var(--texto-invertido)" decorative />
        </button>
        {showMicDevices && (
          <DeviceMenu
            devices={micDevices!}
            selectedId={selectedMicDeviceId}
            onSelect={onSelectMicDevice!}
            accessibleLabel="Escolher microfone"
          />
        )}
      </div>

      <div className={styles.cluster}>
        <button
          type="button"
          className={`${styles.control}${showCameraDevices ? ` ${styles.clustered}` : ""}`}
          onClick={onToggleCamera}
          aria-label={cameraOn ? "Desligar câmera" : "Ligar câmera"}
          aria-pressed={!cameraOn}
        >
          <Icon name={cameraOn ? "video-camera" : "video-camera-slash"} size="medium" color="var(--texto-invertido)" decorative />
        </button>
        {showCameraDevices && (
          <DeviceMenu
            devices={cameraDevices!}
            selectedId={selectedCameraDeviceId}
            onSelect={onSelectCameraDevice!}
            accessibleLabel="Escolher câmera"
          />
        )}
      </div>

      {showSettings && (
        <Popover
          role="dialog"
          placement="top-end"
          tone="dark"
          accessibleLabel="Configurações da chamada"
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          content={
            <div className={styles.settingsPanel}>
              {speakerDevices && speakerDevices.length > 0 && onSelectSpeakerDevice && (
                <div className={styles.settingsField}>
                  <span className={styles.settingsLabel}>Alto-falante</span>
                  <div className={styles.deviceMenu}>
                    {speakerDevices.map((device) => (
                      <button
                        key={device.id}
                        type="button"
                        className={styles.deviceItem}
                        onClick={() => onSelectSpeakerDevice(device.id)}
                      >
                        <Icon
                          name="check"
                          size="small"
                          color={device.id === selectedSpeakerDeviceId ? "var(--acao-secundaria)" : "transparent"}
                          decorative
                        />
                        {device.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {onToggleBackgroundBlur !== undefined && (
                <div className={styles.settingsRow}>
                  <span className={styles.settingsLabel}>Desfoque de fundo</span>
                  <Switch checked={backgroundBlurEnabled ?? false} onChange={() => onToggleBackgroundBlur()} accessibleLabel="Desfoque de fundo" />
                </div>
              )}
            </div>
          }
        >
          <button type="button" className={styles.control} aria-label="Configurações da chamada">
            <Icon name="gear" size="medium" color="var(--texto-invertido)" decorative />
          </button>
        </Popover>
      )}
    </div>
  );
}
