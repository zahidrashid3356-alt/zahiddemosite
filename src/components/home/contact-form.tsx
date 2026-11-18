"use client";

import { useId, useState, type FormEvent } from "react";

import { buttonClass } from "@/components/ui/button-styles";
import { ApiClientError, apiFetch } from "@/lib/api-client";

type Status = "idle" | "sending" | "sent" | "error";

const FIELD =
  "mt-2 w-full rounded-xl border border-glass-line bg-surface px-5 py-4 text-base text-foreground placeholder:text-muted focus-visible:border-accent";

/**
 * The lead form. Posts to the same-origin `/api/contact` (validated there with
 * zod); the browser never calls a third party. Every control has a visible
 * label, and the outcome is announced in a polite live region.
 */
export const ContactForm = () => {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      await apiFetch<{ received: boolean }>("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
        }),
      });
      form.reset();
      setStatus("sent");
    } catch (caught) {
      setError(
        caught instanceof ApiClientError
          ? caught.message
          : "Something went wrong. Please try again.",
      );
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-card border border-glass-line bg-glass p-8 sm:p-10"
    >
      <label htmlFor={`${uid}-name`} className="block text-sm text-muted">
        Name
        <input
          id={`${uid}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          className={FIELD}
        />
      </label>

      <label htmlFor={`${uid}-email`} className="mt-6 block text-sm text-muted">
        Email
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          className={FIELD}
        />
      </label>

      <label htmlFor={`${uid}-message`} className="mt-6 block text-sm text-muted">
        Your site and where it is stuck
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={5}
          required
          maxLength={2000}
          className={FIELD}
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className={`${buttonClass("primary")} mt-8 w-full disabled:opacity-60`}
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>

      <p role="status" aria-live="polite" className="mt-4 min-h-6 text-sm text-muted">
        {status === "sent" && "Thanks. I will reply with what I would check first."}
        {status === "error" && error}
      </p>
    </form>
  );
};
