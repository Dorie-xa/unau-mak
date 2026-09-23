"use client";

import { useState } from "react";
import { SDGS } from "@/lib/sdgs";
import { useToast } from "./Toast";

export default function SdgPicker() {
  const [selected, setSelected] = useState<number[]>([]);
  const { show } = useToast();

  function toggle(n: number) {
    setSelected((prev) => {
      if (prev.includes(n)) return prev.filter((x) => x !== n);
      if (prev.length >= 5) {
        show("You can pick up to 5 SDGs. Deselect one first.", false);
        return prev;
      }
      return [...prev, n];
    });
  }

  return (
    <div>
      <label>
        Which SDGs are you most passionate about?{" "}
        <span style={{ fontWeight: 400, color: "var(--ink-soft)" }}>(pick 3–5)</span>
      </label>
      <div className="sdg-grid">
        {SDGS.map((s) => (
          <div
            key={s.n}
            className={`sdg ${selected.includes(s.n) ? "sel" : ""}`}
            onClick={() => toggle(s.n)}
          >
            <span className="dot" style={{ background: s.color }} />
            {s.n}. {s.name}
            {selected.includes(s.n) && <input type="hidden" name="sdgs" value={s.n} />}
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>
        Selected: {selected.length} / 5 {selected.length < 3 && "(pick at least 3 before submitting)"}
      </p>
    </div>
  );
}
