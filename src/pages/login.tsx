import Link from "next/link";
import { Header } from "../components/Header";
import { Button } from "../components/Form/Button";
import { Input } from "../components/Form/Input";
import { useAuth } from "../contexts/AuthContext";
import { SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import styles from "../styles/pages/login.module.css";

interface UserLoginData {
  email: string;
  password: string;
}

export default function Login() {
  const userNotExists = () => toast.error("Email ou senha incorretos");
  const { signIn } = useAuth();

  const schema = yup.object({
    email: yup
      .string()
      .email("Digite um email válido")
      .required("esse campo é obrigaório"),
    password: yup
      .string()
      .min(6, "No mínimo 6 caracteres")
      .required("esse campo é obrigaório"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginData>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<UserLoginData> = async (data) => {
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      userNotExists();
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.fieldContainer}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
          <div className={styles.formHeader}>
            <h2>Login</h2>
          </div>
          <Input
            label="Email"
            type="text"
            placeholder="Digite seu e-mail"
            customSize="large"
            {...register("email")}
            error={errors.email}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            {...register("password")}
            error={errors.password}
          />
          <div className={styles.recoverPassword}>
            <small>Esqueceu a sua senha?</small>
            <Link href="#">
              <a className={styles.recoverLink}>Clique aqui</a>
            </Link>
          </div>
          <Button disabled={isSubmitting} name="Entrar" type="submit" />
          <hr className={styles.contentDivider} />
          <Link href="#">
            <a className={styles.loginButton}>Login com o Google</a>
          </Link>
        </form>
        <div className={styles.socialLogin}>
          <h2>Não tem uma conta?</h2>
          <Link href="/sign-up">
            <a className={styles.loginButton}>Cadastre-se</a>
          </Link>
          <Link href="#">
            <a className={styles.loginButton}>Login com o Google</a>
          </Link>
        </div>
      </div>
      <Toaster
        gutter={10}
        toastOptions={{
          error: {
            style: {
              backgroundColor: "rgb(247, 80, 80)",
              color: "#fff",
              display: "flex",
              gap: "0.5rem",
            },
          },
        }}
      />
    </div>
  );
}
