import { classnames } from "../utils/classnames";

type CheckboxProps = {
  children: string | JSX.Element | JSX.Element[];
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  className?: string;
};

export function Checkbox({
  children,
  id,
  checked,
  disabled,
  onChange,
  className,
}: CheckboxProps): JSX.Element {
  return (
    <label
      className={classnames(
        "inline-flex items-center",
        className,
        !disabled && "cursor-pointer"
      )}
    >
      <input
        type="checkbox"
        // className="sr-only"
        className="absolute w-8 h-8 opacity-0 peer"
        aria-labelledby={id}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span className="peer-checked:text-red">{children}</span>
    </label>
  );
}
