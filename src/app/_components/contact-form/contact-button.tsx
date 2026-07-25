"use client";

import { useState } from "react";
import ContactModal from "./contact-modal";

type Props = {
  children: React.ReactNode;
};

export default function ContactButton({ children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
      >
        {children}
      </button>

      <ContactModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}