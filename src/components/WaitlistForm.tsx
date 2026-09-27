import { CheckCircleIcon, MapPinIcon } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { content, type Role } from "@/content";
import { onChooseRole } from "@/lib/events";
import { cn } from "@/lib/utils";
import { joinWaitlist, ORGANIZATION_MAX, validate, type FieldErrors, type SubmitResult, type WaitlistInput } from "@/lib/waitlist";

const f = content.form;
const EMPTY: WaitlistInput = { email: "", role: "", organization: "", inRegion: "", consent: false, website: "" };
type Field = keyof FieldErrors;
const ORDER: Field[] = ["email", "role", "organization", "inRegion", "consent"];

export function WaitlistForm() {
  const id = useId();
  const [data, setData] = useState<WaitlistInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [done, setDone] = useState<SubmitResult | null>(null);
  const refs = useRef<Partial<Record<Field, HTMLElement | null>>>({});
  const doneRef = useRef<HTMLHeadingElement>(null);

  // The pitcher and builder cards pre-select a role on the way down.
  useEffect(() => onChooseRole((role) => setData((d) => ({ ...d, role }))), []);
  useEffect(() => { if (done) doneRef.current?.focus(); }, [done]);

  function set<K extends keyof WaitlistInput>(key: K, value: WaitlistInput[K]) {
    const next = { ...data, [key]: value };
    setData(next);
    // Once a field has an error, re-check it as it changes so the message clears when fixed.
    if (key in errors) setErrors((e) => ({ ...e, [key]: validate(next)[key as Field] }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    const found = validate(data);
    setErrors(found);
    const first = ORDER.find((k) => found[k]);
    if (first) {
      refs.current[first]?.focus();
      return;
    }
    setStatus("submitting");
    try {
      setDone(await joinWaitlist(data));
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  const err = (k: Field) => (errors[k] ? f.errors[errors[k]!] : undefined);
  const errId = (k: Field) => `${id}-${k}-error`;
  const describedBy = (k: Field, extra?: string) => [extra, errors[k] ? errId(k) : undefined].filter(Boolean).join(" ") || undefined;
  const hasErrors = ORDER.some((k) => errors[k]);

  if (done) {
    return (
      <div className="on-light rounded-[28px] bg-card p-7 text-ink md:p-10" role="status">
        <CheckCircleIcon size={48} weight="fill" className="text-brand" aria-hidden="true" />
        <h3 ref={doneRef} tabIndex={-1} className="mt-5 text-[clamp(2rem,4vw,2.75rem)] font-bold outline-none">
          {done === "duplicate" ? f.success.duplicateTitle : f.success.title}
        </h3>
        <p className="mt-3 text-lg text-ink/75">{f.success.body}</p>
        {data.inRegion === "no" && <p className="mt-4 flex gap-2 text-ink/75"><MapPinIcon size={20} weight="fill" className="mt-0.5 shrink-0 text-brand-ink" aria-hidden="true" />{f.region.outsideNote}</p>}
      </div>
    );
  }

  const inputCls = (k: Field) =>
    cn(
      "h-12 w-full rounded-[12px] border bg-white px-4 text-base text-ink placeholder:text-muted outline-none transition-[border-color,box-shadow] duration-150 focus:border-ink focus:ring-3 focus:ring-ink/15",
      errors[k] ? "border-danger" : "border-[#8a8a91]",
    );

  return (
    <form noValidate onSubmit={submit} className="on-light relative rounded-[28px] bg-card p-6 text-ink md:p-9" aria-describedby={hasErrors ? `${id}-summary` : undefined}>
      <p id={`${id}-summary`} className={cn("mb-5 rounded-[12px] bg-danger/8 px-4 py-3 text-sm font-medium text-danger", !hasErrors && "sr-only")} aria-live="polite">
        {hasErrors ? f.errors.summary : ""}
      </p>

      <div className="flex flex-col gap-6">
        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-email`} className="text-sm font-semibold">{f.email.label}</Label>
          <input
            ref={(n) => { refs.current.email = n; }}
            id={`${id}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={f.email.placeholder}
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => setData((d) => ({ ...d, email: d.email.trim() }))}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            aria-required="true"
            className={inputCls("email")}
          />
          <ErrorText id={errId("email")} text={err("email")} />
        </div>

        {/* Role */}
        <fieldset className="flex flex-col gap-3">
          <legend id={`${id}-role-legend`} className="mb-3 text-sm font-semibold">{f.role.legend}</legend>
          <RadioGroup
            value={data.role}
            onValueChange={(v) => set("role", v as Role)}
            aria-labelledby={`${id}-role-legend`}
            aria-required="true"
            aria-invalid={!!errors.role}
            aria-describedby={describedBy("role")}
            className="grid grid-cols-1 gap-2 sm:grid-cols-3"
          >
            {f.role.options.map((o, i) => (
              <Choice key={o.value} id={`${id}-role-${o.value}`} value={o.value} label={o.label} invalid={!!errors.role}
                itemRef={i === 0 ? (n) => { refs.current.role = n; } : undefined} />
            ))}
          </RadioGroup>
          <ErrorText id={errId("role")} text={err("role")} />
        </fieldset>

        {/* School or workplace */}
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-org`} className="text-sm font-semibold">{f.organization.label}</Label>
          <input
            ref={(n) => { refs.current.organization = n; }}
            id={`${id}-org`}
            type="text"
            autoComplete="organization"
            maxLength={ORGANIZATION_MAX}
            value={data.organization}
            onChange={(e) => set("organization", e.target.value)}
            aria-invalid={!!errors.organization}
            aria-describedby={describedBy("organization", `${id}-org-hint`)}
            className={inputCls("organization")}
          />
          <p id={`${id}-org-hint`} className="text-sm text-muted">{f.organization.hint}</p>
          <ErrorText id={errId("organization")} text={err("organization")} />
        </div>

        {/* In the region */}
        <fieldset className="flex flex-col gap-3">
          <legend id={`${id}-region-legend`} className="mb-3 text-sm font-semibold">{f.region.legend}</legend>
          <RadioGroup
            value={data.inRegion}
            onValueChange={(v) => set("inRegion", v as "yes" | "no")}
            aria-labelledby={`${id}-region-legend`}
            aria-required="true"
            aria-invalid={!!errors.inRegion}
            aria-describedby={describedBy("inRegion", data.inRegion === "no" ? `${id}-outside` : undefined)}
            className="grid grid-cols-2 gap-2"
          >
            <Choice id={`${id}-region-yes`} value="yes" label={f.region.yes} invalid={!!errors.inRegion} itemRef={(n) => { refs.current.inRegion = n; }} />
            <Choice id={`${id}-region-no`} value="no" label={f.region.no} invalid={!!errors.inRegion} />
          </RadioGroup>
          <div aria-live="polite">
            {data.inRegion === "no" && (
              <p id={`${id}-outside`} className="flex gap-2 rounded-[12px] bg-paper px-4 py-3 text-sm text-ink">
                <MapPinIcon size={18} weight="fill" className="mt-0.5 shrink-0 text-brand-ink" aria-hidden="true" />
                {f.region.outsideNote}
              </p>
            )}
          </div>
          <ErrorText id={errId("inRegion")} text={err("inRegion")} />
        </fieldset>

        {/* Consent (CASL): unchecked by default and required. */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <Checkbox
              ref={(n) => { refs.current.consent = n; }}
              id={`${id}-consent`}
              checked={data.consent}
              onCheckedChange={(v) => set("consent", v === true)}
              aria-required="true"
              aria-invalid={!!errors.consent}
              aria-describedby={describedBy("consent")}
              className={cn("mt-0.5 size-5 rounded-[6px] border-[#8a8a91] bg-white data-checked:border-ink data-checked:bg-ink [&_svg]:size-3.5", errors.consent && "border-danger")}
            />
            <Label htmlFor={`${id}-consent`} className="block text-sm leading-relaxed font-normal text-ink/85">{f.consent}</Label>
          </div>
          <ErrorText id={errId("consent")} text={err("consent")} />
        </div>

        {/* Honeypot: hidden from people and screen readers; anything typed here marks a bot. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-website`}>{f.honeypotLabel}</label>
          <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => setData((d) => ({ ...d, website: e.target.value }))} />
        </div>

        {status === "error" && (
          <p role="alert" className="rounded-[12px] bg-danger/8 px-4 py-3 text-sm font-medium text-danger">{f.errors.network}</p>
        )}

        <button type="submit" className="btn btn-primary min-h-13 w-full text-[17px]" disabled={status === "submitting"} aria-busy={status === "submitting"}>
          {status === "submitting" ? f.submitting : f.submit}
        </button>
      </div>
    </form>
  );
}

function Choice({ id, value, label, invalid, itemRef }: { id: string; value: string; label: string; invalid: boolean; itemRef?: (n: HTMLButtonElement | null) => void }) {
  return (
    <Label
      htmlFor={id}
      className={cn(
        "flex h-12 cursor-pointer items-center gap-3 rounded-[12px] border bg-white px-3.5 text-[15px] font-medium transition-colors",
        "has-[[data-state=checked]]:border-ink has-[[data-state=checked]]:bg-paper",
        invalid ? "border-danger" : "border-[#8a8a91]",
      )}
    >
      <RadioGroupItem ref={itemRef} id={id} value={value} className="size-5 border-[#8a8a91] bg-white data-checked:border-ink data-checked:bg-ink" />
      {label}
    </Label>
  );
}

function ErrorText({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return <p id={id} className="text-sm font-medium text-danger">{text}</p>;
}
