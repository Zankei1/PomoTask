import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { api } from "../../../services/axios/api";
import {
  MdPlayCircle,
  MdStopCircle,
  MdOutlineRestartAlt,
} from "react-icons/md";

import styles from "./styles.module.css";

interface CountdownProps {
  selectedTab: string;
}

export function Countdown({ selectedTab }: CountdownProps) {
  const { user } = useAuth();

  const timer = useRef<NodeJS.Timer>();
  const [time, setTime] = useState({
    hour: 0,
    minute: 25,
    second: 0,
  });

  async function setInitialTime() {
    if (user) {
      try {
        const response = await api.get("/users/info");

        const {
          initial_time_pomodoro,
          break_time_pomodoro,
          long_break_pomodoro,
        } = response.data;

        const [pomodoroHour, pomodoroMinute, pomodoroSecond] =
          initial_time_pomodoro.split(":");
        const [breakTimeHour, breakTimeMinute, breakTimeSecond] =
          break_time_pomodoro.split(":");
        const [longBreakHour, longBreakMinute, longBreakSecond] =
          long_break_pomodoro.split(":");

        switch (selectedTab) {
          case "tab1":
            setTime({
              hour: Number(pomodoroHour),
              minute: Number(pomodoroMinute),
              second: Number(pomodoroSecond),
            });
            break;
          case "tab2":
            setTime({
              hour: Number(breakTimeHour),
              minute: Number(breakTimeMinute),
              second: Number(breakTimeSecond),
            });
            break;
          case "tab3":
            setTime({
              hour: Number(longBreakHour),
              minute: Number(longBreakMinute),
              second: Number(longBreakSecond),
            });
            break;
        }
      } catch (error) {
        throw new Error();
      }
    } else {
      switch (selectedTab) {
        case "tab1":
          setTime({
            hour: Number("00"),
            minute: Number("25"),
            second: Number("00"),
          });
          break;
        case "tab2":
          setTime({
            hour: Number("00"),
            minute: Number("05"),
            second: Number("00"),
          });
          break;
        case "tab3":
          setTime({
            hour: Number("00"),
            minute: Number("15"),
            second: Number("00"),
          });
          break;
      }
    }
  }

  function start() {
    clearInterval(timer.current);

    timer.current = setInterval(() => {
      setTime((time) => ({
        hour: time.minute == 0 ? time.hour - 1 : time.hour,
        minute: time.second === 0 ? time.minute - 1 : time.minute,
        second: time.second === 0 ? 59 : time.second - 1,
      }));
    }, 1000);
  }

  function stop() {
    clearInterval(timer.current);
  }

  function reset() {
    clearInterval(timer.current);
    setInitialTime();
  }

  useEffect(() => {
    setInitialTime();
    stop();
  }, [user, selectedTab]);

  const hour = String(time.hour).padStart(2, "0");
  const minute = String(time.minute).padStart(2, "0");
  const second = String(time.second).padStart(2, "0");

  return (
    <div className={styles.container}>
      <div className={styles.time}>
        {Number(hour) > 0 && <span>{hour}</span>}
        {Number(hour) > 0 && <span>:</span>}
        <span>{minute}</span>
        <span>:</span>
        <span>{second}</span>
      </div>
      <div className={styles.timerButtonsContainer}>
        <button className={styles.timerButtons} onClick={start}>
          <MdPlayCircle aria-label="icone para iniciar o timer" fontSize={80} />
        </button>
        <button className={styles.timerButtons} onClick={stop}>
          <MdStopCircle aria-label="icone para parar o timer" fontSize={80} />
        </button>
        <button className={styles.timerButtons} onClick={reset}>
          <MdOutlineRestartAlt
            aria-label="icone para resetar o timer"
            fontSize={80}
          />
        </button>
      </div>
    </div>
  );
}
