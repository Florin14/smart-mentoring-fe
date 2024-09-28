import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import '../../../assets/css/StyledCalendar.css'
import { Text, Icon } from '@chakra-ui/react'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'

import { Box, useStyleConfig } from '@chakra-ui/react'
import { styled } from '@mui/material'

const Card: React.FC = (props: any) => {
  const { variant, children, ...rest } = props
  const styles = useStyleConfig('Card', { variant })

  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  )
}

const StyledCalendar: React.FC<any> = props => {
  const { setAppointmentDate, setIsCalendarShown, appointmentDate, ...rest } = props
  return (
    <CalendarCard {...rest}>
      <Calendar
        onChange={e => {
          setAppointmentDate(e)
          setIsCalendarShown(false)
        }}
        value={appointmentDate || new Date()}
        view={'month'}
        tileContent={<Text color="brand.500"></Text>}
        prevLabel={<Icon as={KeyboardArrowLeftIcon} w="24px" h="24px" mt="4px" />}
        nextLabel={<Icon as={KeyboardArrowRightIcon} w="24px" h="24px" mt="4px" />}
        minDate={new Date()}
      />
    </CalendarCard>
  )
}

export default StyledCalendar

const CalendarCard = styled(Card)`
  display: flex;
  align-items: center;
  flex-direction: column
  width: 100%;
  max-width: max-content;
  padding: 20px 15px;
  height: max-content;
`
