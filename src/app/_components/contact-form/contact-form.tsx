"use client";

import { useState } from "react";
import ContactField from "./contact-field";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formElement = e.currentTarget; // зберігаємо ДО await
    const form = new FormData(formElement);

    const data = {
      name: form.get("name"),
      email: form.get("email"),
      company: form.get("company"),
      message: form.get("message"),
    };

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Щось пішло не так");
      }

      setStatus("success");
      formElement.reset(); // використовуємо збережене посилання
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Не вдалося надіслати повідомлення",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="mt-6 rounded-xl bg-emerald-50 px-4 py-6 text-center">
        <p className="font-semibold text-emerald-700">
          Thank you! Your message has been sent.
        </p>
        <p className="mt-1 text-sm text-emerald-600">
          We&apos;ll reply within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <ContactField
        label="Full name"
        placeholder="John Smith"
        name="name"
        required
      />

      <ContactField
        label="Work email"
        placeholder="john@company.com"
        type="email"
        name="email"
        required
      />

      <ContactField label="Company" placeholder="Company name" name="company" />

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Message
        </label>

        <textarea
          name="message"
          rows={4}
          required
          placeholder="Tell us about your business..."
          className="
            w-full resize-none rounded-xl
            border border-slate-200
            px-4 py-3
            outline-none
            focus:border-sky-500
          "
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="
          w-full rounded-xl 
          bg-sky-600 px-5 py-3
          font-semibold text-white
          transition hover:bg-sky-700
          disabled:cursor-not-allowed disabled:opacity-60
        "
      >
        {status === "loading" ? "Надсилаємо..." : "Send message"}
      </button>
    </form>
  );
}
