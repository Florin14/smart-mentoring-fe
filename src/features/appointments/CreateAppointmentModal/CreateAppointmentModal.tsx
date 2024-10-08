import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, FormProvider, useController, useForm } from 'react-hook-form'
import { InterestArea, Role } from '../../../types/User'
import { FormInput } from '../../common/FormInput'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectInterestAreasOptionsLoading, selectUserData } from '../../account/selectors'
import { LoadingOverlay } from '../../common/LoadingOverlay'
import { createAppointment, updateAppointment } from '../actions'
import { AppointmentResponseDto } from '../../../types/Appointment'
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined'
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined'
import StyledCalendar from '../../common/StyledCalendar/StyledCalendar'
import dayjs from 'dayjs'

export type CreateAppointmentType = {
  locationDetails: string
}

export enum DatetimeType {
  TODAY,
  TOMMOROW,
  OTHER,
  ANYTIME,
  CHOSEN_TIME,
}

interface CreateAppointmentModalProps {
  isOpened: boolean
  handleClose: () => void
  appointment?: AppointmentResponseDto
}

export const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  isOpened,
  handleClose,
  appointment,
}) => {
  const userData = useAppSelector(selectUserData)
  const role = localStorage.getItem('authorities')
  const dispatch = useAppDispatch()

  const [appointmentDate, setAppointmentDate] = useState<any>(null)
  const [isCalendarShown, setIsCalendarShown] = useState<boolean>(false)

  const formMethods = useForm<CreateAppointmentType>()
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = formMethods
  const interestAreasOptionsLoading = useAppSelector(selectInterestAreasOptionsLoading)

  const { field: locationDetails } = useController({ name: 'locationDetails', control, rules: { required: true } })

  const [datepickerType, setDatepickerType] = useState<DatetimeType>(DatetimeType.TODAY)
  const [timepickerType, setTimepickerType] = useState<DatetimeType>(DatetimeType.ANYTIME)

  const editMode = !!appointment

  useEffect(() => {
    if (appointment) {
    }
  }, [appointment])

  const handleAppointmentSubmit: SubmitHandler<any> = async formData => {
    if (!editMode) {
      dispatch(
        createAppointment({
          studentId: 53,
          mentorId: 1,
          date: (appointmentDate && dayjs(appointmentDate).format('YYYY-MM-DD') + ' 18:00') || null,
          locationDetails: 'string',
        })
      ).then((res: any) => {
        if (res?.meta?.requestStatus === 'fulfilled') {
          handleClose()
        }
      })
    } else {
      dispatch(
        updateAppointment({
          assignment: { studentId: 1, mentorId: 2, date: '2024-09-08', locationDetails: 'string' },
          assignmentId: 1,
        })
      ).then((res: any) => {
        if (res?.meta?.requestStatus === 'fulfilled') {
          handleClose()
        }
      })
    }
  }

  const handleCloseModal = () => {
    handleClose()
    setAppointmentDate(null)
  }

  // Shouldn't be the case; just making sure
  if (role !== Role.MENTOR) return null

  return (
    <Dialog open={isOpened} onClose={handleCloseModal} disableScrollLock={false}>
      <LoadingOverlay visible={interestAreasOptionsLoading} />
      <StyledDialogTitle>{editMode ? 'Update' : 'Create'} Appointment</StyledDialogTitle>
      <FormProvider {...formMethods}>
        <FormWrapper onSubmit={handleSubmit(handleAppointmentSubmit)}>
          <StyledDialogContent>
            <DialogInstructions>Fill in the details for {editMode ? 'this' : 'the new'} appointment</DialogInstructions>
            <FormInput
              label="Location details"
              fieldName="Location details"
              options={{
                required: true,
                minLength: {
                  value: 3,
                  message: 'Title should be min 3 characters long',
                },
              }}
              onChange={newTitle => {
                locationDetails.onChange(newTitle.target.value)
              }}
              error={!!errors.locationDetails}
              helperText={errors.locationDetails?.message}
            />
            <DatepickerWrapper>
              <PickerTitleWrapper>
                <DateRangeOutlinedIcon />
                <PickerTitle>Alege o data</PickerTitle>
              </PickerTitleWrapper>
              <TogglesWrapper>
                <DateTimeToggle
                  selected={datepickerType === DatetimeType.TODAY}
                  onClick={() => {
                    setDatepickerType(DatetimeType.TODAY)
                  }}
                >
                  Azi
                </DateTimeToggle>
                <DateTimeToggle
                  selected={datepickerType === DatetimeType.TOMMOROW}
                  onClick={() => {
                    setDatepickerType(DatetimeType.TOMMOROW)
                  }}
                >
                  Maine
                </DateTimeToggle>
                <DateTimeToggle
                  selected={datepickerType === DatetimeType.OTHER}
                  isToChoose
                  onClick={() => {
                    setDatepickerType(DatetimeType.OTHER)
                    setIsCalendarShown(!isCalendarShown)
                  }}
                >
                  {appointmentDate ? dayjs(appointmentDate).format('DD.MM.YYYY') : 'Alege o data'}
                </DateTimeToggle>
              </TogglesWrapper>
            </DatepickerWrapper>
            {datepickerType === DatetimeType.OTHER && isCalendarShown && (
              <StyledCalendar
                setAppointmentDate={setAppointmentDate}
                setIsCalendarShown={setIsCalendarShown}
                appointmentDate={appointmentDate}
              />
            )}
            <TimepickerWrapper>
              <PickerTitleWrapper>
                <QueryBuilderOutlinedIcon />
                <PickerTitle>Alege timp</PickerTitle>
              </PickerTitleWrapper>
              <TogglesWrapper>
                <DateTimeToggle
                  selected={timepickerType === DatetimeType.ANYTIME}
                  onClick={() => {
                    setTimepickerType(DatetimeType.ANYTIME)
                  }}
                >
                  Orice ora
                </DateTimeToggle>
                <DateTimeToggle
                  selected={timepickerType === DatetimeType.CHOSEN_TIME}
                  isToChoose
                  onClick={() => {
                    setTimepickerType(DatetimeType.CHOSEN_TIME)
                  }}
                >
                  Alege ora
                </DateTimeToggle>
              </TogglesWrapper>
            </TimepickerWrapper>
          </StyledDialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="error">
              Cancel
            </Button>
            <Button color="info" type="submit" variant="outlined">
              {editMode ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </FormWrapper>
      </FormProvider>
    </Dialog>
  )
}

const FormWrapper = styled('form')`
  gap: 4px;
  width: 500px;
`

const StyledDialogTitle = styled(DialogTitle)`
  background: #ddd;
`

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const DialogInstructions = styled(DialogContentText)`
  margin-bottom: 15px;
`

const DatepickerWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
`

const TimepickerWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const PickerTitleWrapper = styled('div')`
  display: flex;
  width: 100%;
  gap: 5px;
`

const PickerTitle = styled(Typography)``

const DateTimeToggle = styled('div')<{ selected: boolean; isToChoose?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => (props.selected ? props.theme.palette.secondary.main : '#d1d1d1')};
  height: 40px;
  border-radius: 4px;
  color: ${props => (props.selected ? 'black' : '#d1d1d1')};
  cursor: pointer;
  position: relative;

  &::after {
    content: '';
    display: ${props => (props.selected && props.isToChoose ? 'block' : 'none')};
    position: absolute;
    bottom: -5px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid ${props => props.theme.palette.secondary.main};
  }
`

const TogglesWrapper = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
`
