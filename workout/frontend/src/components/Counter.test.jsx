import { render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "./Counter";
describe('Counter component', () => {
  
  test('begint met 0', () => {
    render(<Counter />);
    expect(screen.getByText('Counter: 0')).toBeInTheDocument();
  });

  test('verhoogt bij plus button', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    const plusButton = screen.getByText('+');
    await user.click(plusButton);
    
    expect(screen.getByText('Counter: 1')).toBeInTheDocument();
  });

  test('verlaagt bij min button', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    const minButton = screen.getByText('-');
    await user.click(minButton);
    
    expect(screen.getByText('Counter: -1')).toBeInTheDocument();
  });

  test('reset naar 0', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    // Eerst verhogen naar 5
    const plusButton = screen.getByText('+');
    await user.click(plusButton);
    await user.click(plusButton);
    await user.click(plusButton);
    await user.click(plusButton);
    await user.click(plusButton);
    
    expect(screen.getByText('Counter: 5')).toBeInTheDocument();
    
    // Dan reset
    const resetButton = screen.getByText('Reset');
    await user.click(resetButton);
    
    expect(screen.getByText('Counter: 0')).toBeInTheDocument();
  });

  test('kan meerdere acties na elkaar doen', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    const plusButton = screen.getByText('+');
    const minButton = screen.getByText('-');
    
    // +3
    await user.click(plusButton);
    await user.click(plusButton);
    await user.click(plusButton);
    expect(screen.getByText('Counter: 3')).toBeInTheDocument();
    
    // -1
    await user.click(minButton);
    expect(screen.getByText('Counter: 2')).toBeInTheDocument();
  });
});

