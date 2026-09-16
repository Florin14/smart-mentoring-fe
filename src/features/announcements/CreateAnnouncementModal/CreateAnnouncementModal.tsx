import {
  alpha,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  TextField,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, FormProvider, useController, useForm } from 'react-hook-form'
import { InterestArea, Role } from '../../../types/User'
import { FormInput } from '../../common/FormInput'
import { AnnouncementDto } from '../../../types/Announcements'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectInterestAreasOptions, selectInterestAreasOptionsLoading, selectUserData } from '../../account/selectors'
import { fetchInterestAreasOptions } from '../../account/actions'
import { LoadingOverlay } from '../../common/LoadingOverlay'
import { addAnnouncement, updateAnnouncement } from '../actions'
import AddIcon from '@mui/icons-material/Add'
import { CreateInterestAreaModal } from '../CreateInterestAreaModal'

export type CreateAnnouncementType = {
  id: number
  title: string
  interestArea: InterestArea
  description: string
  price: number
}

interface CreateAnnouncementModalProps {
  isOpened: boolean
  handleClose: () => void
  announcement?: AnnouncementDto
}

export const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({
  isOpened,
  handleClose,
  announcement,
}) => {
  const userData = useAppSelector(selectUserData)
  const role = localStorage.getItem('authorities')
  const dispatch = useAppDispatch()
  const [interestAreaModelIsOpen, setInterestAreaModelIsOpen] = useState<boolean>(false)

  const formMethods = useForm<CreateAnnouncementType>()
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = formMethods
  const interestAreasOptions = useAppSelector(selectInterestAreasOptions)
  const interestAreasOptionsLoading = useAppSelector(selectInterestAreasOptionsLoading)

  const { field: title } = useController({ name: 'title', control })
  const { field: price } = useController({ name: 'price', control })
  const { field: interestArea } = useController({ name: 'interestArea', control })
  const { field: description } = useController({
    name: 'description',
    control,
    rules: { required: true },
  })

  const editMode = !!announcement

  useEffect(() => {
    if (announcement) {
      setValue('title', announcement.title)
      setValue('price', announcement.price)
      setValue('interestArea', announcement.interestAreas)
      setValue('description', announcement.description)
    }
  }, [announcement])

  useEffect(() => {
    if (isOpened) dispatch(fetchInterestAreasOptions())
  }, [isOpened])

  const handleAnnouncementSubmit: SubmitHandler<CreateAnnouncementType> = async formData => {
    if (!editMode) {
      dispatch(
        addAnnouncement({
          interestAreasId: formData.interestArea.id,
          userId: userData?.id,
          title: formData.title,
          price: formData.price,
          description: formData.description,
        })
      ).then(res => {
        if (res?.meta?.requestStatus === 'fulfilled') {
          handleClose()
        }
      })
    } else {
      dispatch(
        updateAnnouncement({
          id: announcement.id,
          interestAreasId: formData.interestArea.id,
          userId: userData?.id,
          title: formData.title,
          price: formData.price,
          description: formData.description,
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
      title: '',
      description: '',
      interestArea: undefined,
      price: undefined,
    })
    handleClose()
  }

  // Shouldn't be the case; just making sure
  if (role !== Role.MENTOR) return null

  return (
    <Dialog open={isOpened} onClose={handleCloseModal} disableScrollLock={true}>
      <LoadingOverlay visible={interestAreasOptionsLoading} />
      <StyledDialogTitle>{editMode ? 'Update' : 'Create'} Announcement</StyledDialogTitle>
      <FormProvider {...formMethods}>
        <FormWrapper onSubmit={handleSubmit(handleAnnouncementSubmit)}>
          <StyledDialogContent>
            <DialogInstructions>
              Fill in the details for {editMode ? 'this' : 'the new'} announcement
            </DialogInstructions>
            <FormInput
              label="Title"
              fieldName="title"
              options={{
                required: true,
                minLength: {
                  value: 3,
                  message: 'Title should be min 3 characters long',
                },
              }}
              onChange={newTitle => {
                title.onChange(newTitle.target.value)
              }}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              label="Price"
              name="price"
              size="small"
              color="secondary"
              type="number"
              error={!!errors.price}
              helperText={errors.price?.message}
              onChange={newPrice => {
                price.onChange(newPrice.target.value)
              }}
            />
            <InterestAreaWrapper>
              <Autocomplete
                options={interestAreasOptions || []}
                filterSelectedOptions
                renderInput={params => (
                  <TextField
                    {...params}
                    helperText={errors.interestArea?.message}
                    error={!!errors.interestArea?.message}
                    color="secondary"
                    InputLabelProps={{ shrink: true }}
                    label="Interest area"
                  />
                )}
                isOptionEqualToValue={(o, v) => (o?.id && v?.id ? o?.id === v?.id : o === v)}
                getOptionLabel={option => option?.name?.toString() || ''}
                onChange={(_, newInterestArea) => {
                  clearErrors('interestArea')
                  interestArea.onChange(newInterestArea, { shouldDirty: true })
                }}
              />
              <CreateInterestAreaButton onClick={() => setInterestAreaModelIsOpen(true)}>
                <AddIcon />
              </CreateInterestAreaButton>
            </InterestAreaWrapper>
            <FormInput
              label="Description"
              fieldName="description"
              options={{ maxLength: 200, required: true }}
              error={!!errors.description}
              helperText="Max 200 characters"
              onChange={newDescription => {
                description.onChange(newDescription.target.value)
              }}
              multiline
              rows={3}
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
      <CreateInterestAreaModal
        isOpened={interestAreaModelIsOpen}
        handleClose={() => {
          setInterestAreaModelIsOpen(false)
        }}
      />
    </Dialog>
  )
}

const FormWrapper = styled('form')`
  gap: 4px;
  width: 520px;
`

const StyledDialogTitle = styled(DialogTitle)`
  background: linear-gradient(135deg, ${alpha('#6C63FF', 0.1)} 0%, ${alpha('#FF6B9D', 0.06)} 100%);
  color: #E8E8F0;
  font-weight: 700;
  text-align: center;
  padding: 20px 24px;
  border-bottom: 1px solid ${alpha('#6C63FF', 0.1)};
`

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px !important;
`

const DialogInstructions = styled(DialogContentText)`
  margin-bottom: 8px;
  color: #9B9BB4;
`

const InterestAreaWrapper = styled('div')`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 44px;
  align-items: center;
  gap: 10px;
`

const CreateInterestAreaButton = styled('div')`
  color: #9D97FF;
  border: 1px dashed ${alpha('#6C63FF', 0.4)};
  border-radius: 12px;
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    border-color: #6C63FF;
    background: ${alpha('#6C63FF', 0.08)};
    color: #6C63FF;
  }
`
