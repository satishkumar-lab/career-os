import { Check } from "lucide-react";

import { CareerOsLogo } from "@/components/auth/careeros-logo";
import {
  APP_DESCRIPTION,
  APP_TAGLINE,
  LOGIN_FEATURES,
  LOGIN_WELCOME_TITLE,
} from "@/lib/auth/branding";
import { cn } from "@/lib/utils";

export function LoginHeroPanel({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative hidden overflow-hidden px-12 py-14 lg:flex lg:flex-col lg:justify-between",
        className
      )}
      style={{
        backgroundImage: "linear-gradient(145deg, #0b1220 0%, #111827 45%, #0f172a 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-24 -left-24 size-72 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #17a5fb 0%, transparent 70%)" }}
        />
        <div
          className="absolute right-0 bottom-0 size-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #e80584 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative animate-in fade-in slide-in-from-left-4 duration-700">
        <CareerOsLogo layout="horizontal" tone="inverse" size="md" showTagline={false} />
      </div>

      <div className="relative max-w-md animate-in fade-in slide-in-from-left-6 duration-700 delay-150">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-white/50 uppercase">
          {APP_TAGLINE}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white xl:text-[42px] xl:leading-[1.1]">
          {LOGIN_WELCOME_TITLE}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-white/70">{APP_DESCRIPTION}</p>

        <ul className="mt-10 space-y-3.5">
          {LOGIN_FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-[14px] text-white/85">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Check className="size-3 text-primary" strokeWidth={2.5} />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-white/40">© {new Date().getFullYear()} CareerOS</p>
    </section>
  );
}
