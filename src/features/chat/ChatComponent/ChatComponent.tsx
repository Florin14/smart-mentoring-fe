import React, { useEffect, useRef, useState } from 'react'
import { alpha, Avatar, IconButton, styled, TextField, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useAppSelector } from '../../../redux/hooks'
import { selectUserData } from '../../account/selectors'

interface ChatMessage {
  id?: number
  content: string
  senderId: number
  senderName: string
  receiverId: number
  timestamp: string
  type?: string
}

interface Contact {
  id: number
  fullName: string
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const userData = useAppSelector(selectUserData)

  useEffect(() => {
    connectWebSocket()
    fetchContacts()

    return () => {
      wsRef.current?.close()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (selectedContact) {
      fetchConversation(selectedContact.id)
    }
  }, [selectedContact])

  const connectWebSocket = () => {
    const token = localStorage.getItem('jwtToken')
    if (!token) return

    const wsUrl = `ws://localhost:8080/ws/chat?token=${token}`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      setConnected(true)
    }

    ws.onmessage = (event) => {
      const data: ChatMessage = JSON.parse(event.data)
      if (data.type === 'message') {
        setMessages(prev => [...prev, data])
      }
    }

    ws.onclose = () => {
      setConnected(false)
      setTimeout(connectWebSocket, 3000)
    }

    ws.onerror = () => {
      ws.close()
    }

    wsRef.current = ws
  }

  const fetchContacts = async () => {
    try {
      const { axiosInstance } = await import('../../../api')
      const role = localStorage.getItem('authorities')
      const endpoint = role === 'MENTOR' ? '/users/students' : '/users/mentors'
      const response = await axiosInstance.get(endpoint)
      setContacts(response.data || [])
    } catch {
      setContacts([])
    }
  }

  const fetchConversation = async (otherUserId: number) => {
    try {
      const { axiosInstance } = await import('../../../api')
      const response = await axiosInstance.get(`/messages/users/${otherUserId}`)
      setMessages(response.data || [])
    } catch {
      setMessages([])
    }
  }

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedContact || !wsRef.current || !userData) return

    const msg = {
      receiverId: selectedContact.id,
      content: messageInput.trim(),
    }

    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg))
      setMessages(prev => [
        ...prev,
        {
          content: msg.content,
          senderId: userData.id!,
          senderName: userData.fullName || '',
          receiverId: selectedContact.id,
          timestamp: new Date().toISOString(),
          type: 'message',
        },
      ])
      setMessageInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Container>
      <ContactList>
        {contacts.length === 0 && <EmptyText>No contacts yet</EmptyText>}
        {contacts.map(contact => (
          <ContactItem
            key={contact.id}
            selected={selectedContact?.id === contact.id}
            onClick={() => setSelectedContact(contact)}
          >
            <ContactAvatar>{contact.fullName?.charAt(0) || '?'}</ContactAvatar>
            <ContactName>{contact.fullName}</ContactName>
          </ContactItem>
        ))}
      </ContactList>

      {selectedContact ? (
        <ChatArea>
          <ChatHeader>
            <ContactAvatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
              {selectedContact.fullName?.charAt(0)}
            </ContactAvatar>
            <Typography sx={{ fontWeight: 600, color: '#E8E8F0', fontSize: '0.9rem' }}>
              {selectedContact.fullName}
            </Typography>
            <StatusDot connected={connected} />
          </ChatHeader>

          <MessagesList>
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} isMine={msg.senderId === userData?.id}>
                <MessageText>{msg.content}</MessageText>
                <MessageTime>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </MessageTime>
              </MessageBubble>
            ))}
            <div ref={messagesEndRef} />
          </MessagesList>

          <InputArea>
            <StyledInput
              placeholder="Type a message..."
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              size="small"
              fullWidth
              autoComplete="off"
            />
            <SendButton onClick={sendMessage} disabled={!messageInput.trim()}>
              <SendIcon sx={{ fontSize: 18 }} />
            </SendButton>
          </InputArea>
        </ChatArea>
      ) : (
        <EmptyChat>
          <Typography sx={{ color: '#9B9BB4', fontSize: '0.85rem' }}>
            Select a contact to start chatting
          </Typography>
        </EmptyChat>
      )}
    </Container>
  )
}

