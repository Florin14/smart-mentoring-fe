import React, { useEffect, useState } from 'react'
import { over } from 'stompjs'
import SockJS from 'sockjs-client'
import { styled } from '@mui/material'

var stompClient: any = null
const ChatComponent: React.FC = () => {
  const [privateChats, setPrivateChats] = useState(new Map())
  const [tab, setTab] = useState('MESSAGE')
  const [userData, setUserData] = useState({
    username: '',
    receivername: '',
    connected: false,
    message: '',
  })
  useEffect(() => {
    connect()
  }, [])

  const token = localStorage.getItem('jwtToken')
  const connect = () => {
    let Sock = new SockJS('http://localhost:8080/ws')
    console.log(token)
    stompClient = over(Sock)
    stompClient.connect({ Authorization: `Bearer ${token}` }, onConnected, onError)
  }

  const onConnected = () => {
    console.log(4135)
    setUserData({ ...userData, connected: true })
    stompClient.subscribe('/chatroom/public', onMessageReceived)
    stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage)
    userJoin()
  }

  const userJoin = () => {
    var chatMessage = {
      senderId: 1,
      receiverId: 53,
      content: 'JOIN',
    }
    stompClient.send('/app/message', {}, JSON.stringify(chatMessage))
  }

  const onMessageReceived = (payload: any) => {
    var payloadData: any = JSON.parse(payload.body)
    switch (payloadData.status) {
      case 'JOIN':
        // if (!privateChats.keys() && !privateChats.get(payloadData.senderName)) {
        //   privateChats.set(payloadData.senderName, [])
        //   setPrivateChats(new Map(privateChats))
        // }
        break
    }
  }

  const onPrivateMessage = (payload: any) => {
    var payloadData = JSON.parse(payload.body)
    // if (privateChats.get(payloadData.senderName)) {
    //   privateChats.get(payloadData.senderName).push(payloadData)
    //   setPrivateChats(new Map(privateChats))
    // } else {
    //   let list = []
    //   list.push(payloadData)
    //   privateChats.set(payloadData.senderName, list)
    //   setPrivateChats(new Map(privateChats))
    // }
  }

  const onError = (err: any) => {}

  const handleMessage = (event: any) => {
    const { value } = event.target
    setUserData({ ...userData, message: value })
  }
  const sendValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderId: 1,
        receiverId: 53,
        content: 'MESSAGE',
      }
      stompClient.send('/app/message', {}, JSON.stringify(chatMessage))
      setUserData({ ...userData, message: '' })
    }
  }

  const sendPrivateValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderId: 1,
        receiverId: 53,
        content: userData.message,
      }

      if (userData.username !== tab) {
        // privateChats.get(tab).push(chatMessage)
        setPrivateChats(new Map(privateChats))
      }
      stompClient.send('/app/private-message?receiverId=53', {}, JSON.stringify(chatMessage))
      setUserData({ ...userData, message: '' })
    }
  }

  const handleUsername = (event: any) => {
    const { value } = event.target
    setUserData({ ...userData, username: value })
  }
  return (
    <Container>
      <ChatBox>
        <MemberList>
          <ul>
            <li
              onClick={() => {
                setTab('CHATROOM')
              }}
              className={`member ${tab === 'CHATROOM' && 'active'}`}
            >
              Chatroom
            </li>
            {[...privateChats.keys()].map((name, index) => (
              <li
                onClick={() => {
                  setTab(name)
                }}
                className={`member ${tab === name && 'active'}`}
                key={index}
              >
                {name}
              </li>
            ))}
          </ul>
        </MemberList>
        {tab !== 'CHATROOM' && (
          <div className="chat-content">
            <ul className="chat-messages">
              {/* {[...privateChats.get(tab)].map((chat, index) => (
                <li className={`message ${chat.senderName === userData.username && 'self'}`} key={index}>
                  {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                  <div className="message-data">{chat.message}</div>
                  {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                </li>
              ))} */}
            </ul>

            <div className="send-message">
              <input
                type="text"
                className="input-message"
                placeholder="enter the message"
                value={userData.message}
                onChange={handleMessage}
              />
              <button type="button" className="send-button" onClick={sendPrivateValue}>
                send
              </button>
            </div>
          </div>
        )}
      </ChatBox>
    </Container>
  )
}

export default ChatComponent

const Container = styled('div')`
  position: relative;
`

const RegisterContainer = styled('div')`
  //   position: fixed;
  padding: 30px;
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086), 0 100px 80px rgba(0, 0, 0, 0.12);
  top: 35%;
  left: 32%;
  display: flex;
  flex-direction: row;
`

const ChatBox = styled('div')`
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086), 0 100px 80px rgba(0, 0, 0, 0.12);
  margin: 40px 50px;
  height: 600px;
  padding: 10px;
  display: flex;
  flex-direction: row;
`

const MemberList = styled('div')`
  width: 20%;
`
