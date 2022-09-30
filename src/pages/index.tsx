import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Timer } from "../components/Timer";
import { useAuth } from "../contexts/AuthContext";
import { useMedia } from "../hooks/useMedia";
import { api } from "../services/axios/api";
import styles from "../styles/pages/home.module.css";

type Task = {
  id_task: string;
  name: string;
  description: string;
  isDone: boolean;
};

export default function Home() {
  const { user } = useAuth();
  const isWide = useMedia("(min-width: 1000px)");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTasksChanged, setIsTasksChanged] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  async function getTasks() {
    if (!user) {
      setTasks([]);
      return;
    }

    const response = await api.get("/tasks");
    const data = response.data;
    setTasks(data);
  }

  async function handleCreateNewTask(name: string) {
    try {
      await api.post("/tasks", {
        name,
        description: "",
      });
      setIsTasksChanged(true);
    } catch {
      throw new Error();
    }
  }

  async function handleUpdateTask(task: Task) {
    try {
      await api.put(`/tasks/${task.id_task}`, {
        name: task.name,
        description: task.description,
      });
      setIsTasksChanged(true);
    } catch {
      throw new Error();
    }
  }

  async function handleDeleteTask(task: Task) {
    try {
      await api.delete(`/tasks/${task.id_task}`);
      setIsTasksChanged(true);
    } catch {
      throw new Error();
    }
  }

  function handleToggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  useEffect(() => {
    try {
      getTasks();
      setIsTasksChanged(false);
    } catch {
      throw new Error();
    }
  }, [isTasksChanged, user]);

  useEffect(() => {
    if (!isWide) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isWide]);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.contentContainer}>
        {isSidebarOpen && (
          <Sidebar
            tasks={tasks}
            createNewTask={handleCreateNewTask}
            deleteTask={handleDeleteTask}
            updateTask={handleUpdateTask}
            toggleSidebar={handleToggleSidebar}
          />
        )}
        <Timer
          isSidebarOpen={isSidebarOpen}
          onOpenSidebar={handleToggleSidebar}
        />
      </div>
    </div>
  );
}
