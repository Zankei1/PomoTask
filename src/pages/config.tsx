import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "../components/Form/Input";
import { Header } from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../services/axios/api";

import styles from "../styles/pages/config.module.css";

interface UserConfigTimer {
  taskHours: string;
  taskMinutes: string;
  taskSeconds: string;
  breakHours: string;
  breakMinutes: string;
  breakSeconds: string;
  longBreakHours: string;
  longBreakMinutes: string;
  longBreakSeconds: string;
}

export default function Config() {
  const [initialTimePomodoro, setInitialTimePomodoro] = useState<string[]>([
    "00",
    "00",
    "00",
  ]);
  const [breakTimePomodoro, setBreakTimePomodoro] = useState<string[]>([
    "00",
    "00",
    "00",
  ]);
  const [longBreakPomodoro, setLongBreakPomodoro] = useState<string[]>([
    "00",
    "00",
    "00",
  ]);

  const { user } = useAuth();

  const userNotExists = () =>
    toast.error("Houve um erro ao atualizar o relógio, tente novamente.");
  const timerUpdatedSucess = () =>
    toast.success("Tempo atualizado com sucesso");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UserConfigTimer>();

  const onSubmit: SubmitHandler<UserConfigTimer> = async (data) => {
    const {
      taskHours,
      taskMinutes,
      taskSeconds,
      breakHours,
      breakMinutes,
      breakSeconds,
      longBreakHours,
      longBreakMinutes,
      longBreakSeconds,
    } = data;

    const initialTime = `${taskHours}:${taskMinutes}:${taskSeconds}`;
    const breakTime = `${breakHours}:${breakMinutes}:${breakSeconds}`;
    const longBreak = `${longBreakHours}:${longBreakMinutes}:${longBreakSeconds}`;

    try {
      api.put("/users", {
        ...user,
        initial_time_pomodoro: initialTime,
        break_time_pomodoro: breakTime,
        long_break_pomodoro: longBreak,
      });
      timerUpdatedSucess();
    } catch {
      userNotExists();
    }
  };

  useEffect(() => {
    async function getUserTimePreferences() {
      const response = await api.get("/users/info");
      const {
        initial_time_pomodoro,
        break_time_pomodoro,
        long_break_pomodoro,
      } = response.data;
      setInitialTimePomodoro(initial_time_pomodoro.split(":"));
      setBreakTimePomodoro(break_time_pomodoro.split(":"));
      setLongBreakPomodoro(long_break_pomodoro.split(":"));
    }

    try {
      getUserTimePreferences();
    } catch {}
  }, []);

  useEffect(() => {
    if (initialTimePomodoro || breakTimePomodoro || longBreakPomodoro) {
      reset({
        taskHours: initialTimePomodoro[0],
        taskMinutes: initialTimePomodoro[1],
        taskSeconds: initialTimePomodoro[2],
        breakHours: breakTimePomodoro[0],
        breakMinutes: breakTimePomodoro[1],
        breakSeconds: breakTimePomodoro[2],
        longBreakHours: longBreakPomodoro[0],
        longBreakMinutes: longBreakPomodoro[1],
        longBreakSeconds: longBreakPomodoro[2],
      });
    }
  }, [initialTimePomodoro, breakTimePomodoro, longBreakPomodoro]);

  return (
    <>
      {!user ? (
        <div className={styles.container}>
          <Header />
          <div className={styles.configTime}>
            <h1>Você precisa estar logado para configurar o timer</h1>
            <div className={styles.options}>
              <Link href="/">
                <a className={styles.button}>Página inicial</a>
              </Link>
              <Link href="/login">
                <a className={styles.button}>Logar agora</a>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <Header />
          <div className={styles.fieldContainer}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles.configTime}
            >
              <h1>Configurações do cronometro</h1>
              <h2>Tempo da tarefa</h2>
              <div className={styles.taskTime}>
                <Input
                  customSize={"small"}
                  type="string"
                  defaultValue={initialTimePomodoro[0] || "00"}
                  {...register("taskHours")}
                />
                <span>:</span>
                <Input
                  customSize={"small"}
                  type="string"
                  defaultValue={initialTimePomodoro[1] || "00"}
                  {...register("taskMinutes")}
                />
                <span>:</span>
                <Input
                  customSize={"small"}
                  type="number"
                  defaultValue={initialTimePomodoro[2] || "00"}
                  {...register("taskSeconds")}
                />
              </div>
              <h2>Tempo de Intervalo</h2>
              <div className={styles.breakTime}>
                <Input
                  customSize={"small"}
                  type="number"
                  {...register("breakHours")}
                />
                <span>:</span>
                <Input
                  customSize={"small"}
                  type="number"
                  {...register("breakMinutes")}
                />
                <span>:</span>
                <Input
                  customSize={"small"}
                  type="number"
                  {...register("breakSeconds")}
                />
              </div>
              <h2>Tempo de intervalo longo</h2>
              <div className={styles.breakTime}>
                <Input
                  customSize={"small"}
                  type="number"
                  {...register("longBreakHours")}
                />
                <span>:</span>
                <Input
                  customSize={"small"}
                  type="number"
                  {...register("longBreakMinutes")}
                />
                <span>:</span>
                <Input
                  customSize={"small"}
                  type="number"
                  {...register("longBreakSeconds")}
                />
              </div>
              <button disabled={isSubmitting} className={styles.submitButton}>
                Confirmar
              </button>
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
              success: {
                style: {
                  backgroundColor: "green",
                  color: "#fff",
                  display: "flex",
                  gap: "0.5rem",
                },
              },
            }}
          />
        </div>
      )}
    </>
  );
}
