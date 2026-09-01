import { useState } from "react";
import { ErrorScreen, type ErrorScreenCode } from "../../screens/ErrorScreen/ErrorScreen";
import { SegmentedControl } from "../../../components/SegmentedControl/SegmentedControl";
import styles from "./LoginScreenDemo.module.css";

export function ErrorScreenDemo() {
  const [code, setCode] = useState<ErrorScreenCode>(404);

  return (
    <div className={styles.frame} style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 12, borderBottom: "1px solid var(--borda-base)" }}>
        <SegmentedControl
          items={[
            { value: "404", label: "404" },
            { value: "500", label: "500" },
          ]}
          value={String(code)}
          onChange={(value) => setCode(Number(value) as ErrorScreenCode)}
          accessibleLabel="Código de erro"
        />
      </div>
      <ErrorScreen embedded code={code} />
    </div>
  );
}
