import { useState} from 'react';

function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };
    const isValid = name.length > 0 && email.includes("@");

    return (
        <div>
            {submitted ? (
                <p>Bedankt, {name}!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input 
                    type="text"
                    placeholder='Naam'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                     />
                    <input 
                    type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" disabled={!isValid}>
                        Verstuur
                    </button>
                </form>
            )}
        </div>
    );
};

export default ContactForm;