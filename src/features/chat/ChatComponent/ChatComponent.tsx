import React, { useEffect, useState } from 'react';
// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';

interface Message {
    sender: string;
    receiver: string;
    content: string;
    timestamp: string;
}

const ChatComponent: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState<string>('');
    const [receiverId, setReceiverId] = useState<number | null>(null);
    // const [client, setClient] = useState<Client | null>(null);

    // useEffect(() => {
    //     const stompClient = new Client({
    //         webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    //         reconnectDelay: 5000,
    //         onConnect: () => {
    //             console.log('Connected to WebSocket');

    //             // Subscribe to public messages
    //             stompClient.subscribe('/topic/public', (message) => {
    //                 const receivedMessage: Message = JSON.parse(message.body);
    //                 setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    //             });

    //             // Subscribe to private messages for the current user
    //             stompClient.subscribe(`/user/queue/private`, (message) => {
    //                 const receivedMessage: Message = JSON.parse(message.body);
    //                 setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    //             });
    //         },
    //         onStompError: (frame) => {
    //             console.error('STOMP error', frame);
    //         }
    //     });

    //     stompClient.activate();
    //     setClient(stompClient);

    //     return () => {
    //         stompClient.deactivate();
    //     };
    // }, []);

    // const sendMessage = () => {
    //     if (client && messageInput && receiverId) {
    //         const message = {
    //             sender: 'User', // Placeholder for logged-in user
    //             receiver: receiverId.toString(),
    //             content: messageInput,
    //             timestamp: new Date().toISOString(),
    //         };

    //         client.publish({
    //             destination: `/app/chat.privateMessage/${receiverId}`,
    //             body: JSON.stringify(message),
    //         });

    //         setMessageInput(''); // Clear input
    //     }
    // };

    return (
        <div style={{width: "100%", height: "100%"}}>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}: </strong> {msg.content} <em>({new Date(msg.timestamp).toLocaleString()})</em>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
            />
            <input
                type="number"
                value={receiverId || ''}
                onChange={(e) => setReceiverId(parseInt(e.target.value))}
                placeholder="Receiver ID"
            />
            {/* <button onClick={sendMessage}>Send Private Message</button> */}
        </div>
    );
};

export default ChatComponent;
