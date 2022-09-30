import { render } from "@testing-library/react";
import { useAuth } from "../../contexts/AuthContext";
import { Sidebar } from "./";

jest.mock("../../contexts/AuthContext");

const mockedUseAuth = useAuth as jest.Mock;

const tasks = [
  {
    id_task: "1",
    name: "task name",
    description: "task description",
    isDone: false,
  },
  {
    id_task: "2",
    name: "another task name",
    description: "another task description",
    isDone: false,
  },
];

const createNewTask = jest.fn();
const deleteTask = jest.fn();
const updateTask = jest.fn();

describe("Sidebar component", () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({
      user: {
        name: "User",
        email: "user@email.com",
      },
      signIn: jest.fn(),
      signOut: jest.fn(),
    });
  });

  it("should be able to render correctly", () => {
    const { getByText } = render(
      <Sidebar
        tasks={tasks}
        createNewTask={createNewTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
    );
    expect(getByText("Tarefas")).toBeInTheDocument();
  });

  it("should not be able to add task on user not logged in", () => {
    mockedUseAuth.mockReturnValueOnce({
      user: undefined,
      signIn: jest.fn(),
      signOut: jest.fn(),
    });

    const { getByText } = render(
      <Sidebar
        tasks={tasks}
        createNewTask={createNewTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
    );

    expect(getByText("Faça")).toBeInTheDocument();
    expect(getByText("login")).toBeInTheDocument();
    expect(getByText("para adicionar suas tarefas")).toBeInTheDocument();
  });

  it("should be able to add task on user logged in", () => {
    const { getByLabelText } = render(
      <Sidebar
        tasks={tasks}
        createNewTask={createNewTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
    );
    const addTaskButton = getByLabelText(
      "Botão para adicionar uma nova tarefa"
    );
    expect(addTaskButton).toBeInTheDocument();
  });
});
