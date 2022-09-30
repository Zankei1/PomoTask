import Home from "../pages/index";
import { render } from "@testing-library/react";

describe("Home page", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it("render correctly", () => {
    const { getByText, getByRole } = render(<Home />);
    expect(getByText("Timer")).toBeInTheDocument();
    expect(getByRole("tab", { name: /long break/i }));
    expect(getByRole("tab", { name: /pomodoro/i }));
    expect(getByRole("tab", { name: /long break/i }));
  });
});
