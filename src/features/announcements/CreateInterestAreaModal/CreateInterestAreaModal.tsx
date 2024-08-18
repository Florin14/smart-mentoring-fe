import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, styled } from '@mui/material'
import React, { useEffect } from 'react'
import { SubmitHandler, FormProvider, useController, useForm } from 'react-hook-form'
import { Role } from '../../../types/User'
import { FormInput } from '../../common/FormInput'
import { useAppDispatch } from '../../../redux/hooks'
import { addInterestArea, updateInterestArea } from '../../account/actions'
import { InterestAreasResponseDTO } from '../../../types/InterestAreas'

export type CreateInterestAreaType = {
  id: number
  name: string
}

interface CreateInterestAreaModalProps {
  isOpened: boolean
  handleClose: () => void
  interestArea?: InterestAreasResponseDTO
}

export const CreateInterestAreaModal: React.FC<CreateInterestAreaModalProps> = ({
  isOpened,
  handleClose,
  interestArea,
}) => {
  const role = localStorage.getItem('authorities')
  const dispatch = useAppDispatch()

  const formMethods = useForm<CreateInterestAreaType>()
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = formMethods

  const { field: name } = useController({
    name: 'name',
    control,
    rules: { required: true },
  })

  const editMode = !!interestArea

  useEffect(() => {
    if (interestArea) {
      setValue('name', interestArea.name)
    }
  }, [interestArea])

  const handleInterestAreaSubmit: SubmitHandler<CreateInterestAreaType> = async formData => {
    if (editMode) {
      dispatch(
        updateInterestArea({
          id: interestArea.id,
          name: formData.name,
        })
      ).then(res => {
        if (res?.meta?.requestStatus === 'fulfilled') {
          handleClose()
        }
      })
    } else {
      dispatch(
        addInterestArea({
          name: formData.name,
        })
      ).then(res => {
        if (res?.meta?.requestStatus === 'fulfilled') {
          handleClose()
        }
      })
    }
  }

  const handleCloseModal = () => {
    reset({
      name: '',
    })
    handleClose()
  }

  if (role !== Role.MENTOR) return null

  return (
    <Dialog open={isOpened} onClose={handleCloseModal} disableScrollLock={true}>
      <StyledDialogTitle>{editMode ? 'Update' : 'Create'} InterestArea</StyledDialogTitle>
      <FormProvider {...formMethods}>
        <FormWrapper onSubmit={handleSubmit(handleInterestAreaSubmit)}>
          <StyledDialogContent>
            <DialogInstructions>
              Fill in the details for {editMode ? 'this' : 'the new'} interest area
            </DialogInstructions>
            <FormInput
              label="Name"
              fieldName="name"
              options={{
                required: true,
                minLength: {
                  value: 3,
                  message: 'Name should be min 3 characters long',
                },
              }}
              onChange={newName => {
                name.onChange(newName.target.value)
              }}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
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

const InterestAreaWrapper = styled('div')`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 40px;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const CreateInterestAreaButton = styled('div')`
  // padding: 30px;
  // width: 500px;
  color: #f7941d;
  border: 1px solid #f7941d;
  border-radius: 4px;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  // gap: 5px;
  font-size: 10px;
`
