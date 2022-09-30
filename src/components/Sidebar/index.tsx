import Link from "next/link";
import { FormEvent, useState } from "react";
import { Task } from "../Task";
import { Input } from "../Form/Input";
import { useAuth } from "../../contexts/AuthContext";
import { MdAddCircle } from "react-icons/md";
import { BsArrowLeft } from "react-icons/bs";
import { isKeyPressed } from "../../utils/isKeyPressed";
import styles from "./styles.module.css";

type Task = {
  id_task: string;
  name: string;
  description: string;
  isDone: boolean;
};

interface SidebarProps {
  tasks: Task[];
  createNewTask: (name: string) => void;
  deleteTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  toggleSidebar: () => void;
}

export function Sidebar({
  tasks,
  createNewTask,
  deleteTask,
  updateTask,
  toggleSidebar,
}: SidebarProps) {
  const { user } = useAuth();

  const [taskTitle, setTaskTitle] = useState("");
  const [isAddingNewTask, setIsAddingNewTask] = useState(false);

  function handleAddTask(event: FormEvent) {
    event.preventDefault();

    if (taskTitle.trim() == "") return;

    createNewTask(taskTitle);
    setTaskTitle("");
    setIsAddingNewTask(false);
  }

  return (
    <>
      {!user ? (
        <div className={styles.container}>
          <div className={styles.sidebarHeader}>
            <h1>Tarefas</h1>
            <button
              className={styles.closeSidebarButton}
              onClick={toggleSidebar}
            >
              <BsArrowLeft fontSize={26} />
            </button>
          </div>
          <Link href="/login">
            <a className={styles.login}>
              Faça <span className={styles.underline}>login</span>
            </a>
          </Link>
          <span>para adicionar suas tarefas</span>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.sidebarHeader}>
            <h1>Tarefas</h1>
            <button
              className={styles.closeSidebarButton}
              onClick={toggleSidebar}
            >
              <BsArrowLeft fontSize={26} />
            </button>
          </div>
          {tasks?.length == 0 && <h2>Adicione novas tarefas</h2>}
          <ul className={styles.taskList}>
            {tasks.map((task) => (
              <Task
                key={task.id_task}
                task={task}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            ))}
          </ul>
          {isAddingNewTask && (
            <form className={styles.formAddTask} onSubmit={handleAddTask}>
              <Input
                name="task-title"
                aria-label="Campo para adicionar o nome de uma nova tarefa"
                autoFocus
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (isKeyPressed("Escape", event)) {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsAddingNewTask(false);
                  }
                }}
              />
            </form>
          )}
          <button
            onClick={() => setIsAddingNewTask(!isAddingNewTask)}
            aria-label="Botão para adicionar uma nova tarefa"
          >
            <MdAddCircle fontSize={26} />
          </button>
        </div>
      )}
    </>
  );
}
