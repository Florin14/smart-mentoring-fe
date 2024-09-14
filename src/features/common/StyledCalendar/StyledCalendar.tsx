import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import '../../../assets/css/StyledCalendar.css'
import { Text, Icon } from '@chakra-ui/react'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'

import { Box, useStyleConfig } from '@chakra-ui/react'
const Card: React.FC = (props: any) => {
  const { variant, children, ...rest } = props
  const styles = useStyleConfig('Card', { variant })

  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  )
}

const StyledDateCalendar: React.FC<any> = props => {
  const { selectRange, ...rest } = props
  const [value, onChange] = useState(new Date())
  return (
    <Card align="center" direction="column" w="100%" maxW="max-content" p="20px 15px" h="max-content" {...rest}>
      <Calendar
        onChange={e => {
          console.log(e)
        }}
        value={value}
        selectRange={selectRange}
        view={'month'}
        tileContent={<Text color="brand.500"></Text>}
        prevLabel={<Icon as={KeyboardArrowLeftIcon} w="24px" h="24px" mt="4px" />}
        nextLabel={<Icon as={KeyboardArrowRightIcon} w="24px" h="24px" mt="4px" />}
      />
    </Card>
  )
}

export default StyledDateCalendar
