import { Header } from "./";
import { render } from "@testing-library/react";
import { useAuth } from "../../contexts/AuthContext";

jest.mock("../../contexts/AuthContext");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;

describe("Header component", () => {
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
    const { getByText } = render(<Header />);
    expect(getByText("Sair")).toBeInTheDocument();
  });

  it("should be able to display user name on user logged in", () => {
    const { queryByText } = render(<Header />);
    expect(queryByText("User")).toBeInTheDocument();
  });

  it("should not be able to display user name on user not logged in", () => {
    mockedUseAuth.mockReturnValueOnce({
      user: undefined,
      signIn: jest.fn(),
      signOut: jest.fn(),
    });

    const { queryByText } = render(<Header />);

    expect(queryByText("User")).not.toBeInTheDocument();
  });
});
