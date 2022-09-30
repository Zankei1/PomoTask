import { render } from "@testing-library/react";
import { Input } from ".";

describe("Input Component", () => {
  it("should be able to have a label", () => {
    const { getByText } = render(
      <Input name="input" label="label for input" />
    );
    const label = getByText("label for input");
    expect(label).toBeInTheDocument();
  });

  it("should not be able to show a label if not passed as prop", () => {
    const { queryByText } = render(<Input name="input" />);
    const label = queryByText("label for input");
    expect(label).not.toBeInTheDocument();
  });

  it("should be able to have a default size", () => {
    const { container } = render(<Input name="input" />);
    expect(container.firstChild).toHaveClass("large");
  });

  it("should be able to have a custom size", () => {
    const { container } = render(<Input name="input" customSize="medium" />);
    expect(container.firstChild).toHaveClass("medium");
  });

  it("should be able to display an error message", () => {
    const { getByText } = render(
      <Input
        name="input"
        error={{ message: "No mínimo 6 caracteres", type: "min" }}
      />
    );
    const errorMessage = getByText("No mínimo 6 caracteres");
    expect(errorMessage).toBeInTheDocument();
  });
});
