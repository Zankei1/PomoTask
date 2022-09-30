import { Timer } from "./";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const isSidebarOpen = false;
const onOpenSidebar = jest.fn();

describe("Timer component", () => {
  it("should be able to render correctly", () => {
    const { getByText } = render(
      <Timer isSidebarOpen={isSidebarOpen} onOpenSidebar={onOpenSidebar} />
    );
    expect(getByText("Timer")).toBeInTheDocument();
  });

  it("sould be able to navigate to another tab", async () => {
    const user = userEvent.setup();
    const { getByText } = render(
      <Timer isSidebarOpen={isSidebarOpen} onOpenSidebar={onOpenSidebar} />
    );
    const tabBreak = getByText("Break");
    await user.click(tabBreak);
    expect(getByText("Break")).toBeInTheDocument();
    expect(getByText("00")).toBeInTheDocument();
    expect(getByText(":")).toBeInTheDocument();
    expect(getByText("05")).toBeInTheDocument();
  });
});