export default ChatComponent

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
`

const ContactList = styled('div')`
  display: flex;
  gap: 4px;
  padding: 8px 0;
  overflow-x: auto;
  border-bottom: 1px solid ${alpha('#6C63FF', 0.1)};
  margin-bottom: 8px;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${alpha('#6C63FF', 0.2)};
    border-radius: 2px;
  }
`

const ContactItem = styled('div')<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  background: ${props => (props.selected ? alpha('#6C63FF', 0.15) : 'transparent')};
  border: 1px solid ${props => (props.selected ? alpha('#6C63FF', 0.3) : 'transparent')};

  &:hover {
    background: ${alpha('#6C63FF', 0.08)};
  }
`

const ContactAvatar = styled(Avatar)`
  width: 28px;
  height: 28px;
  font-size: 0.75rem;
  background: linear-gradient(135deg, ${alpha('#6C63FF', 0.3)} 0%, ${alpha('#FF6B9D', 0.3)} 100%);
  color: #E8E8F0;
`

const ContactName = styled(Typography)`
  font-size: 0.8rem;
  color: #E8E8F0;
  font-weight: 500;
`

const ChatArea = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`

const ChatHeader = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid ${alpha('#6C63FF', 0.08)};
  margin-bottom: 8px;
`

const StatusDot = styled('div')<{ connected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => (props.connected ? '#00D68F' : '#FF4C6A')};
  margin-left: auto;
`

const MessagesList = styled('div')`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 0;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${alpha('#6C63FF', 0.2)};
    border-radius: 2px;
  }
`

const MessageBubble = styled('div')<{ isMine?: boolean }>`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 12px;
  align-self: ${props => (props.isMine ? 'flex-end' : 'flex-start')};
  background: ${props =>
    props.isMine
      ? `linear-gradient(135deg, ${alpha('#6C63FF', 0.3)} 0%, ${alpha('#FF6B9D', 0.2)} 100%)`
      : alpha('#131738', 0.8)};
  border: 1px solid ${props =>
    props.isMine ? alpha('#6C63FF', 0.2) : alpha('#6C63FF', 0.08)};
`

const MessageText = styled(Typography)`
  color: #E8E8F0;
  font-size: 0.85rem;
  line-height: 1.4;
  word-break: break-word;
`

const MessageTime = styled(Typography)`
  color: #9B9BB4;
  font-size: 0.65rem;
  text-align: right;
  margin-top: 2px;
`

const InputArea = styled('div')`
  display: flex;
  gap: 8px;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid ${alpha('#6C63FF', 0.08)};
`

const StyledInput = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 10px;
    background: ${alpha('#6C63FF', 0.06)};
    font-size: 0.85rem;
    fieldset {
      border-color: ${alpha('#6C63FF', 0.12)};
    }
    &:hover fieldset {
      border-color: ${alpha('#6C63FF', 0.25)};
    }
  }
`

const SendButton = styled(IconButton)`
  background: linear-gradient(135deg, #6C63FF 0%, #9D97FF 100%);
  color: white;
  width: 36px;
  height: 36px;
  &:hover {
    background: linear-gradient(135deg, #7B73FF 0%, #ADA8FF 100%);
    box-shadow: 0 4px 12px ${alpha('#6C63FF', 0.4)};
  }
  &:disabled {
    background: ${alpha('#6C63FF', 0.2)};
    color: ${alpha('#E8E8F0', 0.3)};
  }
`

const EmptyChat = styled('div')`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const EmptyText = styled(Typography)`
  color: #9B9BB4;
  font-size: 0.8rem;
  padding: 8px;
`
