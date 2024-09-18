import React, { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { styled, Tabs, Tab, Typography, css, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import { Loader } from '../common/Loader'
import { AnnouncementDto } from '../../types/Announcements'
import { selectUserData } from '../account/selectors'
import { Role } from '../../types/User'

export enum AnnouncementCategory {
  FEED,
  FOLLOWED,
}

const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [selectedCategory, setSelectedCategory] = useState(AnnouncementCategory.FEED)

  const userData = useAppSelector(selectUserData)
  const role = localStorage.getItem('authorities')

  const [createAnnouncementOpen, setCreateAnnouncementOpen] = useState(false)
  const shouldOpenCreateAnnouncementModal = role === Role.MENTOR && createAnnouncementOpen
  const [updatedAnnouncement, setUpdatedAnnouncement] = useState<AnnouncementDto | undefined>(undefined)

  const handleOpenAnnouncementWhenUpdate = (announcement: AnnouncementDto) => {
    setUpdatedAnnouncement(announcement)
    setCreateAnnouncementOpen(true)
  }

  const handleCloseCreateAnnouncement = () => {
    setCreateAnnouncementOpen(false)
    setUpdatedAnnouncement(undefined)
  }

  // Load announcements data on page load
  useEffect(() => {
  }, [])

//   if (announcementsLoading) {
//     return <Loader fullscreen={true} />
//   }

  return (
    <Container>
      <Title variant="overline">Announcements</Title>
      {role === Role.MENTOR && (
        <CreateAnnouncementButton variant="outlined" color="secondary" onClick={() => setCreateAnnouncementOpen(true)}>
          <AddIcon /> Create Announcement
        </CreateAnnouncementButton>
      )}
      <Tabs value={selectedCategory} onChange={()=> {}} indicatorColor="secondary">
        <StyledTab label="Feed" aria-selected={AnnouncementCategory.FEED === selectedCategory} />
        {role === Role.MENTOR && (
          <StyledTab label="Your's" aria-selected={AnnouncementCategory.FOLLOWED === selectedCategory} />
        )}
      </Tabs>
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

const Announcements = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 600px;
  margin-top: 20px;
`

const EmptyAnnouncementsText = styled(Typography)`
  margin: 20px 0;
`

const StyledTab = styled(Tab)`
  ${props =>
    props['aria-selected'] &&
    css`
      color: ${props.theme.palette.secondary.main} !important;
    `}
`

const CreateAnnouncementButton = styled(Button)`
  padding: 30px;
  width: 500px;
  display: flex;
  gap: 5px;
  font-size: 16px;
`
