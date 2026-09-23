"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/Toast";
import {
  createHomeCardAction,
  deleteHomeCardAction,
  createFooterLinkAction,
  deleteFooterLinkAction,
  updateWelcomeMessageAction,
} from "@/actions/adminSiteActions";

type Card = { id: string; icon: string | null; imageUrl: string | null; title: string; description: string };
type Link = { id: string; label: string; value: string };

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url as string;
}

export default function AdminHomeManager({
  cards,
  links,
  welcomeMessage,
}: {
  cards: Card[];
  links: Link[];
  welcomeMessage: string;
}) {
  const { show } = useToast();
  const [isPending, startTransition] = useTransition();
  const [cardImage, setCardImage] = useState<File | null>(null);

  async function handleAddCard(formData: FormData) {
    try {
      if (cardImage) {
        const url = await uploadImage(cardImage);
        formData.set("imageUrl", url);
      }
      await createHomeCardAction(formData);
      show("Card added.");
      setCardImage(null);
    } catch (e) {
      show(e instanceof Error ? e.message : "Could not add card.", false);
    }
  }

  async function handleAddLink(formData: FormData) {
    await createFooterLinkAction(formData);
    show("Link added.");
  }

  async function handleWelcome(formData: FormData) {
    await updateWelcomeMessageAction(formData);
    show("Welcome message updated.");
  }

  return (
    <>
      <h3>Homepage welcome message (shown in the footer)</h3>
      <form action={(fd) => startTransition(() => handleWelcome(fd))}>
        <textarea name="message" rows={3} defaultValue={welcomeMessage} required />
        <button className="btn secondary" style={{ marginTop: 10 }} type="submit" disabled={isPending}>
          Save message
        </button>
      </form>

      <h3 style={{ marginTop: 34 }}>Highlight cards</h3>
      <p style={{ fontSize: 13, marginTop: -6 }}>
        The three cards shown below the homepage hero. Add, edit or remove them — changes go live immediately.
      </p>
      <div className="crud-list">
        {cards.map((c) => (
          <div className="crud-row" key={c.id}>
            <div className="meta">
              <b>{c.icon} {c.title}</b>
              <span>{c.description}</span>
            </div>
            <div>
              <button
                className="icon-btn danger"
                onClick={() => startTransition(async () => { await deleteHomeCardAction(c.id); show("Card removed."); })}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="add-card-form">
        <form action={(fd) => startTransition(() => handleAddCard(fd))}>
          <label>Icon / emoji</label>
          <input name="icon" placeholder="e.g. 📚" style={{ maxWidth: 100 }} />
          <label>Title</label>
          <input name="title" placeholder="Card title" required />
          <label>Description</label>
          <textarea name="description" rows={2} placeholder="Short description" required />
          <label>Image (optional — replaces the icon if uploaded)</label>
          <input type="file" accept="image/*" onChange={(e) => setCardImage(e.target.files?.[0] ?? null)} />
          <button className="btn secondary" style={{ marginTop: 10 }} type="submit" disabled={isPending}>
            + Add card
          </button>
        </form>
      </div>

      <h3 style={{ marginTop: 34 }}>Footer — &quot;Get in touch&quot; links</h3>
      <div className="crud-list">
        {links.map((l) => (
          <div className="crud-row" key={l.id}>
            <div className="meta">
              <b>{l.label}</b>
              <span>{l.value}</span>
            </div>
            <div>
              <button
                className="icon-btn danger"
                onClick={() => startTransition(async () => { await deleteFooterLinkAction(l.id); show("Link removed."); })}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="add-card-form">
        <form action={(fd) => startTransition(() => handleAddLink(fd))}>
          <label>Label</label>
          <input name="label" placeholder="e.g. WhatsApp" required />
          <label>Value / URL</label>
          <input name="value" placeholder="e.g. +256 7..." required />
          <button className="btn secondary" style={{ marginTop: 10 }} type="submit" disabled={isPending}>
            + Add link
          </button>
        </form>
      </div>
    </>
  );
}
