import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormField } from "./form-field";
export function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  autoComplete = "current-password",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <FormField id={id} label={label} error={error} hint={hint}>
      <div className="password-input">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={!!error}
          aria-describedby={
            [error ? `${id}-error` : "", hint ? `${id}-hint` : ""]
              .filter(Boolean)
              .join(" ") || undefined
          }
          autoComplete={autoComplete}
          required
        />
        <button
          type="button"
          aria-label={`${visible ? "Ocultar" : "Mostrar"} ${label.toLowerCase()}`}
          aria-pressed={visible}
          className="icon-button"
          onClick={() => setVisible(!visible)}
        >
          {visible ? (
            <EyeOff size={18} aria-hidden="true" />
          ) : (
            <Eye size={18} aria-hidden="true" />
          )}
        </button>
      </div>
    </FormField>
  );
}
