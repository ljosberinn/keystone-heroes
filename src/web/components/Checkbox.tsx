import { classnames } from "../utils/classnames";

type CheckboxProps = {
  children: string | JSX.Element | JSX.Element[];
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  className?: string;
  spanClassName?: string;
};

export function Checkbox({
  children,
  checked,
  disabled,
  onChange,
  className,
  spanClassName,
}: CheckboxProps): JSX.Element {
  return (
    <label
      className={classnames(
        className,
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <input
        type="checkbox"
        className="absolute w-8 h-8 opacity-0 peer"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <span
        className={classnames(
          "space-x-2 inline-flex items-center",
          spanClassName
        )}
      >
        {children}
      </span>
    </label>
  );
}
