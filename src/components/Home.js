import React, { useState }from "react";

function Home(props) {

    const [fromUser, setFromUser] = useState('');
    const [toUser, setToUser] = useState('');

    const joinChat = e => {
        e.preventDefault();
        localStorage.setItem('fromUser', fromUser);
        props.history.push(`/chat/${toUser}`);
    }

    return (
        <div>
            <input type="text" value={fromUser} onChange={e => setFromUser(e.target.value)} />
            <input type="text" value={toUser} onChange={e => setToUser(e.target.value)} />
            <button onClick={joinChat}>Chat</button>
        </div>
    );
}

export default Home;