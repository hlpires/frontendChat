import React, { useState, useEffect } from 'react';
import { socket } from './Socket';

const Chat = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState("");
    const [showModal, setShowModal] = useState(true);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        socket.on('receiveMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            const user = newMessage.user;
            if (!users.includes(user)) {
                setUsers((prevUsers) => [...prevUsers, user]);
            }
        });

        socket.on('allMessages', (messages) => {
            setMessages(messages);
            console.log(messages)
            if (messages.length > 0) {
                let newUsers = []
                messages.forEach(message => {
                    if (!newUsers.includes(message.user)) {
                        newUsers = [...newUsers, message.user]
                    }
                });
                setUsers(newUsers)
            }
        });

        socket.on('connect', onConnect);

        return () => {
            socket.off('receiveMessage');
        };
    }, [users]);

    const handleUsernameSubmit = () => {
        if (username.trim()) {
            socket.emit('setUsername', username);
            setShowModal(false);
        } else {
            alert("Por favor, insira um nome válido.");
        }
    };

    const sendMessage = (event) => {
        event.preventDefault();
        if (message.trim()) {
            socket.emit('sendMessage', { message, user: username });
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Digite seu nome de usuário</h2>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nome do usuário"
                            className="username-input"
                        />
                        <button onClick={handleUsernameSubmit} className="submit-button">Entrar</button>
                    </div>
                </div>
            )}
            {!showModal && (
                <>
                    {isConnected && <p style={{ marginRight: "6px",  fontWeight: "bold", padding: "10px", margin: "10px", marginBottom: "0px", color: "green" }} ><span style={{ marginRight: "6px", color: "black" }}>Status:</span>Conectado</p>}
                    <h1 style={{ fontSize: "20px" }}> Chat com comunicação Real-Time desenvolvido por Higor Luis Pires</h1>
                    <div className="chat">
                        <div className="users">
                            <h2>Usuários</h2>
                            <ul style={{ overflowY: "auto" }}>
                                {users.map((user, index) => (
                                    <li key={index}>{user}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="message-box">
                            <div className="messages">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`message ${msg.user === username ? 'sent' : 'received'}`}
                                    >
                                        <strong>{msg.user}: </strong>{msg.message}
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={sendMessage} className="message-form">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Digite uma mensagem"
                                    className="message-input"
                                />
                                <button type="submit" className="send-button">Enviar</button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Chat;
