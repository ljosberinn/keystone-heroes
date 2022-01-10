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
    <>
      <input
        type="checkbox"
        id={id}
        className="hidden"
        aria-labelledby={id}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <label
        htmlFor={id}
        className={classnames(
          "pl-2 inline-flex items-center space-x-2",
          className,
          !disabled && "cursor-pointer"
        )}
      >
        {children}
      </label>
    </>
  );
}
