import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => element,
  Navigate: () => null,
  useNavigate: () => jest.fn(),
}));

test("App component rendert", () => {
  render(<App />);

  const element = screen.getByRole("heading", { name: /registreren/i });
  expect(element).toBeInTheDocument();
});