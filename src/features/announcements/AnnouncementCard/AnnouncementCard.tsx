import React from 'react'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'

import { alpha, Avatar, Button, IconButton, styled, Tooltip, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { AnnouncementUserResponseDTO } from '../../../types/Announcements'
import { useAppDispatch } from '../../../redux/hooks'
import { displaySnackbar } from '../../application/slice'
import { AnnouncementCategory } from '../AnnouncementsPage'
import { fetchAnnouncements, deleteAnnouncement } from '../actions'
import { InterestAreasResponseDTO } from '../../../types/InterestAreas'
import { handleContactMenu } from '../../chat/slice'

dayjs.extend(RelativeTime)

interface AnnouncementsCardProps {
  id: number
  title: string
  description: string
  price: number
  createdBy: AnnouncementUserResponseDTO
  interestAreas: InterestAreasResponseDTO
  category: AnnouncementCategory
  createdAtDate: Date
  onUpdateClick: () => void
}

export const AnnouncementCard: React.FC<AnnouncementsCardProps> = props => {
  const dispatch = useAppDispatch()
  const role = localStorage.getItem('authorities')
  const isMentor = role === 'MENTOR'
  const { id, title, description, price, createdBy, createdAtDate, interestAreas, category, onUpdateClick } = props

  const handleDelete = () => {
    dispatch(deleteAnnouncement(id)).then(() => {
      dispatch(fetchAnnouncements()).then(() => {
        dispatch(
          displaySnackbar({
            open: true,
            type: 'success',
            message: 'Ad deleted',
          })
        )
      })

    })
  }

  return (
    <Wrapper key={id}>
      <Section>
        <Profile>
          <AnnouncementUserAvatar
            variant="square"
            key={createdBy.id}
            src={`data:image/jpeg;base64,${createdBy.profilePicture}`}
          />
          <NameSection>
            <Fullname variant="body2">{createdBy.fullName}</Fullname>
            <Typography variant="body2">{dayjs(createdAtDate).fromNow()}</Typography>
          </NameSection>
        </Profile>
        <InterestArea variant="body2">{interestAreas.name}</InterestArea>
      </Section>
      <Header>
        <Title variant="h6">{title}</Title>
      </Header>
      <Body>
        <Typography variant="body2">{description}</Typography>
      </Body>
      <Footer>
        <Typography variant="body2" color="gray">
          Price: {price} RON/hour
        </Typography>
        {isMentor && category === AnnouncementCategory.FOLLOWED && (
          <>
            <ActionButtons>
              <Tooltip title="Edit">
                <IconButton onClick={onUpdateClick}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </ActionButtons>
          </>
        )}
        {/* {!isMentor && (
          <ViewProfileButton
            onClick={() => {
              dispatch(handleContactMenu({ isOpen: true }))
            }}
          >
            Contact
          </ViewProfileButton>
        )} */}
        {!isMentor && (
          <ViewProfileButton
            onClick={() => {
              // dispatch(handleContactMenu({ isOpen: true }))
            }}
          >
            Attend
          </ViewProfileButton>
        )}
      </Footer>
    </Wrapper>
  )
}

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  gap: 8px;
  width: 100%;
  min-height: 240px;
  background: ${alpha('#131738', 0.6)};
  backdrop-filter: blur(12px);
  border: 1px solid ${alpha('#6C63FF', 0.1)};
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    border-color: ${alpha('#6C63FF', 0.25)};
    box-shadow: 0 20px 40px -12px ${alpha('#6C63FF', 0.15)};
    transform: translateY(-2px);
  }
`

const Header = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Body = styled('div')`
  flex: 1;
  padding: 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #9B9BB4;
`

const Footer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid ${alpha('#6C63FF', 0.08)};
`

const Title = styled(Typography)`
  font-weight: 700;
  color: #E8E8F0;
`

const Fullname = styled(Typography)`
  font-weight: 600;
  color: #E8E8F0;
`

const InterestArea = styled(Typography)`
  font-weight: 500;
  font-style: italic;
  color: #9D97FF;
  font-size: 0.85rem;
  padding: 4px 12px;
  background: ${alpha('#6C63FF', 0.1)};
  border-radius: 8px;
`

const ActionButtons = styled('div')`
  display: flex;
  gap: 4px;
  .MuiIconButton-root {
    color: #9B9BB4;
    &:hover {
      color: #6C63FF;
      background: ${alpha('#6C63FF', 0.1)};
    }
  }
`

const Section = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const AnnouncementUserAvatar = styled(Avatar)`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 2px solid ${alpha('#6C63FF', 0.2)};
`

const Profile = styled('div')`
  display: flex;
  gap: 12px;
  align-items: center;
`

const NameSection = styled('div')`
  display: flex;
  flex-flow: column wrap;
  .MuiTypography-body2:last-child {
    color: #9B9BB4;
    font-size: 0.8rem;
  }
`

const ViewProfileButton = styled(Button)`
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  color: white;
  border-radius: 12px;
  padding: 6px 20px;
  font-weight: 600;
  font-size: 0.85rem;
  :hover {
    background: linear-gradient(135deg, #7B73FF 0%, #FF7DAD 100%);
    box-shadow: 0 8px 20px -6px ${alpha('#6C63FF', 0.4)};
  }
`
