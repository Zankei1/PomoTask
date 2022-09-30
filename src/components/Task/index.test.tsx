import { Task } from ".";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const taskMock = {
  id_task: "1",
  name: "task name",
  description: "task description",
  isDone: false,
};

const deleteTask = jest.fn();
const updateTask = jest.fn();

describe("Task Component", () => {
  it("should render correctly", () => {
    const { getByText } = render(
      <Task task={taskMock} deleteTask={deleteTask} updateTask={updateTask} />
    );
    const task = getByText("task name");
    expect(task).toBeInTheDocument();
  });

  it("should not be able to render input edit outside edit mode", () => {
    const { container } = render(
      <Task task={taskMock} deleteTask={deleteTask} updateTask={updateTask} />
    );
    const inputEditTask = container.querySelector('input[name="task-title"]');
    expect(inputEditTask).not.toBeInTheDocument();
  });

  it("should be able to enter on edit mode on pressing the icon", async () => {
    const user = userEvent.setup();
    const { getByLabelText, container } = render(
      <Task task={taskMock} deleteTask={deleteTask} updateTask={updateTask} />
    );
    const editIcon = getByLabelText("icone de edição da tarefa");
    await user.click(editIcon);
    const inputEditTask = container.querySelector('input[name="task-title"]');
    expect(inputEditTask).toBeInTheDocument();
  });

  it("should be able to enter on edit mode on double click", async () => {
    const user = userEvent.setup();
    const { getByText, container } = render(
      <Task task={taskMock} deleteTask={deleteTask} updateTask={updateTask} />
    );
    const task = getByText("task name");
    await user.dblClick(task);
    const inputEditTask = container.querySelector('input[name="task-title"]');
    expect(inputEditTask).toBeInTheDocument();
  });

  it("should be able to close edit mode on press esc", async () => {
    const user = userEvent.setup();
    const { getByLabelText, container } = render(
      <Task task={taskMock} deleteTask={deleteTask} updateTask={updateTask} />
    );
    const editIcon = getByLabelText("icone de edição da tarefa");
    await user.click(editIcon);
    const inputEditTask = container.querySelector('input[name="task-title"]');
    await user.keyboard("[Escape]");
    expect(inputEditTask).not.toBeInTheDocument();
  });

  it("should be able to close edit mode on press on icon", async () => {
    const user = userEvent.setup();
    const { getByLabelText, container } = render(
      <Task task={taskMock} deleteTask={deleteTask} updateTask={updateTask} />
    );
    const editIcon = getByLabelText("icone de edição da tarefa");
    await user.click(editIcon);
    const inputEditTask = container.querySelector('input[name="task-title"]');
    const iconCancelEdit = getByLabelText(
      "botao para cancelar edição da tarefa"
    );
    await user.click(iconCancelEdit);
    expect(inputEditTask).not.toBeInTheDocument();
  });
});
