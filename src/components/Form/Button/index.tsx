import { ButtonHTMLAttributes, ReactNode } from "react";
import { LoadingSpinner } from "../../LoadingSpinner";

import styles from "./styles.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  icon?: ReactNode;
}

export function Button({ name, icon, disabled, ...rest }: ButtonProps) {
  return (
    <button className={`${styles.container}`} {...rest}>
      {icon}
      {disabled ? <LoadingSpinner /> : name}
    </button>
  );
}
