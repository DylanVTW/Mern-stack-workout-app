import {useState} from 'react';

function NameInput() {

    const [name, setName] = useState("");

    return (
        <div>
            <input 
            type="text"
            placeholder='Jouw naam'
            value={name}
            onChange={(e) => setName(e.target.value)}
             />
             {name && <p>Hallo, {name}!</p>}
        </div>
    );
};

export default NameInput;