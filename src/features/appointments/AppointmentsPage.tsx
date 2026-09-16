import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchAppointments } from './actions'
import { alpha, Avatar, Button, List, ListItem, ListItemAvatar, ListItemText, styled, Typography } from '@mui/material'

import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import AddIcon from '@mui/icons-material/Add'
import { selectAppointmentsData } from './selectors'
import { Role } from '../../types/User'
import { CreateAppointmentModal } from './CreateAppointmentModal'

const AppointmentsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const role = localStorage.getItem('authorities')

  const appointments = useAppSelector(selectAppointmentsData)

  useEffect(() => {
    dispatch(fetchAppointments())
  }, [])

  const [isCreateAppointmentModalOpen, setIsCreateAppointmentModalOpen] = useState(false)

  return (
    <Container>
      <Title variant="overline">Appointments</Title>
      {role === Role.MENTOR && (
        <CreateAppointmentButton
          variant="outlined"
          onClick={() => setIsCreateAppointmentModalOpen(true)}
        >
          <AddIcon /> Create Appointment
        </CreateAppointmentButton>
      )}
      <ListWrapper>
        <StyledList>
          {appointments.map(appointment => (
            <AppointmentItem key={appointment.id}>
              <ListItemAvatar>
                <StyledAvatar>
                  <AccessTimeFilledIcon sx={{ fontSize: 20 }} />
                </StyledAvatar>
              </ListItemAvatar>
              <ListItemText
                primary={`With ${
                  role === Role.STUDENT ? appointment.mentor?.fullName : appointment.student?.fullName
                } - ${appointment.locationDetails}`}
                secondary={appointment.date ? appointment.date.format('LLL') : ''}
                primaryTypographyProps={{ color: '#E8E8F0', fontWeight: 500 }}
                secondaryTypographyProps={{ color: '#9B9BB4' }}
              />
            </AppointmentItem>
          ))}
        </StyledList>
      </ListWrapper>
      <CreateAppointmentModal
        isOpened={isCreateAppointmentModalOpen}
        handleClose={() => {
          setIsCreateAppointmentModalOpen(false)
        }}
      />
    </Container>
  )
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 24px;
`

const Title = styled(Typography)`
  font-weight: 700;
  font-size: 28px;
  color: #E8E8F0;
  letter-spacing: -0.01em;
`

const CreateAppointmentButton = styled(Button)`
  margin: 24px 0;
  padding: 16px 32px;
  width: 100%;
  max-width: 500px;
  display: flex;
  gap: 8px;
  font-size: 0.95rem;
  border-color: ${alpha('#6C63FF', 0.4)};
  color: #9D97FF;
  border-radius: 16px;
  border-style: dashed;
  &:hover {
    border-color: #6C63FF;
    background: ${alpha('#6C63FF', 0.06)};
    border-style: dashed;
  }
`

const ListWrapper = styled('div')`
  width: 100%;
  max-width: 600px;
`

const StyledList = styled(List)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const AppointmentItem = styled(ListItem)`
  background: ${alpha('#131738', 0.6)};
  border: 1px solid ${alpha('#6C63FF', 0.1)};
  border-radius: 16px;
  padding: 16px;
  transition: all 0.2s ease;
  &:hover {
    border-color: ${alpha('#6C63FF', 0.25)};
    background: ${alpha('#131738', 0.8)};
  }
`

const StyledAvatar = styled(Avatar)`
  background: linear-gradient(135deg, ${alpha('#6C63FF', 0.2)} 0%, ${alpha('#FF6B9D', 0.15)} 100%);
  color: #9D97FF;
  width: 44px;
  height: 44px;
  border-radius: 12px;
`

export default AppointmentsPage
