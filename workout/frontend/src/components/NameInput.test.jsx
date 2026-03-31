import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NameInput from "./NameInput";

test('begint met lege input', () => {
    render(<NameInput/>);

    const input = screen.getByPlaceholderText('Jouw naam');
    expect(input).toHaveValue('');
});

test('toont begroeting na typen', async () => {
    const user = userEvent.setup();

    render(<NameInput/>);

    const input = screen.getByPlaceholderText('Jouw naam');

    await user.type(input, 'Jan');

    expect(input).toHaveValue('Jan');

    expect(screen.getByText('Hallo, Jan!')).toBeInTheDocument();
});