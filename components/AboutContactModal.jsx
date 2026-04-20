"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin, Phone, Sparkles, X } from "lucide-react";

const AboutContactModal = ({ isOpen, activePanel, onClose, onSelectPanel }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setShouldRender(false);
    }, 520);

    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  const isAboutActive = activePanel === "about";
  const isContactActive = activePanel === "contact";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 sm:px-6">
      <button
        type="button"
        aria-label="Close information modal"
        className={`absolute inset-0 bg-slate-950/24 backdrop-blur-sm ${
          isOpen
            ? "animate-[modalBackdropIn_420ms_ease_forwards]"
            : "animate-[modalBackdropOut_360ms_ease_forwards]"
        }`}
        onClick={onClose}
      />

      <div className="relative z-10 flex w-full max-w-5xl flex-col gap-4 md:flex-row md:gap-0">
        <section
          className={`relative flex-1 overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-white/92 via-emerald-50/88 to-teal-50/80 p-6 shadow-[0_34px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-all duration-500 ${
            isOpen
              ? "animate-[panelBookLeftIn_560ms_cubic-bezier(0.2,0.9,0.2,1)_forwards]"
              : "animate-[panelBookLeftOut_420ms_cubic-bezier(0.4,0,0.2,1)_forwards]"
          } md:rounded-r-[0.8rem] ${
            isAboutActive ? "md:-translate-y-2" : "md:translate-y-2 md:opacity-92"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(110,231,183,0.22),transparent_36%),radial-gradient(circle_at_80%_20%,rgba(45,212,191,0.14),transparent_32%)]" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  <Sparkles size={12} />
                  About GoCart
                </p>
                <h3 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                  Built like a tactile showroom.
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="glass-lift rounded-full p-3 text-slate-600 hover:text-slate-900"
              >
                <X size={18} />
              </button>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-600">
              GoCart is a multi-vendor storefront focused on smart gadgets,
              polished product presentation, and a seller flow that feels clean
              instead of administrative. The interface is intentionally tactile:
              layered glass, soft lift, clear depth, and direct actions.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-white/75 bg-white/68 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_36px_rgba(148,163,184,0.14)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  What matters
                </p>
                <p className="mt-2 text-sm font-medium text-slate-800">
                  Real seller onboarding, real checkout, real order flows.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/75 bg-white/68 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_36px_rgba(148,163,184,0.14)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Visual direction
                </p>
                <p className="mt-2 text-sm font-medium text-slate-800">
                  Neumorphic glass with showroom depth and motion.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onSelectPanel("about")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isAboutActive
                    ? "bg-slate-900 text-white shadow-[0_16px_28px_rgba(15,23,42,0.22)]"
                    : "glass-lift text-slate-700"
                }`}
              >
                About
              </button>
              <button
                type="button"
                onClick={() => onSelectPanel("contact")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isContactActive
                    ? "bg-slate-900 text-white shadow-[0_16px_28px_rgba(15,23,42,0.22)]"
                    : "glass-lift text-slate-700"
                }`}
              >
                Contact
              </button>
            </div>
          </div>
        </section>

        <section
          className={`relative flex-1 overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-white/92 via-sky-50/90 to-indigo-50/78 p-6 shadow-[0_34px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-all duration-500 ${
            isOpen
              ? "animate-[panelBookRightIn_560ms_cubic-bezier(0.2,0.9,0.2,1)_forwards]"
              : "animate-[panelBookRightOut_420ms_cubic-bezier(0.4,0,0.2,1)_forwards]"
          } md:rounded-l-[0.8rem] ${
            isContactActive ? "md:-translate-y-2" : "md:translate-y-2 md:opacity-92"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.22),transparent_34%),radial-gradient(circle_at_12%_18%,rgba(129,140,248,0.14),transparent_28%)]" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-6">
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                <Mail size={12} />
                Contact
              </p>
              <h3 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                Get in touch.
              </h3>
            </div>

            <div className="grid gap-3">
              <a
                href="mailto:contact@gocart.shop"
                className="glass-lift flex items-start gap-3 rounded-[1.35rem] p-4 text-left text-slate-700"
              >
                <span className="mt-0.5 rounded-full bg-white/70 p-2 text-emerald-600 shadow-[0_10px_18px_rgba(148,163,184,0.16)]">
                  <Mail size={16} />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Email
                  </span>
                  <span className="mt-1 block text-sm font-medium text-slate-800">
                    contact@gocart.shop
                  </span>
                </span>
              </a>

              <a
                href="tel:+12124567890"
                className="glass-lift flex items-start gap-3 rounded-[1.35rem] p-4 text-left text-slate-700"
              >
                <span className="mt-0.5 rounded-full bg-white/70 p-2 text-sky-600 shadow-[0_10px_18px_rgba(148,163,184,0.16)]">
                  <Phone size={16} />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Phone
                  </span>
                  <span className="mt-1 block text-sm font-medium text-slate-800">
                    +1 (212) 456-7890
                  </span>
                </span>
              </a>

              <div className="glass-lift flex items-start gap-3 rounded-[1.35rem] p-4 text-left text-slate-700">
                <span className="mt-0.5 rounded-full bg-white/70 p-2 text-violet-600 shadow-[0_10px_18px_rgba(148,163,184,0.16)]">
                  <MapPin size={16} />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Studio
                  </span>
                  <span className="mt-1 block text-sm font-medium text-slate-800">
                    794 Francisco St, San Francisco, CA 94102
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onSelectPanel("about")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isAboutActive
                    ? "bg-slate-900 text-white shadow-[0_16px_28px_rgba(15,23,42,0.22)]"
                    : "glass-lift text-slate-700"
                }`}
              >
                About
              </button>
              <button
                type="button"
                onClick={() => onSelectPanel("contact")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isContactActive
                    ? "bg-slate-900 text-white shadow-[0_16px_28px_rgba(15,23,42,0.22)]"
                    : "glass-lift text-slate-700"
                }`}
              >
                Contact
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutContactModal;
