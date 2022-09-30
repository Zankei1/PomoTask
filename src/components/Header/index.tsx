import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../contexts/AuthContext";
import { BsArrowRight, BsPersonCircle } from "react-icons/bs";
import pomotaskLightLogo from "../../assets/images/pomotask-light-logo.svg";
import styles from "./styles.module.css";

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <Link href="/">
          <a>
            <Image
              src={pomotaskLightLogo}
              alt="Icone Pomotask"
              width={80}
              height={80}
            />
          </a>
        </Link>
        {user && (
          <div className={styles.user}>
            <BsPersonCircle fontSize={40} />
            <span>{user.name}</span>
          </div>
        )}
      </div>
      <div className={styles.login}>
        {!user ? (
          <Link href="/login">
            <a data-testid="login-button" className={styles.loginButton}>
              Login
              <BsArrowRight fontSize={20} />
            </a>
          </Link>
        ) : (
          <button onClick={signOut}>
            <span className={styles.loginButton}>
              Sair
              <BsArrowRight fontSize={20} />
            </span>
          </button>
        )}
      </div>
    </header>
  );
}
