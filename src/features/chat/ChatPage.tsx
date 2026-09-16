import React, { useEffect, useRef, useState } from 'react'
import {
  alpha,
  Avatar,
  IconButton,
  InputAdornment,
  styled,
  TextField,
  Typography,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SearchIcon from '@mui/icons-material/Search'
import CircleIcon from '@mui/icons-material/Circle'
import { useAppSelector } from '../../redux/hooks'
import { selectUserData } from '../account/selectors'
import { axiosInstance } from '../../api'

interface Contact {
  id: number
  fullName: string
  email: string
  role: string
}

interface ChatMessage {
  id?: number
  content: string
  senderId: number
  senderName?: string
  receiverId: number
  timestamp: string
  type?: string
}

const ChatPage: React.FC = () => {
  const userData = useAppSelector(selectUserData)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [searchText, setSearchText] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fetchContacts()
    connectWebSocket()
    return () => { wsRef.current?.close() }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (selectedContact) fetchConversation(selectedContact.id)
  }, [selectedContact])

  useEffect(() => {
    if (!searchText) {
      setFilteredContacts(contacts)
    } else {
      setFilteredContacts(
        contacts.filter(c => c.fullName?.toLowerCase().includes(searchText.toLowerCase()))
      )
    }
  }, [searchText, contacts])

  const connectWebSocket = () => {
    const token = localStorage.getItem('jwtToken')
    if (!token) return
    const ws = new WebSocket(`ws://localhost:8080/ws/chat?token=${token}`)
    ws.onopen = () => setConnected(true)
    ws.onmessage = (event) => {
      const data: ChatMessage = JSON.parse(event.data)
      if (data.type === 'message') {
        setMessages(prev => {
          if (prev.some(m => m.id === data.id)) return prev
          return [...prev, data]
        })
      }
    }
    ws.onclose = () => {
      setConnected(false)
      setTimeout(connectWebSocket, 5000)
    }
    ws.onerror = () => ws.close()
    wsRef.current = ws
  }

  const fetchContacts = async () => {
    try {
      const role = localStorage.getItem('authorities')
      const endpoint = role === 'MENTOR' ? '/users/students' : '/users/mentors'
      const res = await axiosInstance.get(endpoint)
      const data = Array.isArray(res.data) ? res.data : []
      setContacts(data)
      setFilteredContacts(data)
    } catch { setContacts([]) }
  }

  const fetchConversation = async (userId: number) => {
    try {
      const res = await axiosInstance.get(`/messages/users/${userId}`)
      setMessages(Array.isArray(res.data) ? res.data : [])
    } catch { setMessages([]) }
  }

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedContact || !wsRef.current || !userData) return
    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ receiverId: selectedContact.id, content: messageInput.trim() }))
      setMessageInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const getInitials = (name: string) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <Container>
      <ContactsPanel>
        <PanelHeader>
          <PanelTitle>Messages</PanelTitle>
          <StatusIndicator>
            <CircleIcon sx={{ fontSize: 8, color: connected ? '#00D68F' : '#FF4C6A' }} />
            <Typography sx={{ fontSize: '0.7rem', color: '#9B9BB4' }}>
              {connected ? 'Online' : 'Offline'}
            </Typography>
          </StatusIndicator>
        </PanelHeader>
        <SearchField
          placeholder="Search contacts..."
          size="small"
          fullWidth
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9B9BB4', fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />
        <ContactsList>
          {filteredContacts.map(contact => (
            <ContactItem
              key={contact.id}
              selected={selectedContact?.id === contact.id}
              onClick={() => setSelectedContact(contact)}
            >
              <ContactAvatar>{getInitials(contact.fullName)}</ContactAvatar>
              <ContactInfo>
                <ContactName>{contact.fullName}</ContactName>
                <ContactRole>{contact.role?.toLowerCase()}</ContactRole>
              </ContactInfo>
            </ContactItem>
          ))}
          {filteredContacts.length === 0 && (
            <EmptyText>No contacts found</EmptyText>
          )}
        </ContactsList>
      </ContactsPanel>

      <ChatPanel>
        {selectedContact ? (
          <>
            <ChatHeader>
              <ChatAvatar>{getInitials(selectedContact.fullName)}</ChatAvatar>
              <ChatHeaderInfo>
                <Typography sx={{ fontWeight: 600, color: '#E8E8F0' }}>
                  {selectedContact.fullName}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#9B9BB4' }}>
                  {selectedContact.email}
                </Typography>
              </ChatHeaderInfo>
            </ChatHeader>

            <MessagesArea>
              {messages.length === 0 && (
                <EmptyMessages>
                  <Typography sx={{ color: '#9B9BB4' }}>
                    No messages yet. Start the conversation!
                  </Typography>
                </EmptyMessages>
              )}
              {messages.map((msg, idx) => {
                const isMine = msg.senderId === userData?.id
                return (
                  <MessageRow key={msg.id || idx} isMine={isMine}>
                    {!isMine && (
                      <SmallAvatar>{getInitials(msg.senderName || selectedContact.fullName)}</SmallAvatar>
                    )}
                    <MessageBubble isMine={isMine}>
                      <Typography sx={{ fontSize: '0.9rem', color: '#E8E8F0', lineHeight: 1.5, wordBreak: 'break-word' }}>
                        {msg.content}
                      </Typography>
                      <MessageTime>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </MessageTime>
                    </MessageBubble>
                  </MessageRow>
                )
              })}
              <div ref={messagesEndRef} />
            </MessagesArea>

            <InputArea>
              <MessageInput
                placeholder="Type your message..."
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyDown={handleKeyPress}
                size="small"
                fullWidth
                multiline
                maxRows={3}
                autoComplete="off"
              />
              <SendBtn onClick={sendMessage} disabled={!messageInput.trim()}>
                <SendIcon sx={{ fontSize: 20 }} />
              </SendBtn>
            </InputArea>
          </>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <SendIcon sx={{ fontSize: 40, color: '#6C63FF', opacity: 0.5 }} />
            </EmptyIcon>
            <Typography sx={{ color: '#E8E8F0', fontWeight: 600, fontSize: '1.1rem' }}>
              Select a conversation
            </Typography>
            <Typography sx={{ color: '#9B9BB4', fontSize: '0.9rem' }}>
              Choose a contact from the list to start messaging
            </Typography>
          </EmptyState>
        )}
      </ChatPanel>
    </Container>
  )
}

