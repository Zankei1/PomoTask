import classNames from "classnames";
import {
  forwardRef,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
} from "react";
import { FieldError } from "react-hook-form";

import styles from "./styles.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  error?: FieldError | undefined;
  customSize?: "verySmall" | "small" | "medium" | "large";
}

const MyInput: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error, customSize = "large", ...rest },
  ref
) => {
  const className = classNames({
    [styles.small]: customSize === "small",
    [styles.medium]: customSize === "medium",
    [styles.large]: customSize === "large",
  });

  return (
    <div className={`${styles.container} ${className}`}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <input className={styles.input} name={name} ref={ref} {...rest} />
      {error && <small className={styles.error}>{error.message}</small>}
    </div>
  );
};

export const Input = forwardRef(MyInput);
