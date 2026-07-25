"use client";

import { createPortal } from "react-dom";
import { useSyncExternalStore } from "react";
import ContactForm from "./contact-form";

type Props = {
  open: boolean;
  onClose: () => void;
};

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,   // на клієнті — завжди true
    () => false   // на сервері (SSR) — false
  );
}

export default function ContactModal({ open, onClose }: Props) {
  const mounted = useMounted();

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-3xl bg-white shadow-2xl z-50"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Contact us</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tell us about your business. We usually reply within 24 hours.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-5">
          <ContactForm />
        </div>
      </div>
    </div>,
    document.body
  );
}