import { render, screen } from "@testing-library/react";
import Greeting from "./Greeting";

describe("Greeting component", () => {
  test("toont de juiste naam", () => {
    render(<Greeting name="Jan" />);

    const heading = screen.getByText("Hallo, Jan!");
    expect(heading).toBeInTheDocument();
  });

  test("toont de welkomsttekst", () => {
    render(<Greeting name="Piet" />);

    const tekst = screen.getByText("Welkom op onze website.");
    expect(tekst).toBeInTheDocument();
  });
});
