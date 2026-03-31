import { render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";


test('button is disabled als form leeg is', () => {
  render(<ContactForm />);
  
  const button = screen.getByText('Verstuur');
  expect(button).toBeDisabled();
});

test('button is enabled als form geldig is', async () => {
  const user = userEvent.setup();
  render(<ContactForm />);
  
  // Vul naam in
  const nameInput = screen.getByPlaceholderText('Naam');
  await user.type(nameInput, 'Jan');
  
  // Vul email in
  const emailInput = screen.getByPlaceholderText('Email');
  await user.type(emailInput, 'jan@test.com');
  
  // Check of button nu enabled is
  const button = screen.getByText('Verstuur');
  expect(button).not.toBeDisabled();
});

test('toont bedankt bericht na submit', async () => {
  const user = userEvent.setup();
  render(<ContactForm />);
  
  // Vul form in
  await user.type(screen.getByPlaceholderText('Naam'), 'Jan');
  await user.type(screen.getByPlaceholderText('Email'), 'jan@test.com');
  
  // Submit form
  const button = screen.getByText('Verstuur');
  await user.click(button);
  
  // Check bedankt bericht
  expect(screen.getByText('Bedankt, Jan!')).toBeInTheDocument();
  
  // Check of form verdwenen is
  expect(screen.queryByPlaceholderText('Naam')).not.toBeInTheDocument();
});