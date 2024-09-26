import React, { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { styled, Tabs, Tab, Typography, css, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import { Loader } from '../common/Loader'
import { selectUserData } from '../account/selectors'
import { Role } from '../../types/User'
import ChatComponent from './ChatComponent/ChatComponent'
import { ChatDto } from '../../types/Chats'

export enum ChatCategory {
  FEED,
  FOLLOWED,
}

const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [selectedCategory, setSelectedCategory] = useState(ChatCategory.FEED)

  const userData = useAppSelector(selectUserData)
  const role = localStorage.getItem('authorities')

  const [createChatOpen, setCreateChatOpen] = useState(false)
  const [updatedChat, setUpdatedChat] = useState<ChatDto | undefined>(undefined)

  const handleOpenChatWhenUpdate = (chat: ChatDto) => {
    setUpdatedChat(chat)
    setCreateChatOpen(true)
  }

  const handleCloseCreateChat = () => {
    setCreateChatOpen(false)
    setUpdatedChat(undefined)
  }


  return (
    <Container>
      <Title variant="overline">Chats</Title>
      {role === Role.MENTOR && (
        <CreateChatButton variant="outlined" color="secondary" onClick={() => setCreateChatOpen(true)}>
          <AddIcon /> Create Chat
        </CreateChatButton>
      )}
      <Tabs value={selectedCategory} onChange={() => {}} indicatorColor="secondary">
        <StyledTab label="Feed" aria-selected={ChatCategory.FEED === selectedCategory} />
        {role === Role.MENTOR && (
          <StyledTab label="Your's" aria-selected={ChatCategory.FOLLOWED === selectedCategory} />
        )}
      </Tabs>
      <ChatComponent />
    </Container>
  )
}

export default ChatPage

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const Title = styled(Typography)`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 20px;
`

const Chats = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 600px;
  margin-top: 20px;
`

const EmptyChatsText = styled(Typography)`
  margin: 20px 0;
`

const StyledTab = styled(Tab)`
  ${props =>
    props['aria-selected'] &&
    css`
      color: ${props.theme.palette.secondary.main} !important;
    `}
`

const CreateChatButton = styled(Button)`
  padding: 30px;
  width: 500px;
  display: flex;
  gap: 5px;
  font-size: 16px;
`
