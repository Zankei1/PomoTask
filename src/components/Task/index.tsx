import { FormEvent, useState } from "react";
import { Input } from "../Form/Input";
import { MdDelete, MdEdit, MdEditOff } from "react-icons/md";
import { isKeyPressed } from "../../utils/isKeyPressed";
import styles from "./styles.module.css";

type Task = {
  id_task: string;
  name: string;
  description: string;
  isDone: boolean;
};

interface TaskProps {
  task: Task;
  deleteTask: (task: Task) => void;
  updateTask: (task: Task) => void;
}

export function Task({ task, deleteTask, updateTask }: TaskProps) {
  const { name } = task;

  const [taskTitle, setTaskTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  function handleEditTask(event: FormEvent) {
    event.preventDefault();
    if (taskTitle.trim() == "") return;

    const updatedTask = {
      ...task,
      name: taskTitle,
    };

    updateTask(updatedTask);
    setIsEditingTitle(false);
  }

  if (isEditingTitle) {
    return (
      <form className={styles.editForm} onSubmit={handleEditTask}>
        <Input
          autoFocus
          type="text"
          name="task-title"
          defaultValue={name}
          onChange={(event) => setTaskTitle(event.target.value)}
          onKeyDown={(event) => {
            if (isKeyPressed("Escape", event)) {
              event.preventDefault();
              event.stopPropagation();
              setIsEditingTitle(false);
            }
          }}
        />
        <button
          aria-label="botao para cancelar edição da tarefa"
          onClick={() => setIsEditingTitle(false)}
        >
          <MdEditOff fontSize={26} />
        </button>
      </form>
    );
  }

  return (
    <li className={styles.task} onDoubleClick={() => setIsEditingTitle(true)}>
      <div className={styles.taskContent}>
        <Input name="check" type="checkbox" customSize="verySmall" />
        <button>{name}</button>
      </div>
      <div className={styles.taskControls}>
        <button
          className={styles.controlButtons}
          onClick={() => setIsEditingTitle(true)}
        >
          <MdEdit aria-label="icone de edição da tarefa" fontSize={26} />
        </button>
        <button className={styles.controlButtons}>
          <MdDelete
            aria-label="icone de exclusão da tarefa"
            onClick={() => deleteTask(task)}
            fontSize={26}
          />
        </button>
      </div>
    </li>
  );
}