export default ChatPage

const Container = styled('div')`
  display: flex;
  width: 100%;
  height: calc(100vh - 120px);
  gap: 16px;
`

const ContactsPanel = styled('div')`
  width: 300px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  background: ${alpha('#131738', 0.5)};
  border: 1px solid ${alpha('#6C63FF', 0.1)};
  border-radius: 20px;
  padding: 20px 16px;
  gap: 12px;
`

const PanelHeader = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const PanelTitle = styled(Typography)`
  font-weight: 700;
  font-size: 1.2rem;
  color: #E8E8F0;
`

const StatusIndicator = styled('div')`
  display: flex;
  align-items: center;
  gap: 4px;
`

const SearchField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 12px;
    background: ${alpha('#6C63FF', 0.05)};
    font-size: 0.85rem;
    fieldset { border-color: ${alpha('#6C63FF', 0.1)}; }
    &:hover fieldset { border-color: ${alpha('#6C63FF', 0.25)}; }
  }
`

const ContactsList = styled('div')`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: ${alpha('#6C63FF', 0.2)}; border-radius: 2px; }
`

const ContactItem = styled('div')<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${p => p.selected ? alpha('#6C63FF', 0.12) : 'transparent'};
  border: 1px solid ${p => p.selected ? alpha('#6C63FF', 0.25) : 'transparent'};
  &:hover { background: ${alpha('#6C63FF', 0.08)}; }
`

const ContactAvatar = styled(Avatar)`
  width: 42px;
  height: 42px;
  font-size: 0.85rem;
  font-weight: 600;
  background: linear-gradient(135deg, ${alpha('#6C63FF', 0.3)} 0%, ${alpha('#FF6B9D', 0.25)} 100%);
  color: #E8E8F0;
`

const ContactInfo = styled('div')`
  flex: 1;
  min-width: 0;
`

const ContactName = styled(Typography)`
  font-size: 0.9rem;
  font-weight: 600;
  color: #E8E8F0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ContactRole = styled(Typography)`
  font-size: 0.75rem;
  color: #9B9BB4;
  text-transform: capitalize;
`

const ChatPanel = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${alpha('#131738', 0.5)};
  border: 1px solid ${alpha('#6C63FF', 0.1)};
  border-radius: 20px;
  overflow: hidden;
`

const ChatHeader = styled('div')`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid ${alpha('#6C63FF', 0.08)};
`

const ChatAvatar = styled(Avatar)`
  width: 40px;
  height: 40px;
  font-size: 0.9rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
`

const ChatHeaderInfo = styled('div')``

const MessagesArea = styled('div')`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: ${alpha('#6C63FF', 0.15)}; border-radius: 3px; }
`

const MessageRow = styled('div')<{ isMine?: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  align-self: ${p => p.isMine ? 'flex-end' : 'flex-start'};
  max-width: 70%;
`

const SmallAvatar = styled(Avatar)`
  width: 28px;
  height: 28px;
  font-size: 0.65rem;
  background: ${alpha('#6C63FF', 0.2)};
  color: #9D97FF;
`

const MessageBubble = styled('div')<{ isMine?: boolean }>`
  padding: 10px 16px;
  border-radius: ${p => p.isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
  background: ${p => p.isMine
    ? `linear-gradient(135deg, ${alpha('#6C63FF', 0.25)} 0%, ${alpha('#FF6B9D', 0.15)} 100%)`
    : alpha('#1A1F42', 0.8)};
  border: 1px solid ${p => p.isMine ? alpha('#6C63FF', 0.15) : alpha('#6C63FF', 0.06)};
`

const MessageTime = styled(Typography)`
  font-size: 0.65rem;
  color: #9B9BB4;
  text-align: right;
  margin-top: 4px;
`

const InputArea = styled('div')`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  padding: 16px 24px;
  border-top: 1px solid ${alpha('#6C63FF', 0.08)};
`

const MessageInput = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 14px;
    background: ${alpha('#6C63FF', 0.05)};
    font-size: 0.9rem;
    fieldset { border-color: ${alpha('#6C63FF', 0.1)}; }
    &:hover fieldset { border-color: ${alpha('#6C63FF', 0.2)}; }
    &.Mui-focused fieldset { border-color: #6C63FF; }
  }
`

const SendBtn = styled(IconButton)`
  background: linear-gradient(135deg, #6C63FF 0%, #9D97FF 100%);
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  &:hover {
    background: linear-gradient(135deg, #7B73FF 0%, #ADA8FF 100%);
    box-shadow: 0 6px 16px ${alpha('#6C63FF', 0.4)};
  }
  &:disabled { background: ${alpha('#6C63FF', 0.15)}; color: ${alpha('#E8E8F0', 0.3)}; }
`

const EmptyState = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`

const EmptyIcon = styled('div')`
  width: 80px;
  height: 80px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${alpha('#6C63FF', 0.08)};
  margin-bottom: 8px;
`

const EmptyMessages = styled('div')`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const EmptyText = styled(Typography)`
  color: #9B9BB4;
  text-align: center;
  padding: 24px;
  font-size: 0.85rem;
`
