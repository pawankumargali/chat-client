import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './ChatDashboard.css';
const CHAT_SERVER_ENDPOINT = "http://localhost:8080/chat";
const socket = io(CHAT_SERVER_ENDPOINT);
const PREV_CHAT_API_ENDPOINT = "http://localhost:8080/api/v1/updeeds/chat"

function ChatDashboard(props) {

    const fromUser = Number(localStorage.getItem('fromUser'));
    const toUser  = Number(props.match.params.toUser);
    console.log(fromUser, toUser);

    if(!toUser) console.log('No to user');

    const [msgTxt, setMsgTxt] = useState('');
    const [messages, setMessages] = useState([]);
  
    const handleMsgTxtChange = e => setMsgTxt(e.target.value);

    const initPreviousChat = async () => {
      const { data: result } = await axios.post(PREV_CHAT_API_ENDPOINT, { messageFrom: fromUser, messageTo: toUser});
      setMessages(result.data);
    }

    useEffect(() => {

      initPreviousChat()
      .then( () => socket.emit('connect-users', { users:[fromUser, toUser] }) );

      socket.on('connected-room', room => {
        if(!room) console.log(`Error connecting users ${fromUser} and ${toUser}`);
        else {
          console.log(`Connected at room ${room}`);
        }
      });

      socket.on('message-to-room', message => {
        const msgs=messages;
        msgs.push(message);
        setMessages(msgs);
      })

      socket.on('message-save-error', error => console.log(error));

    }, []);
  
    const sendMessage = e => {
      e.preventDefault();
      const msg = {messageFrom : fromUser, messageTo: toUser, message: msgTxt, messagedDate: new Date() };
      socket.emit('message-to-server', msg);
      const msgs=messages;
      msgs.push(msg);
      setMessages(msgs);
      setMsgTxt('');
    };

    return (
      <div>
      <div id="title-bar"> {toUser} </div>
      <ul id="messages">{messages.map(({messageFrom, message}, index) => 
        <li 
          key={index}
          style={messageFrom==fromUser ? {width:'100%', textAlign:'right'} : {width:'100%', textAlign:'left'}}
        >
          {message}
        </li>
      )}</ul>
      <form action="">
        <input id="m" 
          autoComplete="off" 
          value={msgTxt}
          onChange={handleMsgTxtChange}
        />
        <button onClick={sendMessage}>Send</button>
      </form>
    </div>
    );
}

export default ChatDashboard;
