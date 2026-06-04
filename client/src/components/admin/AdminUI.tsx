import { ReactNode } from "react";

const inputClass = "w-full bg-background border border-border rounded-md px-3 py-2 text-sm";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextField({ label, value, onChange, placeholder }: TextFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <input
        type="text"
        className={inputClass}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export type SelectOption = string | { value: string; label: string };

interface SelectFieldProps {
  label: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
}

/** Dropdown for enum/"token" fields (statusToken, levelToken, accessMode, section, kind, …). */
export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface BilingualFieldProps {
  label: string;
  es: string;
  en: string;
  onChange: (lang: "es" | "en", value: string) => void;
}

export function BilingualField({ label, es, en, onChange }: BilingualFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          className={inputClass}
          value={es}
          placeholder="Español"
          onChange={(e) => onChange("es", e.target.value)}
        />
        <input
          type="text"
          className={inputClass}
          value={en}
          placeholder="English"
          onChange={(e) => onChange("en", e.target.value)}
        />
      </div>
    </div>
  );
}

interface BilingualTextAreaProps {
  label: string;
  es: string;
  en: string;
  onChange: (lang: "es" | "en", value: string) => void;
  rows?: number;
  hint?: string;
}

export function BilingualTextArea({
  label,
  es,
  en,
  onChange,
  rows = 4,
  hint,
}: BilingualTextAreaProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <textarea
          className={inputClass}
          rows={rows}
          value={es}
          placeholder="Español"
          onChange={(e) => onChange("es", e.target.value)}
        />
        <textarea
          className={inputClass}
          rows={rows}
          value={en}
          placeholder="English"
          onChange={(e) => onChange("en", e.target.value)}
        />
      </div>
    </div>
  );
}

interface BilingualSectionProps {
  title?: string;
  children: ReactNode;
}

export function BilingualSection({ title, children }: BilingualSectionProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {title ? <h3 className="text-sm font-semibold text-foreground">{title}</h3> : null}
      {children}
    </div>
  );
}

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          className="h-9 w-12 rounded-md border border-border bg-background"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
