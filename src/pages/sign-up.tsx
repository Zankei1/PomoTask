import Link from "next/link";
import { Header } from "../components/Header";
import { Button } from "../components/Form/Button";
import { Input } from "../components/Form/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { api } from "../services/axios/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

import styles from "../styles/pages/signUp.module.css";

interface UserLoginData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function signUp() {
  const router = useRouter();

  const emailAlreadyExistsToastNotification = () =>
    toast.error("Já existe um usuário registrado com esse email");

  const schema = yup.object({
    name: yup.string().required("Insira seu nome"),
    email: yup
      .string()
      .email("Digite um email válido")
      .required("esse campo é obrigaório"),
    password: yup
      .string()
      .min(6, "No mínimo 6 caracteres")
      .required("esse campo é obrigatório"),
    password_confirmation: yup
      .string()
      .oneOf([null, yup.ref("password")], "As senhas precisam ser iguais")
      .required("esse campo é obrigatório"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginData>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<UserLoginData> = async (data) => {
    try {
      await api.post("/users", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      router.push("/login");
    } catch {
      emailAlreadyExistsToastNotification();
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div></div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.signUpForm}>
          <div className={styles.formHeader}>
            <h2>Cadastro</h2>
          </div>
          <Input
            type="text"
            label="Nome"
            placeholder="Nome de usuário"
            {...register("name")}
            error={errors.name}
          />
          <Input
            type="email"
            label="Email"
            placeholder="E-mail"
            {...register("email")}
            error={errors.email}
          />
          <Input
            type="password"
            label="Senha"
            placeholder="Senha"
            {...register("password")}
            error={errors.password}
          />
          <Input
            type="password"
            label="Confirmar senha"
            placeholder="Confirme a senha"
            {...register("password_confirmation")}
            error={errors.password_confirmation}
          />
          <div className={styles.login}>
            <small>Já tem uma conta?</small>
            <Link href="/login">
              <a>Entre</a>
            </Link>
          </div>
          <Button disabled={isSubmitting} name="Criar" />
          <hr className={styles.contentDivider} />
          <Link href="#">
            <a className={styles.loginButton}>Criar com o google</a>
          </Link>
        </form>
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
