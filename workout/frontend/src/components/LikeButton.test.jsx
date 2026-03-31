import { render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LikeButton from "./LikeButton";


test('begint met 0 likes', () => {
    render(<LikeButton/>);

    expect(screen.getByText('Likes: 0')).toBeInTheDocument();
});

test('verhoogt het aantal likes bij klikken', async () => {
    const user = userEvent.setup();
    
    render(<LikeButton/>);

    const button = screen.getByText('Like');

    await user.click(button);

    expect(screen.getByText('Likes: 1')).toBeInTheDocument();
});


test('kan meerdere keren klikken', async () => {
    const user = userEvent.setup();

    render(<LikeButton/>);

    const button = screen.getByText('Like');

    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(screen.getByText('Likes: 3')).toBeInTheDocument();
});
