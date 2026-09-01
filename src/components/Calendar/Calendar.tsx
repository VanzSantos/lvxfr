import { useState } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./Calendar.module.css";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export interface CalendarProps {
  value: string | null;
  onChange: (value: string) => void;
  minDate?: string;
  maxDate?: string;
  disabledDate?: (value: string) => boolean;
  accessibleLabel?: string;
}

function toISO(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, "0")}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseISO(value: string): { year: number; month: number; day: number } {
  const [y, m, d] = value.split("-").map(Number);
  return { year: y, month: m - 1, day: d };
}

function todayISO(): string {
  const now = new Date();
  return toISO(now.getFullYear(), now.getMonth(), now.getDate());
}

interface DayCell {
  year: number;
  month: number;
  day: number;
  inMonth: boolean;
}

function buildDaysGrid(year: number, month: number): DayCell[] {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);
  const cells: DayCell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push({ year: d.getFullYear(), month: d.getMonth(), day: d.getDate(), inMonth: d.getMonth() === month });
  }
  return cells;
}

export function Calendar({ value, onChange, minDate, maxDate, disabledDate, accessibleLabel = "Calendário" }: CalendarProps) {
  const initial = parseISO(value ?? todayISO());
  const [viewYear, setViewYear] = useState(initial.year);
  const [viewMonth, setViewMonth] = useState(initial.month);
  const [pickerMode, setPickerMode] = useState<"days" | "months">("days");

  const today = todayISO();

  function isOutOfRange(iso: string): boolean {
    if (minDate && iso < minDate) return true;
    if (maxDate && iso > maxDate) return true;
    if (disabledDate && disabledDate(iso)) return true;
    return false;
  }

  function goToPrevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const cells = buildDaysGrid(viewYear, viewMonth);

  return (
    <div className={styles.calendar} role="group" aria-label={accessibleLabel}>
      <div className={styles.header}>
        <button type="button" className={styles.navButton} onClick={goToPrevMonth} aria-label="Mês anterior">
          <Icon name="caret-left" size="small" color="var(--icone-secundario)" decorative />
        </button>
        <button
          type="button"
          className={styles.monthLabel}
          onClick={() => setPickerMode(pickerMode === "days" ? "months" : "days")}
          aria-expanded={pickerMode === "months"}
        >
          {MESES[viewMonth]} de {viewYear}
        </button>
        <button type="button" className={styles.navButton} onClick={goToNextMonth} aria-label="Próximo mês">
          <Icon name="caret-right" size="small" color="var(--icone-secundario)" decorative />
        </button>
      </div>

      {pickerMode === "months" ? (
        <div className={styles.monthPicker}>
          <div className={styles.yearNav}>
            <button type="button" className={styles.navButton} onClick={() => setViewYear((y) => y - 1)} aria-label="Ano anterior">
              <Icon name="caret-left" size="small" color="var(--icone-secundario)" decorative />
            </button>
            <span className={styles.yearLabel}>{viewYear}</span>
            <button type="button" className={styles.navButton} onClick={() => setViewYear((y) => y + 1)} aria-label="Próximo ano">
              <Icon name="caret-right" size="small" color="var(--icone-secundario)" decorative />
            </button>
          </div>
          <div className={styles.monthsGrid}>
            {MESES.map((nome, index) => (
              <button
                key={nome}
                type="button"
                className={`${styles.monthOption} ${index === viewMonth ? styles.monthOptionSelected : ""}`}
                onClick={() => {
                  setViewMonth(index);
                  setPickerMode("days");
                }}
              >
                {nome.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className={styles.weekdays}>
            {DIAS_SEMANA.map((dia) => (
              <span key={dia} className={styles.weekday}>
                {dia}
              </span>
            ))}
          </div>
          <div className={styles.daysGrid}>
            {cells.map((cell) => {
              const iso = toISO(cell.year, cell.month, cell.day);
              const selected = value === iso;
              const isToday = today === iso;
              const outOfRange = cell.inMonth && isOutOfRange(iso);
              const disabled = !cell.inMonth || outOfRange;
              const label = `${cell.day} de ${MESES[cell.month]} de ${cell.year}`;

              return (
                <button
                  key={iso}
                  type="button"
                  className={[
                    styles.day,
                    !cell.inMonth ? styles.dayAdjacent : "",
                    outOfRange ? styles.dayDisabled : "",
                    selected ? styles.daySelected : "",
                    isToday ? styles.dayToday : "",
                  ].join(" ").trim()}
                  disabled={disabled}
                  aria-pressed={selected}
                  aria-current={isToday ? "date" : undefined}
                  aria-label={label}
                  tabIndex={cell.inMonth ? 0 : -1}
                  onClick={() => onChange(iso)}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
