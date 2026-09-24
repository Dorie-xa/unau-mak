"use client";

import { useState, useRef, useEffect } from "react";
import { adminLogoutAction } from "@/actions/adminAuthActions";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminUserMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Admin account menu"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #2f6bff, #f2b705)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 13,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {initials(name) || "A"}
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 44,
            background: "#fff",
            border: "1px solid var(--line)",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            minWidth: 180,
            zIndex: 20,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, borderBottom: "1px solid var(--line)" }}>
            {name}
          </div>
          <form action={adminLogoutAction}>
            <button
              type="submit"
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 14px",
                background: "none",
                border: "none",
                color: "#c5192d",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
