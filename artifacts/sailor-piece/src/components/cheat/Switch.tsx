interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export function Switch({ checked, onChange, label }: Props) {
  return (
    <button
      type="button"
      className="switch"
      data-on={checked ? "true" : "false"}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      aria-label={label}
    />
  );
}
